import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail, guard } from "@/lib/http";

async function recalcTotal(testId: string) {
  const agg = await prisma.question.aggregate({
    where: { testId },
    _sum: { marks: true },
  });
  await prisma.test.update({
    where: { id: testId },
    data: { totalMarks: agg._sum.marks || 0 },
  });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await guard("ADMIN");
  if (error) return error;
  const b = await req.json();
  const options: string[] = (b.options || []).filter((o: string) => o?.trim());
  if (options.length < 2) return fail("At least 2 options are required.");
  const q = await prisma.question.update({
    where: { id: params.id },
    data: {
      text: b.text,
      options: JSON.stringify(options),
      correct: Number(b.correct),
      marks: Number(b.marks) || 1,
    },
  });
  await recalcTotal(q.testId);
  return ok();
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await guard("ADMIN");
  if (error) return error;
  const q = await prisma.question.delete({ where: { id: params.id } });
  await recalcTotal(q.testId);
  return ok();
}
