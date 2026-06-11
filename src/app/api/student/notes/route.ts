import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/http";
import { currentStudent } from "@/lib/portal";

export async function GET() {
  const student = await currentStudent();
  if (!student) return fail("Not authenticated", 401);
  const notes = await prisma.note.findMany({
    where: student.classId ? { OR: [{ classId: student.classId }, { classId: null }] } : {},
    include: { subject: true },
    orderBy: { createdAt: "desc" },
  });
  return ok(notes);
}
