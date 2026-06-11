"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { toPng } from "html-to-image";
import { useFetch } from "@/lib/useFetch";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/Card";
import { Loading } from "@/components/ui/States";
import { toast } from "@/components/ui/Toast";
import { GraduationCap, Upload, Download } from "lucide-react";
import ModuleAccent from "@/components/3d/ModuleAccent";
import { formatDate, todayStr } from "@/lib/utils";

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
    if (!selected || !frameRef.current) return;
    const shine = frameRef.current.querySelector(".cert-shine");
    const glow = frameRef.current.querySelector(".cert-glow");
    const ctx = gsap.context(() => {
      if (shine) {
        gsap.fromTo(
          shine,
          { xPercent: -130, opacity: 0.2 },
          { xPercent: 130, opacity: 0.85, duration: 2.8, repeat: -1, ease: "power2.inOut", repeatDelay: 1.2 }
        );
      }
      if (glow) {
        gsap.to(glow, { opacity: 0.75, scale: 1.08, duration: 2.4, yoyo: true, repeat: -1, ease: "sine.inOut" });
      }
    }, frameRef);
    return () => ctx.revert();
  }, [selected, photo]);

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
      const dataUrl = await toPng(frameRef.current, { pixelRatio: 3, cacheBust: true, quality: 1 });
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
      <PageHeader title="Result Card Generator" subtitle="Create a premium certificate with your photo." />
      <ModuleAccent variant="result" height={140} />
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
            <div ref={frameRef} className="cert-frame relative" style={{ width: 380, fontFamily: "system-ui, sans-serif" }}>
              <div className="cert-shine" />
              <div className="cert-glow" />
              <div style={{ background: "linear-gradient(135deg,#92400e,#f59e0b,#fbbf24)", padding: "20px 22px", color: "#fff", display: "flex", alignItems: "center", gap: 12, position: "relative", zIndex: 1 }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid rgba(255,255,255,0.4)" }}>
                  <GraduationCap size={26} />
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 800, fontSize: 17, letterSpacing: "0.02em" }}>3D Education Hub</p>
                  <p style={{ margin: 0, fontSize: 11, opacity: 0.95 }}>Official Achievement Certificate</p>
                </div>
              </div>

              <div style={{ padding: 28, textAlign: "center", position: "relative", zIndex: 1 }}>
                <div style={{ width: 120, height: 120, margin: "0 auto", borderRadius: "50%", overflow: "hidden", border: "4px solid #f59e0b", boxShadow: "0 0 0 4px rgba(245,158,11,0.2)", background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photo} alt="student" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <GraduationCap size={48} color="#d97706" />
                  )}
                </div>
                <h2 style={{ margin: "16px 0 4px", fontSize: 22, color: "#1a2238", fontWeight: 800 }}>{selected.studentName}</h2>
                <p style={{ margin: 0, fontSize: 14, color: "#64748b", fontWeight: 600 }}>{selected.title}</p>
                <p style={{ margin: "6px 0 0", fontSize: 11, color: "#94a3b8" }}>{formatDate(todayStr())}</p>

                <div style={{ margin: "20px 0", padding: "18px", background: "linear-gradient(135deg,#fffbeb,#fef3c7)", borderRadius: 18, border: "2px solid rgba(245,158,11,0.35)" }}>
                  <p style={{ margin: 0, fontSize: 11, color: "#92400e", fontWeight: 700, letterSpacing: "0.08em" }}>FINAL SCORE</p>
                  <p style={{ margin: "6px 0", fontSize: 38, fontWeight: 900, color: "#b45309" }}>{selected.score} / {selected.total}</p>
                  <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: selected.percentage >= 40 ? "#059669" : "#dc2626" }}>{selected.percentage}% Achievement</p>
                </div>
                <p style={{ margin: 0, fontSize: 11, color: "#78716c" }}>Certified by 3D Education Hub</p>
              </div>

              <div style={{ padding: "14px", background: "linear-gradient(180deg,#fef3c7,#fde68a)", textAlign: "center", position: "relative", zIndex: 1 }}>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "#78350f" }}>Developed by AAHA</p>
                <p style={{ margin: 0, fontSize: 10, color: "#92400e" }}>Contact: hubaibahamedaaha@gmail.com</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
