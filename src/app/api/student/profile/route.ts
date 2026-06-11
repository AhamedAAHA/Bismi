import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/http";
import { currentStudent } from "@/lib/portal";
import { hashPassword, verifyPassword } from "@/lib/auth";

export async function GET() {
  const student = await currentStudent();
  if (!student) return fail("Not authenticated", 401);
  return ok({
    name: student.user.name,
    email: student.user.email,
    studentCode: student.studentCode,
    rollNo: student.rollNo,
    className: student.class?.name,
    phone: student.phone,
    dob: student.dob,
    address: student.address,
    photoUrl: student.photoUrl,
    parentName: student.parent?.user.name,
  });
}

export async function PUT(req: NextRequest) {
  const student = await currentStudent();
  if (!student) return fail("Not authenticated", 401);
  const b = await req.json();

  if (b.photoUrl !== undefined) {
    await prisma.student.update({ where: { id: student.id }, data: { photoUrl: b.photoUrl } });
  }

  if (b.currentPassword && b.newPassword) {
    const valid = await verifyPassword(b.currentPassword, student.user.password);
    if (!valid) return fail("Current password is incorrect.");
    if (b.newPassword.length < 4) return fail("New password must be at least 4 characters.");
    await prisma.user.update({
      where: { id: student.userId },
      data: { password: await hashPassword(b.newPassword) },
    });
  }
  return ok();
}
