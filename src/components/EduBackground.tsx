"use client";

import { BookOpen, GraduationCap, Pencil, NotebookPen, Atom, Calculator } from "lucide-react";

/**
 * 3D-style animated education background:
 * floating books, graduation cap, pencil + notebook,
 * academic particles, and animated learning paths.
 */
export default function EduBackground() {
  const particles = Array.from({ length: 18 });
  return (
    <div className="edu-bg" aria-hidden="true">
      {/* Animated learning paths */}
      <svg className="learn-path" viewBox="0 0 1440 900" fill="none" preserveAspectRatio="none">
        <path
          d="M-50 700 C 300 600, 500 850, 800 650 S 1300 500, 1500 620"
          stroke="rgba(53,99,255,0.35)"
          strokeWidth="2"
        />
        <path
          d="M-50 200 C 250 320, 600 100, 900 280 S 1300 360, 1500 200"
          stroke="rgba(6,182,212,0.30)"
          strokeWidth="2"
        />
      </svg>

      {/* Floating books */}
      <BookOpen className="floaty animate-floatSlow text-brand-500" style={{ top: "12%", left: "8%", width: 56, height: 56 }} />
      <BookOpen className="floaty animate-float text-accent-500" style={{ top: "62%", left: "14%", width: 40, height: 40, animationDelay: "1.2s" }} />
      <BookOpen className="floaty animate-floatSlow text-brand-400" style={{ top: "30%", right: "10%", width: 48, height: 48, animationDelay: "0.6s" }} />

      {/* Graduation cap */}
      <GraduationCap className="floaty animate-float text-brand-600" style={{ top: "16%", right: "22%", width: 64, height: 64, animationDelay: "0.3s" }} />
      <GraduationCap className="floaty animate-floatSlow text-accent-500" style={{ bottom: "14%", right: "12%", width: 44, height: 44, animationDelay: "1.6s" }} />

      {/* Pencil & notebook */}
      <Pencil className="floaty animate-float text-amber-400" style={{ bottom: "20%", left: "9%", width: 42, height: 42, animationDelay: "0.9s" }} />
      <NotebookPen className="floaty animate-floatSlow text-brand-500" style={{ bottom: "30%", left: "40%", width: 46, height: 46, animationDelay: "2s" }} />

      {/* Academic icons */}
      <Atom className="floaty animate-spinSlow text-accent-400" style={{ top: "48%", right: "30%", width: 70, height: 70 }} />
      <Calculator className="floaty animate-floatSlow text-brand-400" style={{ top: "70%", right: "40%", width: 38, height: 38, animationDelay: "1.1s" }} />

      {/* Academic particles */}
      {particles.map((_, i) => {
        const top = Math.round((i * 53) % 100);
        const left = Math.round((i * 71) % 100);
        const delay = (i % 6) * 0.7;
        const dur = 12 + (i % 5) * 3;
        return (
          <span
            key={i}
            className="particle animate-drift"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              animationDelay: `${delay}s`,
              animationDuration: `${dur}s`,
              opacity: 0.4,
            }}
          />
        );
      })}
    </div>
  );
}
