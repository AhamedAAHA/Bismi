"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, ReactNode, useEffect, useState } from "react";
import { usePerformanceTier } from "./hooks/usePerformanceTier";

interface Props {
  children: ReactNode;
  className?: string;
  camera?: { position: [number, number, number]; fov?: number };
  interactive?: boolean;
  /** Full-screen backgrounds use opaque canvas so the scene is visible behind UI */
  opaque?: boolean;
}

export default function SceneCanvas({
  children,
  className = "",
  camera = { position: [0, 0, 8], fov: 45 },
  interactive = true,
  opaque = false,
}: Props) {
  const tier = usePerformanceTier();
  const [canRender, setCanRender] = useState(false);
  const dpr = tier === "high" ? [1, 2] : tier === "medium" ? [1, 1.5] : [1, 1];

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");
      setCanRender(Boolean(gl));
    } catch {
      setCanRender(false);
    }
  }, []);

  if (!canRender) return null;

  return (
    <div className={`scene-canvas-inner ${className}`} aria-hidden="true" style={{ width: "100%", height: "100%", overflow: "hidden" }}>
      <Canvas
        dpr={dpr as [number, number]}
        camera={camera}
        gl={{
          antialias: tier !== "low",
          alpha: !opaque,
          powerPreference: "high-performance",
          preserveDrawingBuffer: false,
        }}
        frameloop="always"
        style={{ width: "100%", height: "100%", pointerEvents: interactive ? "auto" : "none" }}
      >
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  );
}
