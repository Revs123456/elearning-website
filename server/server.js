import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRouter, { usersStore } from './routes/auth.js';
import coursesRouter from './routes/courses.js';
import progressRouter from './routes/progress.js';

dotenv.config({ path: path.resolve(process.cwd(), 'server', '.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'change_this_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true }
  })
);

app.use('/api/auth', authRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/progress', progressRouter);

// Serve frontend
const publicDir = path.resolve(__dirname, '..', 'public');
app.use(express.static(publicDir));

app.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Thinkers app running at http://localhost:${PORT}`);
});
