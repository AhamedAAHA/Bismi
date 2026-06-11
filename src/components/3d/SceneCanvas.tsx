"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, ReactNode } from "react";
import { usePerformanceTier } from "./hooks/usePerformanceTier";

interface Props {
  children: ReactNode;
  className?: string;
  camera?: { position: [number, number, number]; fov?: number };
  interactive?: boolean;
}

function SceneLoader() {
  return null;
}

export default function SceneCanvas({
  children,
  className = "",
  camera = { position: [0, 0, 8], fov: 45 },
  interactive = true,
}: Props) {
  const tier = usePerformanceTier();
  const dpr = tier === "high" ? [1, 2] : tier === "medium" ? [1, 1.5] : [1, 1];

  return (
    <div className={`scene-canvas ${className}`} aria-hidden="true">
      <Canvas
        dpr={dpr as [number, number]}
        camera={camera}
        gl={{ antialias: tier !== "low", alpha: true, powerPreference: "high-performance" }}
        frameloop={interactive ? "always" : "demand"}
        style={{ pointerEvents: interactive ? "auto" : "none" }}
      >
        <Suspense fallback={<SceneLoader />}>{children}</Suspense>
      </Canvas>
    </div>
  );
}
