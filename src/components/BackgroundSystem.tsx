"use client";

import { useEffect, useRef } from "react";

export default function BackgroundSystem() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.max(1, window.devicePixelRatio || 1);
    function resize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const gradient = ctx.createLinearGradient(0, 0, w, h);
      gradient.addColorStop(0, "rgba(12,20,40,0.92)");
      gradient.addColorStop(0.4, "rgba(10,18,34,0.88)");
      gradient.addColorStop(1, "rgba(7,12,24,0.92)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      ctx.globalAlpha = 0.06;
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      for (let i = 0; i < 10; i++) {
        const radius = 60 + i * 28;
        ctx.beginPath();
        ctx.arc(w * 0.15, h * 0.2 + i * 42, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <div className="animated-gradient-mesh" aria-hidden style={{ position: "fixed", inset: 0, zIndex: -2 }}>
      <div className="aurora-light" style={{ position: "absolute", inset: 0 }} />
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
    </div>
  );
}
