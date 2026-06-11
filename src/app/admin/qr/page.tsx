"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { apiGet, apiPost } from "@/lib/api";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/Card";
import { Loading } from "@/components/ui/States";
import { toast } from "@/components/ui/Toast";
import { formatDateTime } from "@/lib/utils";
import { QrCode, RefreshCw, Download } from "lucide-react";

export default function QrPage() {
  const [code, setCode] = useState<any>(null);
  const [qrImg, setQrImg] = useState("");
  const [loading, setLoading] = useState(true);
  const [gen, setGen] = useState(false);

  async function load() {
    setLoading(true);
    const res = await apiGet("/api/admin/qr");
    setLoading(false);
    if (res.ok) {
      setCode(res.data);
      if (res.data?.code) {
        const img = await QRCode.toDataURL(res.data.code, { width: 320, margin: 2, color: { dark: "#1e40f5", light: "#ffffff" } });
        setQrImg(img);
      } else {
        setQrImg("");
      }
    }
  }
  useEffect(() => { load(); }, []);

  async function generate() {
    setGen(true);
    const res = await apiPost("/api/admin/qr");
    setGen(false);
    if (!res.ok) return toast.error(res.error!);
    toast.success("New daily QR code generated");
    load();
  }

  function download() {
    if (!qrImg) return;
    const a = document.createElement("a");
    a.href = qrImg;
    a.download = `qr-attendance-${code.date}.png`;
    a.click();
  }

  return (
    <div>
      <PageHeader title="Daily QR Attendance" subtitle="Generate a daily QR code for students to check in & out." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="flex flex-col items-center justify-center text-center">
          {loading ? <Loading /> : qrImg ? (
            <>
              <div className="rounded-2xl bg-white p-4 shadow-glow">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrImg} alt="QR code" width={280} height={280} />
              </div>
              <p className="mt-4 text-2xl font-extrabold tracking-wider text-brand-500">{code.code}</p>
              <p className="text-sm text-muted">Valid until {formatDateTime(code.expiresAt)}</p>
              <button className="btn btn-ghost mt-4" onClick={download}><Download className="h-4 w-4" /> Download QR</button>
            </>
          ) : (
            <div className="py-10">
              <QrCode className="mx-auto mb-3 h-16 w-16 text-muted" />
              <p className="text-muted">No QR code for today yet.</p>
            </div>
          )}
        </Card>

        <Card>
          <h3 className="text-lg font-bold">How it works</h3>
          <ol className="mt-4 space-y-3 text-sm">
            {[
              "Generate a new QR code each day.",
              "Display it at the entrance or share the code.",
              "Students enter the code on their QR check-in page.",
              "First scan records check-in (late if after threshold).",
              "Second scan records check-out automatically.",
            ].map((t, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white">{i + 1}</span>
                <span>{t}</span>
              </li>
            ))}
          </ol>
          <button className="btn btn-primary mt-6 w-full" onClick={generate} disabled={gen}>
            <RefreshCw className={`h-4 w-4 ${gen ? "animate-spin" : ""}`} /> {gen ? "Generating..." : "Generate Today's QR Code"}
          </button>
        </Card>
      </div>
    </div>
  );
}
