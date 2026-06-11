import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/http";
import { currentParent } from "@/lib/portal";

export async function GET() {
  const parent = await currentParent();
  if (!parent) return fail("Not authenticated", 401);
  const childIds = parent.children.map((c) => c.id);
  const leaves = await prisma.leaveRequest.findMany({
    where: { studentId: { in: childIds } },
    include: { student: { include: { user: true } } },
    orderBy: { createdAt: "desc" },
  });
  const children = parent.children.map((c) => ({ id: c.id, name: c.user.name }));
  return ok({ leaves, children });
}

export async function POST(req: NextRequest) {
  const parent = await currentParent();
  if (!parent) return fail("Not authenticated", 401);
  const b = await req.json();
  if (!b.studentId || !b.reason || !b.fromDate || !b.toDate)
    return fail("Please fill in all fields.");
  const child = parent.children.find((c) => c.id === b.studentId);
  if (!child) return fail("Invalid child selected.");

  const leave = await prisma.leaveRequest.create({
    data: {
      studentId: b.studentId,
      parentId: parent.id,
      type: b.type || "SICK",
      reason: b.reason,
      fromDate: b.fromDate,
      toDate: b.toDate,
      status: "PENDING",
    },
  });
  return ok(leave);
}
