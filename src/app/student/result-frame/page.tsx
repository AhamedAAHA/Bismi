"use client";

import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { useFetch } from "@/lib/useFetch";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/Card";
import { Loading } from "@/components/ui/States";
import { toast } from "@/components/ui/Toast";
import { GraduationCap, Upload, Download } from "lucide-react";

export default function ResultFramePage() {
  const { data: profile } = useFetch<any>("/api/student/profile");
  const { data: resData, loading } = useFetch<any>("/api/student/results");
  const frameRef = useRef<HTMLDivElement>(null);

  const [photo, setPhoto] = useState<string>("");
  const [selected, setSelected] = useState<any>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("resultFrame");
    if (stored) {
      setSelected(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (!selected && resData?.results?.length) {
      const r = resData.results[0];
      setSelected({ title: r.title, studentName: resData.studentName, score: r.score, total: r.total, percentage: Math.round((r.score / r.total) * 100) });
    }
  }, [resData, selected]);

  function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function download() {
    if (!frameRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(frameRef.current, { pixelRatio: 2, cacheBust: true });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `result-${(selected?.title || "card").replace(/\s+/g, "-")}.png`;
      a.click();
      toast.success("Result card downloaded!");
    } catch {
      toast.error("Could not generate image. Try again.");
    }
    setDownloading(false);
  }

  if (loading) return <Loading />;

  const results = resData?.results || [];

  return (
    <div>
      <PageHeader title="Result Card Generator" subtitle="Create a professional result frame with your photo." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="mb-3 font-bold">Customize</h3>
          <label className="label">Select Result</label>
          <select
            className="select mb-4"
            value={selected ? results.findIndex((r: any) => r.title === selected.title && r.score === selected.score) : ""}
            onChange={(e) => {
              const r = results[Number(e.target.value)];
              if (r) setSelected({ title: r.title, studentName: resData.studentName, score: r.score, total: r.total, percentage: Math.round((r.score / r.total) * 100) });
            }}
          >
            {results.map((r: any, i: number) => <option key={r.id} value={i}>{r.title} — {r.score}/{r.total}</option>)}
          </select>

          <label className="label">Upload Your Photo</label>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[var(--border)] px-4 py-3 transition hover:border-brand-500">
            <Upload className="h-5 w-5 text-muted" />
            <span className="text-sm text-muted">{photo ? "Photo selected — choose another" : "Choose a photo"}</span>
            <input type="file" accept="image/*" className="hidden" onChange={onPhoto} />
          </label>

          <button className="btn btn-primary mt-5 w-full" onClick={download} disabled={downloading || !selected}>
            <Download className="h-4 w-4" /> {downloading ? "Generating..." : "Download Result Card"}
          </button>
        </Card>

        <div className="flex justify-center">
          {selected && (
            <div ref={frameRef} style={{ width: 360, background: "linear-gradient(160deg,#f4f7fe,#e8eeff)", borderRadius: 24, overflow: "hidden", border: "1px solid #dbe4ff", fontFamily: "Inter, sans-serif" }}>
              <div style={{ background: "linear-gradient(135deg,#3563ff,#06b6d4)", padding: "18px 20px", color: "#fff", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <GraduationCap size={22} />
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 800, fontSize: 16 }}>3D Education Hub</p>
                  <p style={{ margin: 0, fontSize: 10, opacity: 0.9 }}>Result Certificate</p>
                </div>
              </div>

              <div style={{ padding: 24, textAlign: "center" }}>
                <div style={{ width: 110, height: 110, margin: "0 auto", borderRadius: "50%", overflow: "hidden", border: "4px solid #3563ff", background: "#dbe4ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photo} alt="student" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <GraduationCap size={44} color="#3563ff" />
                  )}
                </div>
                <h2 style={{ margin: "14px 0 2px", fontSize: 20, color: "#1a2238" }}>{selected.studentName}</h2>
                <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>{selected.title}</p>

                <div style={{ margin: "18px 0", padding: "16px", background: "#fff", borderRadius: 16, border: "1px solid #e4eaf5" }}>
                  <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>SCORE</p>
                  <p style={{ margin: "4px 0", fontSize: 34, fontWeight: 800, color: "#3563ff" }}>{selected.score} / {selected.total}</p>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: selected.percentage >= 40 ? "#059669" : "#dc2626" }}>{selected.percentage}%</p>
                </div>
                <p style={{ margin: 0, fontSize: 11, color: "#94a3c4" }}>Issued by 3D Education Hub</p>
              </div>

              <div style={{ padding: "12px", background: "#eef2fb", textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "#475569" }}>Developed by AAHA</p>
                <p style={{ margin: 0, fontSize: 10, color: "#94a3c4" }}>Contact: hubaibahamedaaha@gmail.com</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
