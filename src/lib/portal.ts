import { getSession } from "./auth";
import { prisma } from "./prisma";

export async function currentStudent() {
  const session = await getSession();
  if (!session || session.role !== "STUDENT") return null;
  return prisma.student.findUnique({
    where: { id: session.pid as string },
    include: { user: true, class: true, parent: { include: { user: true } } },
  });
}

export async function currentParent() {
  const session = await getSession();
  if (!session || session.role !== "PARENT") return null;
  return prisma.parent.findUnique({
    where: { id: session.pid as string },
    include: { user: true, children: { include: { user: true, class: true } } },
  });
}
