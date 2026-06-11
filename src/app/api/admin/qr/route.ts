import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, guard } from "@/lib/http";
import { todayStr } from "@/lib/utils";

export async function GET() {
  const { error } = await guard("ADMIN");
  if (error) return error;
  const today = todayStr();
  const code = await prisma.qrAttendanceCode.findFirst({
    where: { date: today, active: true },
    orderBy: { createdAt: "desc" },
  });
  return ok(code);
}

export async function POST(req: NextRequest) {
  const { error } = await guard("ADMIN");
  if (error) return error;
  const today = todayStr();
  // deactivate previous codes for today
  await prisma.qrAttendanceCode.updateMany({
    where: { date: today },
    data: { active: false },
  });
  const expires = new Date();
  expires.setHours(23, 59, 59, 999);
  const code = await prisma.qrAttendanceCode.create({
    data: {
      code: "QR" + today.replace(/-/g, "") + "-" + Math.floor(1000 + Math.random() * 9000),
      date: today,
      expiresAt: expires,
      active: true,
    },
  });
  return ok(code);
}
