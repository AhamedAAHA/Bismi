import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/http";
import { currentStudent } from "@/lib/portal";
import { todayStr, nowTimeStr } from "@/lib/utils";

// Student submits QR code to check in / out
export async function POST(req: NextRequest) {
  const student = await currentStudent();
  if (!student) return fail("Not authenticated", 401);
  const b = await req.json();
  const code = String(b.code || "").trim();
  if (!code) return fail("Please enter the QR code.");

  const qr = await prisma.qrAttendanceCode.findFirst({
    where: { code, active: true },
  });
  if (!qr) return fail("Invalid QR code.");
  if (new Date(qr.expiresAt) < new Date()) return fail("This QR code has expired.");

  const date = qr.date;
  const time = nowTimeStr();
  const lateThreshold =
    (await prisma.setting.findUnique({ where: { key: "lateThreshold" } }))?.value || "09:15";

  const existing = await prisma.attendance.findUnique({
    where: { studentId_date: { studentId: student.id, date } },
  });

  if (existing) {
    if (existing.checkOut) return fail("You have already checked out today.");
    // mark check-out
    await prisma.attendance.update({
      where: { id: existing.id },
      data: { checkOut: time },
    });
    return ok({ action: "checkout", time });
  }

  const status = time > lateThreshold ? "LATE" : "PRESENT";
  await prisma.attendance.create({
    data: {
      studentId: student.id,
      date,
      status,
      checkIn: time,
      method: "QR",
    },
  });
  return ok({ action: "checkin", time, status });
}
