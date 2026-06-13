import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { ok, fail, guard } from "@/lib/http";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await guard("ADMIN");
  if (error) return error;
  try {
    const b = await req.json();
    const student = await prisma.student.findUnique({ where: { id: params.id } });
    if (!student) return fail("Student not found.", 404);
    const sharedParent = await prisma.parent.findFirst({ where: { parentCode: "PARENT" } });
    const normalizedParentId =
      b.parentId === ""
        ? sharedParent?.id || null
        : b.parentId ?? undefined;

    await prisma.student.update({
      where: { id: params.id },
      data: {
        rollNo: b.rollNo ?? undefined,
        classId: b.classId === "" ? null : b.classId ?? undefined,
        parentId: normalizedParentId,
        phone: b.phone ?? undefined,
        dob: b.dob ?? undefined,
        address: b.address ?? undefined,
      },
    });

    const userData: any = {};
    if (b.name) userData.name = b.name;
    if (b.email !== undefined) userData.email = b.email || null;
    if (b.active !== undefined) userData.active = b.active;
    if (b.password) userData.password = await hashPassword(b.password);
    if (Object.keys(userData).length) {
      await prisma.user.update({ where: { id: student.userId }, data: userData });
    }
    return ok();
  } catch (e) {
    console.error(e);
    return fail("Failed to update student.", 500);
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await guard("ADMIN");
  if (error) return error;
  const student = await prisma.student.findUnique({ where: { id: params.id } });
  if (!student) return fail("Student not found.", 404);
  await prisma.user.delete({ where: { id: student.userId } });
  return ok();
}
