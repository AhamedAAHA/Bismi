"use client";

import { useFetch } from "@/lib/useFetch";
import PageHeader from "@/components/dashboard/PageHeader";
import { Loading, ErrorState } from "@/components/ui/States";
import ScheduleView from "@/components/ScheduleView";

export default function StudentSchedule() {
  const { data, loading, error } = useFetch<any[]>("/api/student/schedule");
  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} />;
  return (
    <div>
      <PageHeader title="Class Schedule" subtitle="Your weekly timetable." />
      <ScheduleView schedules={data || []} />
    </div>
  );
}
