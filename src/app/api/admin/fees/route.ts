import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail, guard } from "@/lib/http";
import { notifyFeeDue } from "@/lib/notify";

export async function GET() {
  const { error } = await guard("ADMIN");
  if (error) return error;
  const fees = await prisma.fee.findMany({
    include: { student: { include: { user: true } }, receipts: true },
    orderBy: { createdAt: "desc" },
  });
  return ok(fees);
}

export async function POST(req: NextRequest) {
  const { error } = await guard("ADMIN");
  if (error) return error;
  try {
    const b = await req.json();
    if (!b.studentId || !b.title || !b.amount) return fail("Student, title and amount are required.");
    const fee = await prisma.fee.create({
      data: {
        studentId: b.studentId,
        title: b.title,
        amount: Number(b.amount),
        amountPaid: 0,
        status: "DUE",
        dueDate: b.dueDate,
      },
    });
    if (b.notify) {
      notifyFeeDue(b.studentId, b.title, Number(b.amount), b.dueDate).catch(() => {});
    }
    return ok(fee);
  } catch (e) {
    console.error(e);
    return fail("Failed to add fee.", 500);
  }
}
