import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, guard } from "@/lib/http";
import { normalizeNameList } from "@/lib/utils";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await guard("ADMIN");
  if (error) return error;
  const b = await req.json();
  await prisma.subject.update({
    where: { id: params.id },
    data: {
      name: b.name,
      code: b.code || null,
      teacher: normalizeNameList(b.teacher),
      classId: b.classId || null,
    },
  });
  return ok();
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await guard("ADMIN");
  if (error) return error;
  await prisma.subject.delete({ where: { id: params.id } });
  return ok();
}
