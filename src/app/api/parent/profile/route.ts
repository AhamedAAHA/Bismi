import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/http";
import { currentParent } from "@/lib/portal";
import { hashPassword, verifyPassword } from "@/lib/auth";

export async function GET() {
  const parent = await currentParent();
  if (!parent) return fail("Not authenticated", 401);
  return ok({
    name: parent.user.name,
    email: parent.user.email,
    parentCode: parent.parentCode,
    phone: parent.phone,
    occupation: parent.occupation,
    address: parent.address,
    children: parent.children.map((c) => ({ name: c.user.name, code: c.studentCode, className: c.class?.name })),
  });
}

export async function PUT(req: NextRequest) {
  const parent = await currentParent();
  if (!parent) return fail("Not authenticated", 401);
  const b = await req.json();
  if (b.currentPassword && b.newPassword) {
    const valid = await verifyPassword(b.currentPassword, parent.user.password);
    if (!valid) return fail("Current password is incorrect.");
    if (b.newPassword.length < 4) return fail("New password must be at least 4 characters.");
    await prisma.user.update({
      where: { id: parent.userId },
      data: { password: await hashPassword(b.newPassword) },
    });
  }
  return ok();
}
