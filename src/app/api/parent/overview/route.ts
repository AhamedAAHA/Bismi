import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/http";
import { currentParent } from "@/lib/portal";
import { pct, todayStr } from "@/lib/utils";

export async function GET() {
  const parent = await currentParent();
  if (!parent) return fail("Not authenticated", 401);

  const today = todayStr();
  const children = await Promise.all(
    parent.children.map(async (child) => {
      const [attendance, results, fees, homework, subs, todayRec] = await Promise.all([
        prisma.attendance.findMany({ where: { studentId: child.id } }),
        prisma.result.findMany({ where: { studentId: child.id } }),
        prisma.fee.findMany({ where: { studentId: child.id } }),
        prisma.homework.findMany({
          where: child.classId ? { OR: [{ classId: child.classId }, { classId: null }] } : {},
        }),
        prisma.homeworkSubmission.findMany({ where: { studentId: child.id } }),
        prisma.attendance.findFirst({ where: { studentId: child.id, date: today } }),
      ]);

      const total = attendance.length;
      const present = attendance.filter((a) => a.status === "PRESENT" || a.status === "LATE").length;
      const avgMarks =
        results.length > 0
          ? Math.round(results.reduce((s, r) => s + (r.score / r.total) * 100, 0) / results.length)
          : 0;
      const dueAmount = fees
        .filter((f) => f.status !== "PAID")
        .reduce((s, f) => s + (f.amount - f.amountPaid), 0);
      const submittedIds = new Set(subs.map((s) => s.homeworkId));
      const pendingHw = homework.filter((h) => !submittedIds.has(h.id)).length;

      return {
        id: child.id,
        name: child.user.name,
        code: child.studentCode,
        className: child.class?.name || "-",
        attendancePct: pct(present, total),
        avgMarks,
        dueAmount,
        pendingHw,
        todayStatus: todayRec?.status || "Not marked",
        checkIn: todayRec?.checkIn || null,
        checkOut: todayRec?.checkOut || null,
      };
    })
  );

  const announcements = await prisma.announcement.findMany({
    where: { OR: [{ audience: "ALL" }, { audience: "PARENT" }] },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return ok({ parentName: parent.user.name, children, announcements });
}
