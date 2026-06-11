import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/http";
import { currentParent } from "@/lib/portal";
import { pct } from "@/lib/utils";

// Unified data endpoint: ?type=attendance|marks|fees|homework|comments|schedule&childId=
export async function GET(req: NextRequest) {
  const parent = await currentParent();
  if (!parent) return fail("Not authenticated", 401);

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const childId = searchParams.get("childId") || parent.children[0]?.id;

  // verify child belongs to parent
  const child = parent.children.find((c) => c.id === childId);
  if (!child && type !== "children") return fail("Child not found.", 404);

  const childrenList = parent.children.map((c) => ({
    id: c.id,
    name: c.user.name,
    className: c.class?.name || "-",
  }));

  if (type === "children") return ok({ children: childrenList });
  if (!child) return fail("No child selected.", 404);

  switch (type) {
    case "attendance": {
      const records = await prisma.attendance.findMany({
        where: { studentId: child.id },
        orderBy: { date: "desc" },
      });
      const total = records.length;
      const present = records.filter((r) => r.status === "PRESENT").length;
      const late = records.filter((r) => r.status === "LATE").length;
      const absent = records.filter((r) => r.status === "ABSENT").length;
      return ok({ children: childrenList, childId: child.id, records, summary: { total, present, late, absent, percentage: pct(present + late, total) } });
    }
    case "marks": {
      const results = await prisma.result.findMany({
        where: { studentId: child.id },
        orderBy: { date: "desc" },
      });
      const bySubject: Record<string, { sum: number; count: number }> = {};
      results.forEach((r) => {
        const k = r.subject || "Other";
        if (!bySubject[k]) bySubject[k] = { sum: 0, count: 0 };
        bySubject[k].sum += (r.score / r.total) * 100;
        bySubject[k].count++;
      });
      const subjects = Object.entries(bySubject).map(([subject, v]) => ({ subject, avg: Math.round(v.sum / v.count) }));
      const trend = [...results].reverse().map((r) => ({ name: r.title.slice(0, 10), pct: Math.round((r.score / r.total) * 100) }));
      return ok({ children: childrenList, childId: child.id, results, subjects, trend });
    }
    case "fees": {
      const fees = await prisma.fee.findMany({
        where: { studentId: child.id },
        include: { receipts: true },
        orderBy: { createdAt: "desc" },
      });
      const balance = fees.filter((f) => f.status !== "PAID").reduce((s, f) => s + (f.amount - f.amountPaid), 0);
      const paid = fees.reduce((s, f) => s + f.amountPaid, 0);
      return ok({ children: childrenList, childId: child.id, fees, balance, paid });
    }
    case "homework": {
      const homework = await prisma.homework.findMany({
        where: child.classId ? { OR: [{ classId: child.classId }, { classId: null }] } : {},
        include: { subject: true, submissions: { where: { studentId: child.id } } },
        orderBy: { deadline: "asc" },
      });
      const data = homework.map((h) => ({
        id: h.id,
        title: h.title,
        subject: h.subject?.name,
        deadline: h.deadline,
        submission: h.submissions[0] || null,
        overdue: !h.submissions[0] && new Date(h.deadline) < new Date(),
      }));
      return ok({ children: childrenList, childId: child.id, homework: data });
    }
    case "comments": {
      const comments = await prisma.teacherComment.findMany({
        where: { studentId: child.id },
        orderBy: { createdAt: "desc" },
      });
      return ok({ children: childrenList, childId: child.id, comments });
    }
    case "schedule": {
      const schedules = await prisma.schedule.findMany({
        where: child.classId ? { OR: [{ classId: child.classId }, { classId: null }] } : {},
        include: { subject: true },
        orderBy: { startTime: "asc" },
      });
      return ok({ children: childrenList, childId: child.id, schedules });
    }
    default:
      return fail("Unknown type.");
  }
}
