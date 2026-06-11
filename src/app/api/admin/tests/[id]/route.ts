import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail, guard } from "@/lib/http";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await guard("ADMIN");
  if (error) return error;
  const test = await prisma.test.findUnique({
    where: { id: params.id },
    include: {
      class: true,
      subject: true,
      questions: { orderBy: { order: "asc" } },
      attempts: { include: { student: { include: { user: true } } } },
    },
  });
  if (!test) return fail("Test not found.", 404);
  return ok(test);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await guard("ADMIN");
  if (error) return error;
  const b = await req.json();
  const data: any = {};
  if (b.title) data.title = b.title;
  if (b.description !== undefined) data.description = b.description || null;
  if (b.classId !== undefined) data.classId = b.classId || null;
  if (b.subjectId !== undefined) data.subjectId = b.subjectId || null;
  if (b.durationMin) data.durationMin = Number(b.durationMin);
  if (b.startTime) data.startTime = new Date(b.startTime);
  if (b.endTime) data.endTime = new Date(b.endTime);
  if (b.published !== undefined) data.published = b.published;
  await prisma.test.update({ where: { id: params.id }, data });
  return ok();
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await guard("ADMIN");
  if (error) return error;
  await prisma.test.delete({ where: { id: params.id } });
  return ok();
}
