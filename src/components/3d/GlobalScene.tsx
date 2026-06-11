"use client";

import SceneCanvas from "./SceneCanvas";
import { SentraCoreField } from "./SentraField";

/**
 * Hero 3D scene — used as an absolute background inside the landing hero section.
 * Parent must be: position:relative; overflow:hidden.
 */
export default function GlobalScene() {
  return (
    <div
      className="hero-scene"
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <SceneCanvas
        className=""
        camera={{ position: [0, 0.2, 6.8], fov: 38 }}
        interactive={false}
        opaque={false}
      >
        <ambientLight intensity={0.7} />
        <pointLight position={[3, 4, 4]} intensity={1.6} color="#67f6ff" />
        <pointLight position={[-4, -2, 3]} intensity={0.85} color="#a071ff" />
        <group position={[2.15, -0.26, -0.7]}>
          <SentraCoreField scale={0.58} speed={0.78} />
        </group>
      </SceneCanvas>
    </div>
  );
}
