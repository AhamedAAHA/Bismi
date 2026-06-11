"use client";

import { useFetch } from "@/lib/useFetch";
import PageHeader from "@/components/dashboard/PageHeader";
import { Loading, ErrorState } from "@/components/ui/States";
import { Card } from "@/components/ui/Card";
import ScheduleView from "@/components/ScheduleView";

export default function ParentSchedule() {
  const { data, loading, error } = useFetch<any>("/api/parent/data?type=schedule");
  if (loading) return <Loading />;
  if (error || !data) return <ErrorState message={error || "Failed to load"} />;
  return (
    <div>
      <PageHeader title="Class Schedule" subtitle="All linked students grouped class by class." />
      <div className="space-y-4">
        {data.classGroups.map((group: any) => (
          <section key={group.className} className="space-y-3">
            <h2 className="text-sm font-bold uppercase text-muted">{group.className}</h2>
            {group.children.map((child: any) => (
              <Card key={child.id}>
                <div className="mb-3">
                  <h3 className="font-bold">{child.name}</h3>
                  <p className="text-sm text-muted">{child.code} - {child.className}</p>
                </div>
                <ScheduleView schedules={child.schedules || []} />
              </Card>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
