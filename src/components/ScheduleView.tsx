"use client";

import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/States";
import { CalendarDays } from "lucide-react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function ScheduleView({ schedules }: { schedules: any[] }) {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  if (!schedules || schedules.length === 0) {
    return <Card><EmptyState icon={CalendarDays} title="No schedule available" /></Card>;
  }
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {DAYS.map((day) => {
        const slots = schedules.filter((s) => s.day === day);
        if (!slots.length) return null;
        const isToday = day === today;
        return (
          <Card key={day} className={isToday ? "ring-2 ring-brand-500" : ""}>
            <h3 className="mb-3 flex items-center gap-2 font-bold">
              {day} {isToday && <span className="badge badge-blue">Today</span>}
            </h3>
            <div className="space-y-2">
              {slots.map((s) => (
                <div key={s.id} className="rounded-xl border border-[var(--border)] p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{s.subject?.name || "Class"}</p>
                    <span className="text-xs font-semibold text-brand-500">{s.startTime}–{s.endTime}</span>
                  </div>
                  <p className="text-xs text-muted">{s.teacher || "—"} {s.room ? `• ${s.room}` : ""}</p>
                </div>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
