import nodemailer from 'nodemailer';

export async function sendOtpEmail(to, otp) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });

  const from = process.env.SMTP_FROM || 'no-reply@example.com';

  await transporter.sendMail({
    from,
    to,
    subject: 'Your Thinkers OTP Code',
    html: `<div style="font-family:Inter,Arial,sans-serif;font-size:16px">
      <p>Hello Thinker,</p>
      <p>Your OTP code is:</p>
      <p style="font-size:28px;font-weight:700;letter-spacing:3px">${otp}</p>
      <p>This code expires in 5 minutes.</p>
      <p>— Thinkers Academy</p>
    </div>`
  });
}
