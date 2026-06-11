import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { ok, fail, guard } from "@/lib/http";

export async function GET() {
  const { error } = await guard("ADMIN");
  if (error) return error;
  const parents = await prisma.parent.findMany({
    include: { user: true, children: { include: { user: true } } },
    orderBy: { createdAt: "desc" },
  });
  return ok(parents);
}

export async function POST(req: NextRequest) {
  const { error } = await guard("ADMIN");
  if (error) return error;
  try {
    const b = await req.json();
    if (!b.name || !b.parentCode) return fail("Name and Parent Code are required.");
    const exists = await prisma.user.findUnique({ where: { code: b.parentCode.toUpperCase() } });
    if (exists) return fail("Parent code already exists.");

    const password = await hashPassword(b.password || "1234");
    const user = await prisma.user.create({
      data: {
        name: b.name,
        code: b.parentCode.toUpperCase(),
        email: b.email || null,
        password,
        role: "PARENT",
      },
    });
    const parent = await prisma.parent.create({
      data: {
        userId: user.id,
        parentCode: b.parentCode.toUpperCase(),
        phone: b.phone || null,
        occupation: b.occupation || null,
        address: b.address || null,
      },
    });
    return ok(parent);
  } catch (e) {
    console.error(e);
    return fail("Failed to create parent.", 500);
  }
}
