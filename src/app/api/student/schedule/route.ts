import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/http";
import { currentStudent } from "@/lib/portal";

export async function GET() {
  const student = await currentStudent();
  if (!student) return fail("Not authenticated", 401);
  const schedules = await prisma.schedule.findMany({
    where: student.classId ? { OR: [{ classId: student.classId }, { classId: null }] } : {},
    include: { subject: true, class: true },
    orderBy: [{ startTime: "asc" }],
  });
  return ok(schedules);
}
