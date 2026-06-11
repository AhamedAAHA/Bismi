import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, guard } from "@/lib/http";

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await guard("ADMIN");
  if (error) return error;
  await prisma.schedule.delete({ where: { id: params.id } });
  return ok();
}
