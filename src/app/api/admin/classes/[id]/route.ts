import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail, guard } from "@/lib/http";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await guard("ADMIN");
  if (error) return error;
  const b = await req.json();
  await prisma.class.update({
    where: { id: params.id },
    data: { name: b.name, section: b.section || null, room: b.room || null },
  });
  return ok();
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await guard("ADMIN");
  if (error) return error;
  await prisma.class.delete({ where: { id: params.id } });
  return ok();
}
