import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { ok, fail, guard } from "@/lib/http";

export async function GET() {
  const { error } = await guard("ADMIN");
  if (error) return error;
  const students = await prisma.student.findMany({
    include: { user: true, class: true, parent: { include: { user: true } } },
    orderBy: { createdAt: "desc" },
  });
  return ok(students);
}

export async function POST(req: NextRequest) {
  const { error } = await guard("ADMIN");
  if (error) return error;
  try {
    const b = await req.json();
    if (!b.name || !b.studentCode) return fail("Name and Student Code are required.");

    const exists = await prisma.user.findUnique({ where: { code: b.studentCode.toUpperCase() } });
    if (exists) return fail("Student code already exists.");

    const password = await hashPassword(b.password || "1234");
    const user = await prisma.user.create({
      data: {
        name: b.name,
        code: b.studentCode.toUpperCase(),
        email: b.email || null,
        password,
        role: "STUDENT",
      },
    });
    const sharedParent = !b.parentId
      ? await prisma.parent.findFirst({
          where: { parentCode: "PARENT" },
        })
      : null;

    const student = await prisma.student.create({
      data: {
        userId: user.id,
        studentCode: b.studentCode.toUpperCase(),
        rollNo: b.rollNo || null,
        classId: b.classId || null,
        parentId: b.parentId || sharedParent?.id || null,
        phone: b.phone || null,
        dob: b.dob || null,
        address: b.address || null,
      },
    });
    return ok(student);
  } catch (e) {
    console.error(e);
    return fail("Failed to create student.", 500);
  }
}
