import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { ok, fail, guard } from "@/lib/http";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await guard("ADMIN");
  if (error) return error;
  try {
    const b = await req.json();
    const parent = await prisma.parent.findUnique({ where: { id: params.id } });
    if (!parent) return fail("Parent not found.", 404);

    await prisma.parent.update({
      where: { id: params.id },
      data: {
        phone: b.phone ?? undefined,
        occupation: b.occupation ?? undefined,
        address: b.address ?? undefined,
      },
    });
    const userData: any = {};
    if (b.name) userData.name = b.name;
    if (b.email !== undefined) userData.email = b.email || null;
    if (b.active !== undefined) userData.active = b.active;
    if (b.password) userData.password = await hashPassword(b.password);
    if (Object.keys(userData).length) {
      await prisma.user.update({ where: { id: parent.userId }, data: userData });
    }
    return ok();
  } catch (e) {
    console.error(e);
    return fail("Failed to update parent.", 500);
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await guard("ADMIN");
  if (error) return error;
  const parent = await prisma.parent.findUnique({ where: { id: params.id } });
  if (!parent) return fail("Parent not found.", 404);
  await prisma.user.delete({ where: { id: parent.userId } });
  return ok();
}
