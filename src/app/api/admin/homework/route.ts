import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail, guard } from "@/lib/http";
import { notifyNewHomework } from "@/lib/notify";

export async function GET() {
  const { error } = await guard("ADMIN");
  if (error) return error;
  const homework = await prisma.homework.findMany({
    include: {
      class: true,
      subject: true,
      _count: { select: { submissions: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return ok(homework);
}

export async function POST(req: NextRequest) {
  const { error } = await guard("ADMIN");
  if (error) return error;
  try {
    const b = await req.json();
    if (!b.title || !b.deadline) return fail("Title and deadline are required.");
    const hw = await prisma.homework.create({
      data: {
        title: b.title,
        description: b.description || null,
        classId: b.classId || null,
        subjectId: b.subjectId || null,
        fileUrl: b.fileUrl || null,
        deadline: new Date(b.deadline),
      },
    });
    if (b.notify) {
      notifyNewHomework(hw.classId, hw.title, hw.deadline).catch(() => {});
    }
    return ok(hw);
  } catch (e) {
    console.error(e);
    return fail("Failed to create homework.", 500);
  }
}
