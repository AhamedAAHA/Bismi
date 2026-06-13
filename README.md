# 3D Education Hub - Smart Tuition Management System

A modern full-stack tuition management system with **Admin**, **Student**, and **Parent** portals. Built with Next.js (App Router), TypeScript, Tailwind CSS, Prisma, Supabase PostgreSQL, and email notifications.

> Developed by **AAHA** · Contact: **hubaibahamedaaha@gmail.com**

---

## Features

- **Three role-based portals** with secure JWT auth (httpOnly cookies, bcrypt passwords) and protected routes.
- **Modern UI**: dark/light mode, glassmorphism cards, 3D animated education background (floating books, graduation caps, pencils, academic particles, animated learning paths), smooth page transitions, responsive sidebar + navbar.
- **Admin**: manage students, parents, classes, subjects; generate login/test codes; manual & bulk attendance; late tracking; daily QR attendance; online MCQ tests with timing & expiry; auto-graded results; manual marks; homework & notes; fee records + receipts; leave approvals; teacher comments; announcements; email notifications; CSV reports; settings.
- **Student**: dashboard, attendance % & history, QR check-in/out, online tests via access code, MCQ exam with timer + instant results, **downloadable result photo card**, homework submission (PDF/image), notes, schedule, leaderboard, **AI Study Assistant**, profile.
- **Parent**: per-child dashboard, attendance (with check-in/out), marks & progress charts, fee status + receipts, homework status, teacher comments, leave requests, schedule, email notification history, profile.
- **Email integration** (Nodemailer): absence, low marks, new homework, fee due, upcoming test, and leave decision emails. If SMTP is not configured, emails are safely **logged** to the database and server console.

## Tech Stack

- **Frontend/Backend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Database**: Prisma ORM + **Supabase PostgreSQL**
- **Auth**: `jose` (JWT) + `bcryptjs`
- **Email**: `nodemailer`
- **Charts**: `recharts` · **Animations**: `framer-motion` · **Icons**: `lucide-react` · **QR**: `qrcode` · **Result image export**: `html-to-image`

## Getting Started (Supabase)

```bash
# 1. Install dependencies
npm install

# 2. Create .env from template and fill Supabase values
cp .env.example .env

# 3. Push schema + seed base data
npm run db:push
npm run db:seed

# 4. Run the dev server
npm run dev
```

Open http://localhost:3000

Seed creates base accounts and core settings. No sample students/marks/tests are inserted.
Default parent access is a shared account code `PARENT` (password configurable via `SEED_PARENT_PASSWORD`).

## Environment

```
DATABASE_URL="<Supabase pooled URL (port 6543)>"
DIRECT_URL="<Supabase direct URL (port 5432)>"
JWT_SECRET="<long-random-string>"
SMTP_HOST=""                      # leave blank to log emails instead of sending
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASS=""
EMAIL_FROM="3D Education Hub <no-reply@3dedu.hub>"
```

### Enabling real emails

Fill in `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (e.g. Gmail App Password or any SMTP provider). All notifications are then delivered by email and still recorded in the notification history.

### Vercel Deployment

1. Push this repo to GitHub/GitLab/Bitbucket.
2. Import the repo in Vercel.
3. In Vercel Project Settings -> Environment Variables, add:
   `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`, any required `AIML_*` variables.
4. Deploy once.
5. Run schema and seed against production database:
   `npx prisma db push`
   `npm run db:seed`
   (run these with the same production env vars)

The app build already runs `prisma generate`, so it is ready for Vercel serverless deployment.

## Scripts

- `npm run dev` — start dev server
- `npm run build` / `npm run start` — production build & serve
- `npm run setup` — generate client + push schema + seed
- `npm run db:reset` — wipe & reseed the database

## Project Structure

```
prisma/                 Prisma schema + seed
src/
  app/
    (public)            landing, login pages
    admin/              admin portal pages
    student/            student portal pages
    parent/             parent portal pages
    api/                route handlers (admin / student / parent / auth)
    receipt/[id]        printable payment receipt
  components/           UI components, dashboard shell, animated background
  lib/                  prisma, auth, email, notify, helpers
  middleware.ts         role-based route protection
```

## Database Models

users, students, parents, classes, subjects, attendance, qr_attendance_codes, tests, questions, test_attempts, results, homework, homework_submissions, notes, fees, receipts, leave_requests, announcements, email_notifications, schedules, teacher_comments, settings.

---

Developed by **AAHA** · hubaibahamedaaha@gmail.com
