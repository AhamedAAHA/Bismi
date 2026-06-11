"use client";

import { useFetch } from "@/lib/useFetch";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/Card";
import { Loading, ErrorState, EmptyState } from "@/components/ui/States";
import { formatDate } from "@/lib/utils";
import { StickyNote, Download } from "lucide-react";

export default function StudentNotes() {
  const { data, loading, error } = useFetch<any[]>("/api/student/notes");
  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} />;

  return (
    <div>
      <PageHeader title="Study Notes" subtitle="Download notes shared by your teachers." />
      {(data || []).length === 0 ? (
        <Card><EmptyState icon={StickyNote} title="No notes available" /></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data!.map((n) => (
            <Card key={n.id}>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500"><StickyNote className="h-5 w-5" /></div>
              <h3 className="font-semibold">{n.title}</h3>
              <p className="text-sm text-muted">{n.description || "No description"}</p>
              <p className="mt-1 text-xs text-muted">{n.subject?.name || "General"} • {formatDate(n.createdAt)}</p>
              <a href={n.fileUrl} target="_blank" className="btn btn-primary btn-sm mt-3 w-full"><Download className="h-3.5 w-3.5" /> Download</a>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
