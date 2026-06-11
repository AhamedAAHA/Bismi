"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiPost } from "@/lib/api";
import { toast, Toaster } from "@/components/ui/Toast";
import { Eye, EyeOff, LogIn, Loader2, LucideIcon } from "lucide-react";
import TiltCard from "@/components/3d/TiltCard";

interface Props {
  role: "ADMIN" | "STUDENT" | "PARENT";
  title: string;
  subtitle: string;
  icon: LucideIcon;
  identifierLabel: string;
  identifierPlaceholder: string;
  demo: { id: string; pass: string };
  tone: string;
  dest: string;
}

export default function LoginForm({
  role,
  title,
  subtitle,
  icon: Icon,
  identifierLabel,
  identifierPlaceholder,
  demo,
  tone,
  dest,
}: Props) {
  const params = useSearchParams();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!identifier.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    const res = await apiPost("/api/auth/login", { identifier, password, role });
    setLoading(false);
    if (!res.ok) {
      setError(res.error || "Login failed");
      toast.error(res.error || "Login failed");
      return;
    }
    toast.success("Welcome back!");
    const from = params.get("from");
    const target = from && from.startsWith(dest) ? from : dest;
    window.location.assign(target);
  }

  function fillDemo() {
    setIdentifier(demo.id);
    setPassword(demo.pass);
  }

  return (
    <div className="w-full max-w-md">
      <Toaster />
      <TiltCard className="glass-strong card p-7 fade-up">
        <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${tone} text-white shadow-glow`}>
          <Icon className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-extrabold">{title}</h1>
        <p className="mt-1 text-sm text-muted">{subtitle}</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="label">{identifierLabel}</label>
            <input
              className="input"
              placeholder={identifierPlaceholder}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div>
            <label className="label">Password / PIN</label>
            <div className="relative">
              <input
                className="input pr-11"
                type={show ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-brand-500"
              >
                {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-500">
              {error}
            </p>
          )}

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogIn className="h-4 w-4" />
            )}
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <button
          onClick={fillDemo}
          className="mt-4 w-full rounded-xl border border-dashed border-[var(--border)] px-3 py-2 text-xs text-muted transition hover:border-brand-500 hover:text-brand-500"
        >
          Use demo credentials → {demo.id} / {demo.pass}
        </button>
      </TiltCard>
    </div>
  );
}
