# Thinkers E‑Learning Platform

A modern e‑learning web app with animated hero, 6-course grid, email OTP sign-in, modules + quizzes, progress dashboard, and auto-generated certificates.

## Features
- Animated hero: "Hello, Welcome Thinkers!"
- 6 course cards in a responsive grid
- Vibrant gradient background, smooth scrolling, micro-interactions
- Email OTP authentication (Nodemailer via SMTP)
- Modules per course with end-of-module quiz
- Progress dashboard and per-course tracking
- Auto-generated digital certificate (Canvas) after completing all modules & quizzes
- Responsive design (mobile + desktop)

Optional (included as stubs):
- Progress bars per course
- Profile section (photo, name, certificates)
- AI-based module suggestions (simple heuristic stub)

## Stack
- Frontend: HTML/CSS/JS (vanilla), Canvas for certificate
- Backend: Node.js, Express, express-session
- Email: Nodemailer (SMTP)

## Getting Started
1) Requirements
- Node.js 18+
- An SMTP account (e.g., Gmail App Password, Mailtrap, SendGrid SMTP)

2) Setup
- Copy `.env.example` to `server/.env` and fill values.
- Install dependencies:
```
npm install
```
- Run the app (serves frontend from `public/`):
```
npm run start
```
- Dev mode (auto-reload):
```
npm run dev
```
- Open:
```
http://localhost:3000
```

## Environment Variables (server/.env)
See `server/.env.example`.

## Data & Persistence
- This demo uses in-memory storage for users, OTPs, sessions, and progress. Data resets on server restart.
- To persist, swap to a database (e.g., SQLite, Postgres, MongoDB). The code is modular to facilitate this.

## Security Notes
- Session store is memory-based and not for production use.
- Always secure cookies and enable HTTPS in production.
- Never commit real credentials.

## Project Structure
```
my webpage/
├─ public/
│  ├─ index.html
│  ├─ styles.css
│  └─ app.js
├─ server/
│  ├─ routes/
│  │  ├─ auth.js
│  │  ├─ courses.js
│  │  └─ progress.js
│  ├─ utils/
│  │  └─ mailer.js
│  ├─ data/
│  │  └─ courses.json
│  ├─ server.js
│  └─ .env.example
├─ package.json
└─ README.md
```

## Certificates
- Certificates generate client-side after completing all modules and quizzes for a course. The certificate is downloadable as PNG.

## Customization
- Update branding, colors, and typography in `public/styles.css`.
- Add/edit courses in `server/data/courses.json`.

## Troubleshooting
- Email not sending: verify SMTP creds and allowlist.
- CORS/session issues: the app serves frontend and backend from same origin by default (localhost:3000).

## License
MIT
