import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail, guard } from "@/lib/http";

export async function GET() {
  const { error } = await guard("ADMIN");
  if (error) return error;
  const subjects = await prisma.subject.findMany({
    include: { class: true },
    orderBy: { createdAt: "asc" },
  });
  return ok(subjects);
}

export async function POST(req: NextRequest) {
  const { error } = await guard("ADMIN");
  if (error) return error;
  const b = await req.json();
  if (!b.name) return fail("Subject name is required.");
  const subject = await prisma.subject.create({
    data: {
      name: b.name,
      code: b.code || null,
      teacher: b.teacher || null,
      classId: b.classId || null,
    },
  });
  return ok(subject);
}
