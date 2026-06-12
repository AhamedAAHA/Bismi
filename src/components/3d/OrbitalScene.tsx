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
        viewBox="0 0 1400 600"
        preserveAspectRatio="xMaxYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: "absolute", top: 0, right: 0, height: "100%", width: "auto", maxWidth: "none", minWidth: "50%" }}
      >
        <defs>
          <radialGradient id="os-coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#54f4ff" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#8b7cff" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#040914" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="os-ambient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2f8fff" stopOpacity="0.12" />
            <stop offset="65%" stopColor="#8b7cff" stopOpacity="0.05" />
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

        {/* Ambient glow behind core — far right */}
        <ellipse cx="1130" cy="300" rx="380" ry="280" fill="url(#os-ambient)" />

        {/* ── Orbit rings centred on (1130, 300) ── */}
        <ellipse cx="1130" cy="300" rx="340" ry="125"
          fill="none" stroke="url(#os-ring1)" strokeWidth="1.2"
          style={{ animation: "os-spin1 22s linear infinite", transformOrigin: "1130px 300px" }} />
        <ellipse cx="1130" cy="300" rx="250" ry="88"
          fill="none" stroke="url(#os-ring2)" strokeWidth="0.9"
          style={{ animation: "os-spin2 14s linear infinite", transformOrigin: "1130px 300px" }} />
        <ellipse cx="1130" cy="300" rx="165" ry="56"
          fill="none" stroke="url(#os-ring3)" strokeWidth="0.7"
          style={{ animation: "os-spin3 9s linear infinite reverse", transformOrigin: "1130px 300px" }} />

        {/* Soft glow halo behind core */}
        <circle cx="1130" cy="300" r="80" fill="url(#os-coreGlow)" filter="url(#os-blur22)" />

        {/* Glowing AI core sphere — at cx=1130, partially off right edge on most screens */}
        <circle cx="1130" cy="300" r="28" fill="#0d1a35" />
        <circle cx="1130" cy="300" r="28" fill="none" stroke="#54f4ff" strokeWidth="1.5" opacity="0.85" />
        <ellipse cx="1130" cy="300" rx="28" ry="9"  fill="none" stroke="#54f4ff" strokeWidth="0.55" opacity="0.4" />
        <ellipse cx="1130" cy="300" rx="9"  ry="28" fill="none" stroke="#8b7cff" strokeWidth="0.55" opacity="0.4" />
        <circle cx="1130" cy="300" r="20" fill="#54f4ff" opacity="0.09"
          style={{ animation: "os-pulse 3s ease-in-out infinite" }} />
        <circle cx="1130" cy="300" r="11" fill="#54f4ff" opacity="0.16"
          style={{ animation: "os-pulse 3s ease-in-out infinite 0.6s" }} />
        <circle cx="1130" cy="300" r="5"  fill="#fff" opacity="0.9" filter="url(#os-blur4)" />

        {/* Orbital nodes */}
        <circle r="5" fill="#54f4ff" opacity="0.9" filter="url(#os-blur4)"
          style={{ offsetPath: "ellipse(340px 125px at 1130px 300px)", animation: "os-node1 22s linear infinite" } as React.CSSProperties} />
        <circle r="3.5" fill="#8b7cff" opacity="0.85" filter="url(#os-blur4)"
          style={{ offsetPath: "ellipse(340px 125px at 1130px 300px)", animation: "os-node1 22s linear infinite 11s" } as React.CSSProperties} />
        <circle r="4" fill="#8b7cff" opacity="0.8" filter="url(#os-blur4)"
          style={{ offsetPath: "ellipse(250px 88px at 1130px 300px)", animation: "os-node2 14s linear infinite" } as React.CSSProperties} />
        <circle r="3.5" fill="#ff65dd" opacity="0.75" filter="url(#os-blur4)"
          style={{ offsetPath: "ellipse(165px 56px at 1130px 300px)", animation: "os-node3 9s linear infinite reverse" } as React.CSSProperties} />

        {/* Floating particles — spread across right portion of canvas */}
        {[
          { cx: 800,  cy: 70,  r: 1.8, c: "#54f4ff", d: "0s",    t: "7s"  },
          { cx: 1200, cy: 110, r: 1.4, c: "#8b7cff", d: "1.2s",  t: "9s"  },
          { cx: 1340, cy: 240, r: 1.9, c: "#54f4ff", d: "0.5s",  t: "11s" },
          { cx: 860,  cy: 390, r: 1.5, c: "#ff65dd", d: "2s",    t: "8s"  },
          { cx: 1250, cy: 450, r: 1.3, c: "#54f4ff", d: "3s",    t: "10s" },
          { cx: 950,  cy: 50,  r: 1.6, c: "#8b7cff", d: "1.8s",  t: "6s"  },
          { cx: 1350, cy: 80,  r: 1.1, c: "#54f4ff", d: "0.8s",  t: "12s" },
          { cx: 820,  cy: 220, r: 1.3, c: "#ff65dd", d: "4s",    t: "7s"  },
          { cx: 900,  cy: 520, r: 1.8, c: "#54f4ff", d: "2.5s",  t: "9s"  },
          { cx: 1160, cy: 500, r: 1.5, c: "#8b7cff", d: "0.3s",  t: "8s"  },
          { cx: 1360, cy: 370, r: 1.2, c: "#ff65dd", d: "1.5s",  t: "11s" },
          { cx: 760,  cy: 460, r: 2,   c: "#54f4ff", d: "3.5s",  t: "7s"  },
        ].map((p, i) => (
          <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill={p.c}
            filter="url(#os-blur4)"
            style={{ animation: `os-particle ${p.t} ease-in-out infinite ${p.d}` }} />
        ))}

        {/* Data connection lines from core */}
        <line x1="1130" y1="300" x2="920"  y2="140"
          stroke="#54f4ff" strokeWidth="0.5" strokeDasharray="4 7" opacity="0.25"
          style={{ animation: "os-flicker 4s ease-in-out infinite" }} />
        <line x1="1130" y1="300" x2="1320" y2="120"
          stroke="#8b7cff" strokeWidth="0.5" strokeDasharray="4 9" opacity="0.2"
          style={{ animation: "os-flicker 5s ease-in-out infinite 1s" }} />
        <line x1="1130" y1="300" x2="1250" y2="490"
          stroke="#ff65dd" strokeWidth="0.5" strokeDasharray="3 8" opacity="0.18"
          style={{ animation: "os-flicker 6s ease-in-out infinite 2s" }} />

        {/* BISMI IS REASONING label */}
        <text x="1130" y="368"
          textAnchor="middle"
          fontFamily="'Manrope','Inter',system-ui,sans-serif"
          fontSize="9.5" fontWeight="700" letterSpacing="3.5"
          fill="#54f4ff" opacity="0.6"
          style={{ animation: "os-label 3s ease-in-out infinite" }}
        >
          BISMI IS REASONING
        </text>
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
