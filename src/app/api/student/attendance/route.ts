import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/http";
import { currentStudent } from "@/lib/portal";
import { pct } from "@/lib/utils";

export async function GET() {
  const student = await currentStudent();
  if (!student) return fail("Not authenticated", 401);
  const records = await prisma.attendance.findMany({
    where: { studentId: student.id },
    orderBy: { date: "desc" },
  });
  const total = records.length;
  const present = records.filter((r) => r.status === "PRESENT").length;
  const late = records.filter((r) => r.status === "LATE").length;
  const absent = records.filter((r) => r.status === "ABSENT").length;
  return ok({
    records,
    summary: { total, present, late, absent, percentage: pct(present + late, total) },
  });
}
