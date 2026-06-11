import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/http";
import { currentParent } from "@/lib/portal";
import { pct } from "@/lib/utils";

function groupByClass(children: any[]) {
  const map = new Map<string, any[]>();
  children.forEach((child) => {
    const className = child.className || "-";
    map.set(className, [...(map.get(className) || []), child]);
  });
  return Array.from(map.entries()).map(([className, children]) => ({ className, children }));
}

// Unified data endpoint: ?type=attendance|marks|homework|comments|schedule
export async function GET(req: NextRequest) {
  const parent = await currentParent();
  if (!parent) return fail("Not authenticated", 401);

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  const childrenList = parent.children.map((c) => ({
    id: c.id,
    name: c.user.name,
    code: c.studentCode,
    classId: c.classId,
    className: c.class?.name || "-",
  }));

  if (type === "children") return ok({ children: childrenList });
  if (childrenList.length === 0) return ok({ children: [], classGroups: [] });

  switch (type) {
    case "attendance": {
      const data = await Promise.all(parent.children.map(async (child) => {
        const records = await prisma.attendance.findMany({
          where: { studentId: child.id },
          orderBy: { date: "desc" },
        });
        const total = records.length;
        const present = records.filter((r) => r.status === "PRESENT").length;
        const late = records.filter((r) => r.status === "LATE").length;
        const absent = records.filter((r) => r.status === "ABSENT").length;
        return {
          id: child.id,
          name: child.user.name,
          code: child.studentCode,
          className: child.class?.name || "-",
          records,
          summary: { total, present, late, absent, percentage: pct(present + late, total) },
        };
      }));
      return ok({ children: childrenList, classGroups: groupByClass(data) });
    }
    case "marks": {
      const data = await Promise.all(parent.children.map(async (child) => {
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
        return {
          id: child.id,
          name: child.user.name,
          code: child.studentCode,
          className: child.class?.name || "-",
          results,
          subjects,
          trend,
        };
      }));
      return ok({ children: childrenList, classGroups: groupByClass(data) });
    }
    case "fees": {
      return fail("Fee details are hidden.", 404);
    }
    case "homework": {
      const data = await Promise.all(parent.children.map(async (child) => {
        const homework = await prisma.homework.findMany({
          where: child.classId ? { OR: [{ classId: child.classId }, { classId: null }] } : {},
          include: { subject: true, submissions: { where: { studentId: child.id } } },
          orderBy: { deadline: "asc" },
        });
        const items = homework.map((h) => ({
          id: h.id,
          title: h.title,
          subject: h.subject?.name,
          deadline: h.deadline,
          submission: h.submissions[0] || null,
          overdue: !h.submissions[0] && new Date(h.deadline) < new Date(),
        }));
        return {
          id: child.id,
          name: child.user.name,
          code: child.studentCode,
          className: child.class?.name || "-",
          homework: items,
          pending: items.filter((h) => !h.submission),
          done: items.filter((h) => h.submission),
        };
      }));
      return ok({ children: childrenList, classGroups: groupByClass(data) });
    }
    case "comments": {
      const data = await Promise.all(parent.children.map(async (child) => {
        const comments = await prisma.teacherComment.findMany({
          where: { studentId: child.id },
          orderBy: { createdAt: "desc" },
        });
        return {
          id: child.id,
          name: child.user.name,
          code: child.studentCode,
          className: child.class?.name || "-",
          comments,
        };
      }));
      return ok({ children: childrenList, classGroups: groupByClass(data) });
    }
    case "schedule": {
      const data = await Promise.all(parent.children.map(async (child) => {
        const schedules = await prisma.schedule.findMany({
          where: child.classId ? { OR: [{ classId: child.classId }, { classId: null }] } : {},
          include: { subject: true },
          orderBy: { startTime: "asc" },
        });
        return {
          id: child.id,
          name: child.user.name,
          code: child.studentCode,
          className: child.class?.name || "-",
          schedules,
        };
      }));
      return ok({ children: childrenList, classGroups: groupByClass(data) });
    }
    default:
      return fail("Unknown type.");
  }
}
