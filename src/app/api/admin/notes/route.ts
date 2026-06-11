import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail, guard } from "@/lib/http";

export async function GET() {
  const { error } = await guard("ADMIN");
  if (error) return error;
  const notes = await prisma.note.findMany({
    include: { class: true, subject: true },
    orderBy: { createdAt: "desc" },
  });
  return ok(notes);
}

export async function POST(req: NextRequest) {
  const { error } = await guard("ADMIN");
  if (error) return error;
  const b = await req.json();
  if (!b.title || !b.fileUrl) return fail("Title and a file are required.");
  const note = await prisma.note.create({
    data: {
      title: b.title,
      description: b.description || null,
      classId: b.classId || null,
      subjectId: b.subjectId || null,
      fileUrl: b.fileUrl,
    },
  });
  return ok(note);
}
