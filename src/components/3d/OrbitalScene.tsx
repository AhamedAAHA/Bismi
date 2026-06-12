"use client";

/**
 * OrbitalScene — dark futuristic orbital UI background.
 * Pure SVG/CSS animation: large soft orbit rings, floating particles,
 * glowing AI core, and "BISMI IS REASONING" label.
 *
 * The core + rings are anchored to the RIGHT side of the viewBox so they
 * remain visible as a decorative accent without overlapping left-side text.
 * The subtle planet sits at bottom-left but is very transparent.
 *
 * Usage:
 *   <section style={{ position: "relative", overflow: "hidden" }}>
 *     <OrbitalScene />
 *     <div style={{ position: "relative", zIndex: 10 }}>content</div>
 *   </section>
 */

export default function OrbitalScene({ opacity = 0.5 }: { opacity?: number }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        opacity,
      }}
    >
      <svg
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMaxYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <defs>
          <radialGradient id="os-coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#54f4ff" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#8b7cff" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#040914" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="os-ambient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2f8fff" stopOpacity="0.14" />
            <stop offset="65%" stopColor="#8b7cff" stopOpacity="0.06" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="os-ring1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#54f4ff" stopOpacity="0" />
            <stop offset="30%"  stopColor="#54f4ff" stopOpacity="0.65" />
            <stop offset="70%"  stopColor="#8b7cff" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#ff65dd" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="os-ring2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#8b7cff" stopOpacity="0" />
            <stop offset="45%"  stopColor="#8b7cff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#54f4ff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="os-ring3" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#ff65dd" stopOpacity="0" />
            <stop offset="50%"  stopColor="#ff65dd" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#54f4ff" stopOpacity="0" />
          </linearGradient>
          <filter id="os-blur4"  x="-50%"  y="-50%"  width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
          <filter id="os-blur12" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="12" />
          </filter>
          <filter id="os-blur22" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="22" />
          </filter>
        </defs>

        {/* Ambient glow behind core — right side */}
        <ellipse cx="980" cy="290" rx="320" ry="260" fill="url(#os-ambient)" />

        {/* ── Orbit rings centred on (980, 290) ── */}
        <ellipse cx="980" cy="290" rx="300" ry="115"
          fill="none" stroke="url(#os-ring1)" strokeWidth="1.3"
          style={{ animation: "os-spin1 20s linear infinite", transformOrigin: "980px 290px" }} />
        <ellipse cx="980" cy="290" rx="215" ry="80"
          fill="none" stroke="url(#os-ring2)" strokeWidth="1"
          style={{ animation: "os-spin2 13s linear infinite", transformOrigin: "980px 290px" }} />
        <ellipse cx="980" cy="290" rx="148" ry="52"
          fill="none" stroke="url(#os-ring3)" strokeWidth="0.75"
          style={{ animation: "os-spin3 8s linear infinite reverse", transformOrigin: "980px 290px" }} />

        {/* Soft glow halo behind core */}
        <circle cx="980" cy="290" r="80" fill="url(#os-coreGlow)" filter="url(#os-blur22)" />

        {/* Glowing AI core sphere */}
        <circle cx="980" cy="290" r="30" fill="#0d1a35" />
        <circle cx="980" cy="290" r="30" fill="none" stroke="#54f4ff" strokeWidth="1.6" opacity="0.85" />
        <ellipse cx="980" cy="290" rx="30" ry="10" fill="none" stroke="#54f4ff" strokeWidth="0.6" opacity="0.45" />
        <ellipse cx="980" cy="290" rx="10" ry="30" fill="none" stroke="#8b7cff" strokeWidth="0.6" opacity="0.45" />
        <circle cx="980" cy="290" r="22" fill="#54f4ff" opacity="0.1"
          style={{ animation: "os-pulse 3s ease-in-out infinite" }} />
        <circle cx="980" cy="290" r="13" fill="#54f4ff" opacity="0.18"
          style={{ animation: "os-pulse 3s ease-in-out infinite 0.6s" }} />
        <circle cx="980" cy="290" r="5" fill="#fff" opacity="0.95" filter="url(#os-blur4)" />

        {/* Orbital nodes */}
        <circle r="5" fill="#54f4ff" opacity="0.9" filter="url(#os-blur4)"
          style={{ offsetPath: "ellipse(300px 115px at 980px 290px)", animation: "os-node1 20s linear infinite" } as React.CSSProperties} />
        <circle r="3.5" fill="#8b7cff" opacity="0.85" filter="url(#os-blur4)"
          style={{ offsetPath: "ellipse(300px 115px at 980px 290px)", animation: "os-node1 20s linear infinite 10s" } as React.CSSProperties} />
        <circle r="4" fill="#8b7cff" opacity="0.8" filter="url(#os-blur4)"
          style={{ offsetPath: "ellipse(215px 80px at 980px 290px)", animation: "os-node2 13s linear infinite" } as React.CSSProperties} />
        <circle r="3.5" fill="#ff65dd" opacity="0.75" filter="url(#os-blur4)"
          style={{ offsetPath: "ellipse(148px 52px at 980px 290px)", animation: "os-node3 8s linear infinite reverse" } as React.CSSProperties} />

        {/* Floating particles — spread across right 60% of canvas */}
        {[
          { cx: 700,  cy: 80,  r: 1.8, c: "#54f4ff", d: "0s",    t: "7s"  },
          { cx: 1050, cy: 120, r: 1.4, c: "#8b7cff", d: "1.2s",  t: "9s"  },
          { cx: 1160, cy: 260, r: 1.9, c: "#54f4ff", d: "0.5s",  t: "11s" },
          { cx: 760,  cy: 380, r: 1.5, c: "#ff65dd", d: "2s",    t: "8s"  },
          { cx: 1080, cy: 440, r: 1.3, c: "#54f4ff", d: "3s",    t: "10s" },
          { cx: 850,  cy: 55,  r: 1.6, c: "#8b7cff", d: "1.8s",  t: "6s"  },
          { cx: 1140, cy: 90,  r: 1.1, c: "#54f4ff", d: "0.8s",  t: "12s" },
          { cx: 720,  cy: 230, r: 1.3, c: "#ff65dd", d: "4s",    t: "7s"  },
          { cx: 810,  cy: 510, r: 1.8, c: "#54f4ff", d: "2.5s",  t: "9s"  },
          { cx: 1000, cy: 490, r: 1.5, c: "#8b7cff", d: "0.3s",  t: "8s"  },
          { cx: 1180, cy: 370, r: 1.2, c: "#ff65dd", d: "1.5s",  t: "11s" },
          { cx: 670,  cy: 460, r: 2,   c: "#54f4ff", d: "3.5s",  t: "7s"  },
        ].map((p, i) => (
          <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill={p.c}
            filter="url(#os-blur4)"
            style={{ animation: `os-particle ${p.t} ease-in-out infinite ${p.d}` }} />
        ))}

        {/* Data connection lines from core */}
        <line x1="980" y1="290" x2="780" y2="140"
          stroke="#54f4ff" strokeWidth="0.5" strokeDasharray="4 7" opacity="0.28"
          style={{ animation: "os-flicker 4s ease-in-out infinite" }} />
        <line x1="980" y1="290" x2="1150" y2="120"
          stroke="#8b7cff" strokeWidth="0.5" strokeDasharray="4 9" opacity="0.22"
          style={{ animation: "os-flicker 5s ease-in-out infinite 1s" }} />
        <line x1="980" y1="290" x2="1070" y2="480"
          stroke="#ff65dd" strokeWidth="0.5" strokeDasharray="3 8" opacity="0.2"
          style={{ animation: "os-flicker 6s ease-in-out infinite 2s" }} />

        {/* BISMI IS REASONING label */}
        <text x="980" y="356"
          textAnchor="middle"
          fontFamily="'Manrope','Inter',system-ui,sans-serif"
          fontSize="9.5" fontWeight="700" letterSpacing="3.5"
          fill="#54f4ff" opacity="0.65"
          style={{ animation: "os-label 3s ease-in-out infinite" }}
        >
          BISMI IS REASONING
        </text>

        {/* Subtle planet — far left, very low opacity */}
        <circle cx="60" cy="520" r="90" fill="#0d1128" opacity="0.45" />
        <circle cx="60" cy="520" r="90" fill="none" stroke="#8b7cff" strokeWidth="0.5" opacity="0.12" />
        <ellipse cx="60" cy="520" rx="90" ry="28" fill="none" stroke="#54f4ff" strokeWidth="0.5" opacity="0.16" />
        <ellipse cx="60" cy="520" rx="50" ry="90" fill="none" stroke="#8b7cff" strokeWidth="0.4" opacity="0.1" />
      </svg>

      <style>{`
        @keyframes os-spin1 {
          from { transform: rotate(0deg); } to { transform: rotate(360deg); }
        }
        @keyframes os-spin2 {
          from { transform: rotate(0deg); } to { transform: rotate(360deg); }
        }
        @keyframes os-spin3 {
          from { transform: rotate(0deg); } to { transform: rotate(-360deg); }
        }
        @keyframes os-node1 {
          from { offset-distance: 0%; } to { offset-distance: 100%; }
        }
        @keyframes os-node2 {
          from { offset-distance: 0%; } to { offset-distance: 100%; }
        }
        @keyframes os-node3 {
          from { offset-distance: 100%; } to { offset-distance: 0%; }
        }
        @keyframes os-pulse {
          0%, 100% { opacity: 0.10; }
          50%       { opacity: 0.28; }
        }
        @keyframes os-particle {
          0%, 100% { transform: translate(0,0) scale(1);          opacity: 0.55; }
          33%       { transform: translate(-9px,-15px) scale(1.25); opacity: 1;    }
          66%       { transform: translate(7px,-7px) scale(0.85);  opacity: 0.65; }
        }
        @keyframes os-flicker {
          0%, 100% { opacity: 0.22; }
          50%       { opacity: 0.04; }
        }
        @keyframes os-label {
          0%, 100% { opacity: 0.55; }
          50%       { opacity: 0.9;  }
        }
      `}</style>
    </div>
  );
}
