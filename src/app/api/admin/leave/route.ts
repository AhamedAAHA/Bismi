import { prisma } from "@/lib/prisma";
import { ok, guard } from "@/lib/http";

export async function GET() {
  const { error } = await guard("ADMIN");
  if (error) return error;
  const leaves = await prisma.leaveRequest.findMany({
    include: { student: { include: { user: true } }, parent: { include: { user: true } } },
    orderBy: { createdAt: "desc" },
  });
  return ok(leaves);
}
