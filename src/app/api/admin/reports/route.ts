import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { guard } from "@/lib/http";
import { pct } from "@/lib/utils";

// GET ?format=csv for export; otherwise JSON summary
export async function GET(req: NextRequest) {
  const { error } = await guard("ADMIN");
  if (error) return error;
  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format");

  const students = await prisma.student.findMany({
    include: { user: true, class: true, attendance: true },
    orderBy: { studentCode: "asc" },
  });

  const rows = students.map((s) => {
    const total = s.attendance.length;
    const present = s.attendance.filter((a) => a.status === "PRESENT").length;
    const late = s.attendance.filter((a) => a.status === "LATE").length;
    const absent = s.attendance.filter((a) => a.status === "ABSENT").length;
    return {
      studentCode: s.studentCode,
      name: s.user.name,
      className: s.class?.name || "-",
      total,
      present,
      late,
      absent,
      percentage: pct(present + late, total),
    };
  });

  if (format === "csv") {
    const header = "Student Code,Name,Class,Total Days,Present,Late,Absent,Attendance %\n";
    const body = rows
      .map(
        (r) =>
          `${r.studentCode},${r.name},${r.className},${r.total},${r.present},${r.late},${r.absent},${r.percentage}%`
      )
      .join("\n");
    return new Response(header + body, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="attendance-report.csv"`,
      },
    });
  }

  return Response.json({ ok: true, data: rows });
}
