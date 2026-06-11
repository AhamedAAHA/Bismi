import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail, guard } from "@/lib/http";
import { notifyUpcomingTest } from "@/lib/notify";

export async function GET() {
  const { error } = await guard("ADMIN");
  if (error) return error;
  const tests = await prisma.test.findMany({
    include: {
      class: true,
      subject: true,
      _count: { select: { questions: true, attempts: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return ok(tests);
}

export async function POST(req: NextRequest) {
  const { error } = await guard("ADMIN");
  if (error) return error;
  try {
    const b = await req.json();
    if (!b.title || !b.accessCode) return fail("Title and access code are required.");
    if (!b.startTime || !b.endTime) return fail("Start and end time are required.");

    const exists = await prisma.test.findUnique({ where: { accessCode: b.accessCode.toUpperCase() } });
    if (exists) return fail("Access code already exists.");

    const test = await prisma.test.create({
      data: {
        title: b.title,
        description: b.description || null,
        accessCode: b.accessCode.toUpperCase(),
        classId: b.classId || null,
        subjectId: b.subjectId || null,
        durationMin: Number(b.durationMin) || 30,
        startTime: new Date(b.startTime),
        endTime: new Date(b.endTime),
        published: b.published ?? true,
      },
    });

    if (b.notify) {
      notifyUpcomingTest(test.classId, test.title, test.accessCode, test.startTime).catch(() => {});
    }
    return ok(test);
  } catch (e) {
    console.error(e);
    return fail("Failed to create test.", 500);
  }
}
