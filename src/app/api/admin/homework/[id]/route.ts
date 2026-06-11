import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, guard } from "@/lib/http";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await guard("ADMIN");
  if (error) return error;
  const hw = await prisma.homework.findUnique({
    where: { id: params.id },
    include: {
      class: true,
      subject: true,
      submissions: { include: { student: { include: { user: true } } }, orderBy: { submittedAt: "desc" } },
    },
  });
  return ok(hw);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await guard("ADMIN");
  if (error) return error;
  await prisma.homework.delete({ where: { id: params.id } });
  return ok();
}
