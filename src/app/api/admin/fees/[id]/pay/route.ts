import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail, guard } from "@/lib/http";
import { todayStr } from "@/lib/utils";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await guard("ADMIN");
  if (error) return error;
  try {
    const b = await req.json();
    const fee = await prisma.fee.findUnique({ where: { id: params.id } });
    if (!fee) return fail("Fee not found.", 404);

    const amount = Number(b.amount) || fee.amount - fee.amountPaid;
    if (amount <= 0) return fail("Invalid payment amount.");

    const newPaid = fee.amountPaid + amount;
    const status = newPaid >= fee.amount ? "PAID" : "PARTIAL";

    await prisma.fee.update({
      where: { id: params.id },
      data: {
        amountPaid: newPaid,
        status,
        paidDate: todayStr(),
        method: b.method || "Cash",
      },
    });

    const receipt = await prisma.receipt.create({
      data: {
        feeId: fee.id,
        receiptNo: "RCPT-" + Math.floor(100000 + Math.random() * 900000),
        amount,
        method: b.method || "Cash",
        date: todayStr(),
      },
    });
    return ok(receipt);
  } catch (e) {
    console.error(e);
    return fail("Payment failed.", 500);
  }
}
