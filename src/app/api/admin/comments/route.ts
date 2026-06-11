import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail, guard } from "@/lib/http";
import { todayStr } from "@/lib/utils";

export async function GET() {
  const { error } = await guard("ADMIN");
  if (error) return error;
  const comments = await prisma.teacherComment.findMany({
    include: { student: { include: { user: true } } },
    orderBy: { createdAt: "desc" },
  });
  return ok(comments);
}

export async function POST(req: NextRequest) {
  const { error } = await guard("ADMIN");
  if (error) return error;
  const b = await req.json();
  if (!b.studentId || !b.comment) return fail("Student and comment are required.");
  const c = await prisma.teacherComment.create({
    data: {
      studentId: b.studentId,
      teacher: b.teacher || "Admin",
      comment: b.comment,
      date: b.date || todayStr(),
    },
  });
  return ok(c);
}
