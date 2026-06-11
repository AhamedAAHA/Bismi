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

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await guard("ADMIN");
  if (error) return error;
  try {
    const b = await req.json();
    const options: string[] = (b.options || []).filter((o: string) => o?.trim());
    if (!b.text?.trim()) return fail("Question text is required.");
    if (options.length < 2) return fail("At least 2 options are required.");
    if (b.correct === undefined || b.correct < 0 || b.correct >= options.length) {
      return fail("Please select a valid correct answer.");
    }
    const count = await prisma.question.count({ where: { testId: params.id } });
    const q = await prisma.question.create({
      data: {
        testId: params.id,
        text: b.text,
        options: JSON.stringify(options),
        correct: Number(b.correct),
        marks: Number(b.marks) || 1,
        order: count,
      },
    });
    await recalcTotal(params.id);
    return ok(q);
  } catch (e) {
    console.error(e);
    return fail("Failed to add question.", 500);
  }
}
