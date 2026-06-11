import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/http";
import { currentParent } from "@/lib/portal";

export async function GET() {
  const parent = await currentParent();
  if (!parent) return fail("Not authenticated", 401);
  const childIds = parent.children.map((c) => c.id);
  const emails = await prisma.emailNotification.findMany({
    where: { OR: [{ parentId: parent.id }, { studentId: { in: childIds } }] },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return ok(emails);
}
