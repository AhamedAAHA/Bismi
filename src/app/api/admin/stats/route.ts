import { prisma } from "@/lib/prisma";
import { ok, guard } from "@/lib/http";
import { todayStr } from "@/lib/utils";

export async function GET() {
  const { error } = await guard("ADMIN");
  if (error) return error;

  const today = todayStr();
  const [students, parents, classes, tests, todayAtt, dueFees, pendingLeave, recentEmails] =
    await Promise.all([
      prisma.student.count(),
      prisma.parent.count(),
      prisma.class.count(),
      prisma.test.count(),
      prisma.attendance.findMany({ where: { date: today } }),
      prisma.fee.aggregate({ where: { status: { not: "PAID" } }, _sum: { amount: true, amountPaid: true } }),
      prisma.leaveRequest.count({ where: { status: "PENDING" } }),
      prisma.emailNotification.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    ]);

  const present = todayAtt.filter((a) => a.status === "PRESENT").length;
  const late = todayAtt.filter((a) => a.status === "LATE").length;
  const absent = todayAtt.filter((a) => a.status === "ABSENT").length;

  // last 7 days attendance trend
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  const trendRaw = await prisma.attendance.findMany({
    where: { date: { in: days } },
  });
  const trend = days.map((d) => {
    const dayAtt = trendRaw.filter((a) => a.date === d);
    const p = dayAtt.filter((a) => a.status === "PRESENT" || a.status === "LATE").length;
    return {
      day: new Date(d).toLocaleDateString("en-GB", { weekday: "short" }),
      present: p,
      total: dayAtt.length,
    };
  });

  const dueAmount =
    (dueFees._sum.amount || 0) - (dueFees._sum.amountPaid || 0);

  return ok({
    students,
    parents,
    classes,
    tests,
    today: { present, late, absent, marked: todayAtt.length },
    dueAmount,
    pendingLeave,
    recentEmails,
    trend,
  });
}
