"use client";

import { useState } from "react";
import { useFetch } from "@/lib/useFetch";
import PageHeader from "@/components/dashboard/PageHeader";
import { Loading, ErrorState } from "@/components/ui/States";
import ScheduleView from "@/components/ScheduleView";
import ChildSelector from "@/components/ChildSelector";

export default function ParentSchedule() {
  const [childId, setChildId] = useState("");
  const { data, loading, error } = useFetch<any>(`/api/parent/data?type=schedule${childId ? `&childId=${childId}` : ""}`);
  if (loading) return <Loading />;
  if (error || !data) return <ErrorState message={error || "Failed to load"} />;
  return (
    <div>
      <PageHeader title="Class Schedule" subtitle="Your child's weekly timetable."
        action={<ChildSelector children={data.children} value={childId || data.childId} onChange={setChildId} />} />
      <ScheduleView schedules={data.schedules || []} />
    </div>
  );
}
