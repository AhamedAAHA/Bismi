import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/http";
import { getSession } from "@/lib/auth";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return fail("Not authenticated", 401);

  const receipt = await prisma.receipt.findUnique({
    where: { id: params.id },
    include: { fee: { include: { student: { include: { user: true, parent: true } } } } },
  });
  if (!receipt) return fail("Receipt not found.", 404);

  // access control
  if (session.role === "PARENT" && receipt.fee.student.parentId !== session.pid) {
    return fail("Forbidden", 403);
  }
  if (session.role === "STUDENT" && receipt.fee.studentId !== session.pid) {
    return fail("Forbidden", 403);
  }

  return ok({
    receiptNo: receipt.receiptNo,
    amount: receipt.amount,
    method: receipt.method,
    date: receipt.date,
    feeTitle: receipt.fee.title,
    feeTotal: receipt.fee.amount,
    feePaid: receipt.fee.amountPaid,
    studentName: receipt.fee.student.user.name,
    studentCode: receipt.fee.student.studentCode,
  });
}
