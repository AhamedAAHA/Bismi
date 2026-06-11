import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail, guard } from "@/lib/http";
import { todayStr } from "@/lib/utils";
import { notifyAbsence } from "@/lib/notify";

// GET ?date=YYYY-MM-DD&classId=optional -> students with their attendance for that day
export async function GET(req: NextRequest) {
  const { error } = await guard("ADMIN");
  if (error) return error;
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date") || todayStr();
  const classId = searchParams.get("classId") || undefined;

  const students = await prisma.student.findMany({
    where: classId ? { classId } : {},
    include: { user: true, class: true },
    orderBy: { studentCode: "asc" },
  });
  const records = await prisma.attendance.findMany({ where: { date } });
  const map = new Map(records.map((r) => [r.studentId, r]));

  const rows = students.map((s) => ({
    studentId: s.id,
    name: s.user.name,
    studentCode: s.studentCode,
    className: s.class?.name || "-",
    record: map.get(s.id) || null,
  }));
  return ok({ date, rows });
}

// POST mark single/bulk attendance
// body: { date, entries: [{ studentId, status, checkIn?, checkOut? }] }
export async function POST(req: NextRequest) {
  const { error } = await guard("ADMIN");
  if (error) return error;
  try {
    const b = await req.json();
    const date = b.date || todayStr();
    const entries: any[] = b.entries || [];
    if (!entries.length) return fail("No attendance entries provided.");

    const absentStudentIds: string[] = [];
    for (const e of entries) {
      await prisma.attendance.upsert({
        where: { studentId_date: { studentId: e.studentId, date } },
        update: {
          status: e.status,
          checkIn: e.checkIn || null,
          checkOut: e.checkOut || null,
          method: b.method || "MANUAL",
          note: e.note || null,
        },
        create: {
          studentId: e.studentId,
          date,
          status: e.status,
          checkIn: e.checkIn || null,
          checkOut: e.checkOut || null,
          method: b.method || "MANUAL",
          note: e.note || null,
        },
      });
      if (e.status === "ABSENT") absentStudentIds.push(e.studentId);
    }

    // Email parents of absentees (only for today's records to avoid spam)
    if (date === todayStr()) {
      for (const sid of absentStudentIds) {
        notifyAbsence(sid, date).catch(() => {});
      }
    }

    return ok({ count: entries.length });
  } catch (e) {
    console.error(e);
    return fail("Failed to save attendance.", 500);
  }
}
