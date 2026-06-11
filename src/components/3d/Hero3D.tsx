"use client";

import dynamic from "next/dynamic";
import { usePerformanceTier } from "./hooks/usePerformanceTier";

const SceneCanvas = dynamic(() => import("./SceneCanvas"), { ssr: false });
const LandingSceneContent = dynamic(() => import("./scenes/LandingScene"), { ssr: false });

export default function Hero3D() {
  const tier = usePerformanceTier();

  return (
    <div className="hero-3d-wrap">
      <SceneCanvas
        className="hero-3d-canvas"
        camera={{ position: [0, 0.5, 6.5], fov: 42 }}
        interactive
      >
        <LandingSceneContent hero />
      </SceneCanvas>
      <div className="hero-3d-glow" aria-hidden="true" />
    </div>
  );
}
