import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail, guard } from "@/lib/http";
import { notifyLeaveDecision } from "@/lib/notify";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await guard("ADMIN");
  if (error) return error;
  const b = await req.json();
  const status = b.status;
  if (!["APPROVED", "REJECTED"].includes(status)) return fail("Invalid status.");

  await prisma.leaveRequest.update({
    where: { id: params.id },
    data: { status, adminNote: b.adminNote || null },
  });
  notifyLeaveDecision(params.id, status, b.adminNote).catch(() => {});
  return ok();
}
