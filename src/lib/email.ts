import nodemailer from "nodemailer";
import { prisma } from "./prisma";

interface SendArgs {
  to: string;
  toName?: string;
  subject: string;
  html: string;
  category?: string;
  parentId?: string;
  studentId?: string;
}

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;
  const host = process.env.SMTP_HOST;
  if (!host) return null;
  transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  return transporter;
}

function wrapTemplate(subject: string, inner: string) {
  return `
  <div style="font-family:Segoe UI,Arial,sans-serif;background:#f3f6fc;padding:24px;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e6ecf7;">
      <div style="background:linear-gradient(135deg,#3563ff,#06b6d4);padding:20px 24px;color:#fff;">
        <h1 style="margin:0;font-size:18px;">3D Education Hub</h1>
        <p style="margin:4px 0 0;font-size:12px;opacity:.9;">Smart Tuition Management System</p>
      </div>
      <div style="padding:24px;color:#1f2a44;font-size:14px;line-height:1.6;">
        <h2 style="font-size:16px;margin:0 0 12px;">${subject}</h2>
        ${inner}
      </div>
      <div style="padding:16px 24px;background:#f7f9fd;border-top:1px solid #eef2fb;color:#7a869a;font-size:11px;text-align:center;">
        Developed by AAHA &nbsp;•&nbsp; Contact: hubaibahamedaaha@gmail.com
      </div>
    </div>
  </div>`;
}

export async function sendEmail(args: SendArgs) {
  const { to, toName, subject, html, category = "GENERAL" } = args;
  const fullHtml = wrapTemplate(subject, html);
  const from = process.env.EMAIL_FROM || "3D Education Hub <no-reply@3dedu.hub>";
  let status: "SENT" | "FAILED" | "LOGGED" = "LOGGED";

  const tx = getTransporter();
  if (tx) {
    try {
      await tx.sendMail({ from, to, subject, html: fullHtml });
      status = "SENT";
    } catch (e) {
      console.error("[email] send failed:", e);
      status = "FAILED";
    }
  } else {
    // Dev fallback: log to server console so the app runs without SMTP creds
    console.log(
      `\n[email:LOGGED] To: ${to} | Subject: ${subject}\n${html.replace(/<[^>]+>/g, " ").trim()}\n`
    );
  }

  try {
    await prisma.emailNotification.create({
      data: {
        toEmail: to,
        toName,
        subject,
        body: html,
        category,
        status,
        parentId: args.parentId,
        studentId: args.studentId,
      },
    });
  } catch (e) {
    console.error("[email] db log failed:", e);
  }

  return status;
}
