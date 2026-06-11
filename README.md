# 3D Education Hub — Smart Tuition Management System

A modern, professional full-stack tuition management system with **Admin**, **Student**, and **Parent** portals. Built with Next.js (App Router), TypeScript, Tailwind CSS, Prisma, and email notifications.

> Developed by **AAHA** · Contact: **hubaibahamedaaha@gmail.com**

---

## ✨ Features

- **Three role-based portals** with secure JWT auth (httpOnly cookies, bcrypt passwords) and protected routes.
- **Modern UI**: dark/light mode, glassmorphism cards, 3D animated education background (floating books, graduation caps, pencils, academic particles, animated learning paths), smooth page transitions, responsive sidebar + navbar.
- **Admin**: manage students, parents, classes, subjects; generate login/test codes; manual & bulk attendance; late tracking; daily QR attendance; online MCQ tests with timing & expiry; auto-graded results; manual marks; homework & notes; fee records + receipts; leave approvals; teacher comments; announcements; email notifications; CSV reports; settings.
- **Student**: dashboard, attendance % & history, QR check-in/out, online tests via access code, MCQ exam with timer + instant results, **downloadable result photo card**, homework submission (PDF/image), notes, schedule, leaderboard, **AI Study Assistant**, profile.
- **Parent**: per-child dashboard, attendance (with check-in/out), marks & progress charts, fee status + receipts, homework status, teacher comments, leave requests, schedule, email notification history, profile.
- **Email integration** (Nodemailer): absence, low marks, new homework, fee due, upcoming test, and leave decision emails. If SMTP is not configured, emails are safely **logged** to the database and server console so the app runs out of the box.

## 🧰 Tech Stack

- **Frontend/Backend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Database**: Prisma ORM. Default is **SQLite** (zero-config, runs instantly). Easily switch to **Supabase/PostgreSQL**.
- **Auth**: `jose` (JWT) + `bcryptjs`
- **Email**: `nodemailer`
- **Charts**: `recharts` · **Animations**: `framer-motion` · **Icons**: `lucide-react` · **QR**: `qrcode` · **Result image export**: `html-to-image`

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Set up the database (generates client, creates schema, seeds demo data)
npm run setup

# 3. Run the dev server
npm run dev
```

Open http://localhost:3000

### Demo Credentials

| Role    | ID / Email          | Password  |
| ------- | ------------------- | --------- |
| Admin   | `admin@3dedu.hub`   | `admin123`|
| Student | `STU001`            | `1234`    |
| Parent  | `PAR001`            | `1234`    |

## ⚙️ Environment

Copy `.env.example` to `.env` (a working `.env` is already included for local dev).

```
DATABASE_URL="file:./dev.db"     # SQLite (default)
JWT_SECRET="<long-random-string>"
SMTP_HOST=""                      # leave blank to log emails instead of sending
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASS=""
EMAIL_FROM="3D Education Hub <no-reply@3dedu.hub>"
```

### Enabling real emails

Fill in `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (e.g. Gmail App Password or any SMTP provider). All notifications are then delivered by email and still recorded in the notification history.

### Switching to Supabase / PostgreSQL

1. In `prisma/schema.prisma`, change the datasource provider:
   ```prisma
   datasource db { provider = "postgresql"; url = env("DATABASE_URL") }
   ```
2. Set `DATABASE_URL` to your Supabase/Postgres connection string.
3. Run `npm run db:push && npm run db:seed`.

## 📦 Scripts

- `npm run dev` — start dev server
- `npm run build` / `npm run start` — production build & serve
- `npm run setup` — generate client + push schema + seed
- `npm run db:reset` — wipe & reseed the database

## 📁 Project Structure

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

## 🗄️ Database Models

users, students, parents, classes, subjects, attendance, qr_attendance_codes, tests, questions, test_attempts, results, homework, homework_submissions, notes, fees, receipts, leave_requests, announcements, email_notifications, schedules, teacher_comments, settings.

---

Developed by **AAHA** · hubaibahamedaaha@gmail.com
