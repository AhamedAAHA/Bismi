import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail, guard } from "@/lib/http";
import { normalizeNameList } from "@/lib/utils";

export async function GET() {
  const { error } = await guard("ADMIN");
  if (error) return error;
  const schedules = await prisma.schedule.findMany({
    include: { class: true, subject: true },
    orderBy: [{ day: "asc" }, { startTime: "asc" }],
  });
  return ok(schedules);
}

export async function POST(req: NextRequest) {
  const { error } = await guard("ADMIN");
  if (error) return error;
  const b = await req.json();
  if (!b.day || !b.startTime || !b.endTime) return fail("Day and times are required.");
  const s = await prisma.schedule.create({
    data: {
      classId: b.classId || null,
      subjectId: b.subjectId || null,
      day: b.day,
      startTime: b.startTime,
      endTime: b.endTime,
      teacher: normalizeNameList(b.teacher),
      room: b.room || null,
    },
  });
  return ok(s);
}
