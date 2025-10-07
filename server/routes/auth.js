import express from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { sendOtpEmail } from '../utils/mailer.js';

export const usersStore = new Map(); // email -> { id, email, passwordHash, name, photoUrl, progress: {} }
const otpStore = new Map(); // email -> { otp, expires }

const router = express.Router();

function requireAuth(req, res, next) {
  if (req.session && req.session.userEmail && usersStore.has(req.session.userEmail)) return next();
  return res.status(401).json({ error: 'Not authenticated' });
}

router.get('/me', (req, res) => {
  const email = req.session?.userEmail;
  if (!email || !usersStore.has(email)) return res.json({ user: null });
  const { id, passwordHash, ...safe } = usersStore.get(email);
  res.json({ user: safe });
});

router.post('/request-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  
  const testMode = process.env.TEST_MODE === 'true';
  const otp = testMode ? '123456' : Math.floor(100000 + Math.random() * 900000).toString();
  const expires = Date.now() + 5 * 60 * 1000; // 5 minutes
  otpStore.set(email, { otp, expires });

  if (testMode) {
    console.log(`TEST MODE: OTP for ${email} is: ${otp}`);
    return res.json({ ok: true, message: 'TEST MODE: Use OTP 123456' });
  }

  try {
    await sendOtpEmail(email, otp);
  } catch (e) {
    console.error('Email error:', e);
    return res.status(500).json({ error: 'Failed to send OTP. Please check SMTP configuration.' });
  }
  res.json({ ok: true, message: 'OTP sent to email' });
});

router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore.get(email);
  if (!record) return res.status(400).json({ error: 'No OTP requested' });
  if (Date.now() > record.expires) return res.status(400).json({ error: 'OTP expired' });
  if (record.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });
  req.session.emailVerified = email;
  res.json({ ok: true });
});

router.post('/set-password', async (req, res) => {
  const { email, password, name } = req.body;
  if (req.session.emailVerified !== email) return res.status(400).json({ error: 'Email not verified' });
  if (!password || password.length < 6) return res.status(400).json({ error: 'Password too short' });

  const passwordHash = await bcrypt.hash(password, 10);

  if (!usersStore.has(email)) {
    usersStore.set(email, { id: uuidv4(), email, passwordHash, name: name || 'Thinker', photoUrl: '', progress: {} });
  } else {
    const existing = usersStore.get(email);
    existing.passwordHash = passwordHash;
    if (name) existing.name = name;
    usersStore.set(email, existing);
  }

  // login
  req.session.userEmail = email;
  delete req.session.emailVerified;
  otpStore.delete(email);

  const { id, passwordHash: _, ...safe } = usersStore.get(email);
  res.json({ ok: true, user: safe });
});

router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: 'All fields required' });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  
  if (usersStore.has(email)) {
    return res.status(400).json({ error: 'Email already registered' });
  }
  
  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: uuidv4(),
    email,
    passwordHash,
    firstName,
    lastName,
    name: `${firstName} ${lastName}`,
    photoUrl: '',
    progress: {}
  };
  
  usersStore.set(email, user);
  req.session.userEmail = email;
  
  const { id, passwordHash: _, ...safe } = user;
  res.json({ ok: true, user: safe });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = usersStore.get(email);
  if (!user) return res.status(400).json({ error: 'User not found' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
  req.session.userEmail = email;
  const { id, passwordHash, ...safe } = user;
  res.json({ ok: true, user: safe });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

export default router;
export { requireAuth };
