import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail, guard } from "@/lib/http";

export async function GET() {
  const { error } = await guard("ADMIN");
  if (error) return error;
  const classes = await prisma.class.findMany({
    include: { _count: { select: { students: true } }, subjects: true },
    orderBy: { createdAt: "asc" },
  });
  return ok(classes);
}

export async function POST(req: NextRequest) {
  const { error } = await guard("ADMIN");
  if (error) return error;
  const b = await req.json();
  if (!b.name) return fail("Class name is required.");
  const cls = await prisma.class.create({
    data: { name: b.name, section: b.section || null, room: b.room || null },
  });
  return ok(cls);
}
