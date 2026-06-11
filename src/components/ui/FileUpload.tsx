"use client";

import { useState } from "react";
import { Upload, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "./Toast";

export default function FileUpload({
  onUploaded,
  label = "Upload file (PDF / image)",
  accept = ".pdf,image/*,.txt",
}: {
  onUploaded: (url: string, name: string) => void;
  label?: string;
  accept?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState("");

  async function handle(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        toast.error(json.error || "Upload failed");
      } else {
        setName(json.data.name);
        onUploaded(json.data.url, json.data.name);
        toast.success("File uploaded");
      }
    } catch {
      toast.error("Upload failed");
    }
    setUploading(false);
  }

  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[var(--border)] px-4 py-3 transition hover:border-brand-500">
      {uploading ? <Loader2 className="h-5 w-5 animate-spin text-brand-500" /> : name ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Upload className="h-5 w-5 text-muted" />}
      <span className="text-sm text-muted">{uploading ? "Uploading..." : name || label}</span>
      <input type="file" className="hidden" accept={accept} onChange={handle} disabled={uploading} />
    </label>
  );
}
