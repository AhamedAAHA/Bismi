"use client";

import { useEffect, useRef } from "react";
import {
  BookOpen,
  GraduationCap,
  Pencil,
  NotebookPen,
  Atom,
  Calculator,
  Sparkles,
} from "lucide-react";

/**
 * Immersive 3D education background — floating glass panes, 3D cubes,
 * glowing orbs, academic particles, learning paths, and parallax depth.
 */
export default function EduBackground() {
  const rootRef = useRef<HTMLDivElement>(null);
  const particles = Array.from({ length: 28 });

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      el.style.setProperty("--mx", String(x));
      el.style.setProperty("--my", String(y));
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={rootRef}
      className="edu-bg"
      aria-hidden="true"
      style={{ "--mx": 0, "--my": 0 } as React.CSSProperties}
    >
      {/* Animated mesh + aurora layers */}
      <div className="edu-mesh" />
      <div className="edu-aurora edu-aurora-a" />
      <div className="edu-aurora edu-aurora-b" />

      {/* 3D floating glass panes */}
      <span className="glass-pane one" />
      <span className="glass-pane two" />
      <span className="glass-pane three" />

      {/* 3D CSS cubes */}
      <div className="cube-wrap cube-a">
        <div className="cube-3d">
          <span /><span /><span /><span /><span /><span />
        </div>
      </div>
      <div className="cube-wrap cube-b">
        <div className="cube-3d cube-sm">
          <span /><span /><span /><span /><span /><span />
        </div>
      </div>

      {/* Glowing orbs */}
      <span className="orb orb-a" />
      <span className="orb orb-b" />
      <span className="orb orb-c" />

      {/* Orbital rings */}
      <div className="orbit-ring ring-a" />
      <div className="orbit-ring ring-b" />

      {/* Animated learning paths */}
      <svg className="learn-path" viewBox="0 0 1440 900" fill="none" preserveAspectRatio="none">
        <path d="M-50 700 C 300 600, 500 850, 800 650 S 1300 500, 1500 620" stroke="rgba(53,99,255,0.35)" strokeWidth="2" />
        <path d="M-50 200 C 250 320, 600 100, 900 280 S 1300 360, 1500 200" stroke="rgba(6,182,212,0.30)" strokeWidth="2" />
        <path d="M100 450 C 400 380, 700 520, 1100 400 S 1400 300, 1500 350" stroke="rgba(139,92,246,0.22)" strokeWidth="1.5" />
      </svg>

      {/* Floating education icons — parallax layer */}
      <div className="edu-icons-layer">
        <BookOpen className="floaty animate-float3d text-brand-500" style={{ top: "12%", left: "8%", width: 56, height: 56 }} />
        <BookOpen className="floaty animate-floatSlow text-accent-500" style={{ top: "62%", left: "14%", width: 40, height: 40, animationDelay: "1.2s" }} />
        <BookOpen className="floaty animate-float text-brand-400" style={{ top: "30%", right: "10%", width: 48, height: 48, animationDelay: "0.6s" }} />
        <GraduationCap className="floaty animate-float3d text-brand-600" style={{ top: "16%", right: "22%", width: 64, height: 64, animationDelay: "0.3s" }} />
        <GraduationCap className="floaty animate-floatSlow text-accent-500" style={{ bottom: "14%", right: "12%", width: 44, height: 44, animationDelay: "1.6s" }} />
        <Pencil className="floaty animate-float text-amber-400" style={{ bottom: "20%", left: "9%", width: 42, height: 42, animationDelay: "0.9s" }} />
        <NotebookPen className="floaty animate-floatSlow text-brand-500" style={{ bottom: "30%", left: "40%", width: 46, height: 46, animationDelay: "2s" }} />
        <Atom className="floaty animate-spinSlow text-accent-400" style={{ top: "48%", right: "30%", width: 70, height: 70 }} />
        <Calculator className="floaty animate-floatSlow text-brand-400" style={{ top: "70%", right: "40%", width: 38, height: 38, animationDelay: "1.1s" }} />
        <Sparkles className="floaty animate-float text-violet-400" style={{ top: "8%", left: "45%", width: 32, height: 32, animationDelay: "0.5s" }} />
      </div>

      {/* Academic particles */}
      {particles.map((_, i) => {
        const top = Math.round((i * 53) % 100);
        const left = Math.round((i * 71) % 100);
        const delay = (i % 6) * 0.7;
        const dur = 12 + (i % 5) * 3;
        const size = 4 + (i % 4) * 2;
        return (
          <span
            key={i}
            className="particle animate-drift"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              width: size,
              height: size,
              animationDelay: `${delay}s`,
              animationDuration: `${dur}s`,
              opacity: 0.35 + (i % 3) * 0.15,
            }}
          />
        );
      })}
    </div>
  );
}
