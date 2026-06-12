"use client";

/**
 * OrbitalScene — dark futuristic orbital UI background.
 * Pure CSS animation: large soft orbit rings, floating particles, glowing AI core,
 * and "BISMI IS REASONING" label.
 *
 * Usage:
 *   <section style={{ position: "relative", overflow: "hidden" }}>
 *     <OrbitalScene />
 *     <div style={{ position: "relative", zIndex: 10 }}> ... content ... </div>
 *   </section>
 */

export default function OrbitalScene({ opacity = 0.55 }: { opacity?: number }) {
  return (
    <div
      className="orbital-scene"
      aria-hidden="true"
      style={{
        position: "fixed",
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
        className="orbital-svg"
        viewBox="0 0 900 600"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <defs>
          {/* Radial glow for core */}
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#54f4ff" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#8b7cff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0b0a1c" stopOpacity="0" />
          </radialGradient>
          {/* Outer ambient glow */}
          <radialGradient id="ambientGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2f8fff" stopOpacity="0.18" />
            <stop offset="60%" stopColor="#8b7cff" stopOpacity="0.08" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          {/* Ring gradient stroke */}
          <linearGradient id="ringGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#54f4ff" stopOpacity="0" />
            <stop offset="30%" stopColor="#54f4ff" stopOpacity="0.7" />
            <stop offset="70%" stopColor="#8b7cff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ff65dd" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="ringGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b7cff" stopOpacity="0" />
            <stop offset="40%" stopColor="#8b7cff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#54f4ff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="ringGrad3" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff65dd" stopOpacity="0" />
            <stop offset="50%" stopColor="#ff65dd" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#54f4ff" stopOpacity="0" />
          </linearGradient>
          {/* Core inner glow */}
          <filter id="blur4" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
          <filter id="blur10" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
          <filter id="blur20" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="20" />
          </filter>
        </defs>

        {/* Ambient background glow */}
        <ellipse cx="660" cy="200" rx="340" ry="260" fill="url(#ambientGlow)" />

        {/* Large soft orbit rings — elliptical to suggest 3D tilt */}
        {/* Ring 1 – largest, cyan */}
        <ellipse
          cx="660" cy="220"
          rx="290" ry="110"
          fill="none"
          stroke="url(#ringGrad1)"
          strokeWidth="1.2"
          style={{ animation: "orbitSpin1 18s linear infinite", transformOrigin: "660px 220px" }}
        />
        {/* Ring 2 – medium, purple */}
        <ellipse
          cx="660" cy="220"
          rx="210" ry="76"
          fill="none"
          stroke="url(#ringGrad2)"
          strokeWidth="0.9"
          style={{ animation: "orbitSpin2 12s linear infinite", transformOrigin: "660px 220px" }}
        />
        {/* Ring 3 – inner, pink */}
        <ellipse
          cx="660" cy="220"
          rx="145" ry="50"
          fill="none"
          stroke="url(#ringGrad3)"
          strokeWidth="0.7"
          style={{ animation: "orbitSpin3 8s linear infinite reverse", transformOrigin: "660px 220px" }}
        />

        {/* Soft glow behind core */}
        <circle cx="660" cy="220" r="80" fill="url(#coreGlow)" filter="url(#blur20)" />

        {/* Glowing AI core — sphere suggestion */}
        <circle cx="660" cy="220" r="28" fill="#0d1a35" />
        <circle cx="660" cy="220" r="28" fill="none" stroke="#54f4ff" strokeWidth="1.5" opacity="0.8" />
        {/* Inner wireframe cross-lines */}
        <ellipse cx="660" cy="220" rx="28" ry="10" fill="none" stroke="#54f4ff" strokeWidth="0.6" opacity="0.5" />
        <ellipse cx="660" cy="220" rx="10" ry="28" fill="none" stroke="#8b7cff" strokeWidth="0.6" opacity="0.5" />
        {/* Core pulsing glow */}
        <circle cx="660" cy="220" r="20" fill="#54f4ff" opacity="0.12"
          style={{ animation: "corePulse 3s ease-in-out infinite" }} />
        <circle cx="660" cy="220" r="12" fill="#54f4ff" opacity="0.22"
          style={{ animation: "corePulse 3s ease-in-out infinite 0.5s" }} />
        <circle cx="660" cy="220" r="5" fill="#fff" opacity="0.9" filter="url(#blur4)" />

        {/* Floating orbital nodes on rings */}
        {/* Node 1 on ring 1 */}
        <circle r="4.5" fill="#54f4ff" opacity="0.9" filter="url(#blur4)"
          style={{ animation: "nodeOrbit1 18s linear infinite", offsetPath: "ellipse(290px 110px at 660px 220px)" } as React.CSSProperties} />
        {/* Node 2 on ring 1 (opposite side) */}
        <circle r="3" fill="#8b7cff" opacity="0.8" filter="url(#blur4)"
          style={{ animation: "nodeOrbit1 18s linear infinite 9s", offsetPath: "ellipse(290px 110px at 660px 220px)" } as React.CSSProperties} />
        {/* Node 3 on ring 2 */}
        <circle r="4" fill="#8b7cff" opacity="0.85" filter="url(#blur4)"
          style={{ animation: "nodeOrbit2 12s linear infinite", offsetPath: "ellipse(210px 76px at 660px 220px)" } as React.CSSProperties} />
        {/* Node 4 on ring 3 */}
        <circle r="3.5" fill="#ff65dd" opacity="0.8" filter="url(#blur4)"
          style={{ animation: "nodeOrbit3 8s linear infinite reverse", offsetPath: "ellipse(145px 50px at 660px 220px)" } as React.CSSProperties} />

        {/* Floating particles scattered around */}
        {[
          { cx: 420, cy: 90,  r: 1.8, color: "#54f4ff", delay: "0s",   dur: "7s"  },
          { cx: 780, cy: 130, r: 1.4, color: "#8b7cff", delay: "1.2s", dur: "9s"  },
          { cx: 890, cy: 280, r: 2,   color: "#54f4ff", delay: "0.5s", dur: "11s" },
          { cx: 500, cy: 340, r: 1.5, color: "#ff65dd", delay: "2s",   dur: "8s"  },
          { cx: 760, cy: 360, r: 1.2, color: "#54f4ff", delay: "3s",   dur: "10s" },
          { cx: 600, cy: 60,  r: 1.6, color: "#8b7cff", delay: "1.8s", dur: "6s"  },
          { cx: 830, cy: 80,  r: 1,   color: "#54f4ff", delay: "0.8s", dur: "12s" },
          { cx: 480, cy: 200, r: 1.3, color: "#ff65dd", delay: "4s",   dur: "7s"  },
          { cx: 570, cy: 420, r: 1.8, color: "#54f4ff", delay: "2.5s", dur: "9s"  },
          { cx: 700, cy: 380, r: 1.5, color: "#8b7cff", delay: "0.3s", dur: "8s"  },
          { cx: 860, cy: 320, r: 1.2, color: "#ff65dd", delay: "1.5s", dur: "11s" },
          { cx: 440, cy: 430, r: 2,   color: "#54f4ff", delay: "3.5s", dur: "7s"  },
        ].map((p, i) => (
          <circle
            key={i}
            cx={p.cx}
            cy={p.cy}
            r={p.r}
            fill={p.color}
            filter="url(#blur4)"
            style={{ animation: `particleFloat ${p.dur} ease-in-out infinite ${p.delay}` }}
          />
        ))}

        {/* Dashed data connection lines */}
        <line x1="660" y1="220" x2="500" y2="120" stroke="#54f4ff" strokeWidth="0.5" strokeDasharray="4 6" opacity="0.3"
          style={{ animation: "lineFlicker 4s ease-in-out infinite" }} />
        <line x1="660" y1="220" x2="820" y2="100" stroke="#8b7cff" strokeWidth="0.5" strokeDasharray="4 8" opacity="0.25"
          style={{ animation: "lineFlicker 5s ease-in-out infinite 1s" }} />
        <line x1="660" y1="220" x2="750" y2="390" stroke="#ff65dd" strokeWidth="0.5" strokeDasharray="3 7" opacity="0.22"
          style={{ animation: "lineFlicker 6s ease-in-out infinite 2s" }} />

        {/* BISMI IS REASONING label */}
        <text
          x="640" y="285"
          textAnchor="middle"
          fontFamily="'Manrope', 'Inter', system-ui, sans-serif"
          fontSize="9"
          fontWeight="700"
          letterSpacing="4"
          fill="#54f4ff"
          opacity="0.7"
          style={{ animation: "labelPulse 3s ease-in-out infinite" }}
        >
          BISMI IS REASONING
        </text>

        {/* Subtle planet/sphere object — bottom left */}
        <circle cx="130" cy="420" r="90" fill="none" stroke="#8b7cff" strokeWidth="0.5" opacity="0.15" />
        <circle cx="130" cy="420" r="90" fill="#0d1128" opacity="0.6" />
        <ellipse cx="130" cy="420" rx="90" ry="30" fill="none" stroke="#54f4ff" strokeWidth="0.5" opacity="0.2" />
        <ellipse cx="130" cy="420" rx="55" ry="90" fill="none" stroke="#8b7cff" strokeWidth="0.4" opacity="0.15" />
        <circle cx="130" cy="420" r="90" fill="none"
          stroke="url(#ringGrad2)" strokeWidth="1"
          style={{ animation: "planetRing 25s linear infinite", transformOrigin: "130px 420px" }} />
        {/* Planet glow */}
        <circle cx="130" cy="420" r="90" fill="none" filter="url(#blur20)"
          style={{ animation: "corePulse 6s ease-in-out infinite" }}>
          <animate attributeName="opacity" values="0.05;0.15;0.05" dur="6s" repeatCount="indefinite" />
        </circle>
      </svg>

      <style>{`
        @keyframes orbitSpin1 {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes orbitSpin2 {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes orbitSpin3 {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes nodeOrbit1 {
          from { offset-distance: 0%; }
          to   { offset-distance: 100%; }
        }
        @keyframes nodeOrbit2 {
          from { offset-distance: 0%; }
          to   { offset-distance: 100%; }
        }
        @keyframes nodeOrbit3 {
          from { offset-distance: 100%; }
          to   { offset-distance: 0%; }
        }
        @keyframes corePulse {
          0%, 100% { opacity: 0.12; r: 18; }
          50%       { opacity: 0.28; r: 24; }
        }
        @keyframes particleFloat {
          0%, 100% { transform: translate(0, 0) scale(1);   opacity: 0.6; }
          33%       { transform: translate(-8px, -14px) scale(1.2); opacity: 1; }
          66%       { transform: translate(6px, -6px) scale(0.9);  opacity: 0.7; }
        }
        @keyframes lineFlicker {
          0%, 100% { opacity: 0.25; }
          50%       { opacity: 0.05; }
        }
        @keyframes labelPulse {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1; }
        }
        @keyframes planetRing {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
