import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail, guard } from "@/lib/http";
import { todayStr, pct } from "@/lib/utils";
import { notifyLowMarks } from "@/lib/notify";

export async function GET() {
  const { error } = await guard("ADMIN");
  if (error) return error;
  const results = await prisma.result.findMany({
    include: { student: { include: { user: true } }, test: true },
    orderBy: { createdAt: "desc" },
  });
  return ok(results);
}

export async function POST(req: NextRequest) {
  const { error } = await guard("ADMIN");
  if (error) return error;
  try {
    const b = await req.json();
    if (!b.studentId || !b.title) return fail("Student and title are required.");
    const score = Number(b.score) || 0;
    const total = Number(b.total) || 100;
    const result = await prisma.result.create({
      data: {
        studentId: b.studentId,
        title: b.title,
        subject: b.subject || null,
        score,
        total,
        type: "MANUAL",
        date: b.date || todayStr(),
      },
    });
    if (pct(score, total) < 40) {
      notifyLowMarks(b.studentId, b.title, score, total).catch(() => {});
    }
    return ok(result);
  } catch (e) {
    console.error(e);
    return fail("Failed to add result.", 500);
  }
}
