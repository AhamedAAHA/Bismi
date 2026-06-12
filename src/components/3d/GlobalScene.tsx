"use client";

import SceneCanvas from "./SceneCanvas";
import { SentraCoreField } from "./SentraField";

/**
 * Hero 3D scene — absolute background inside the landing hero section.
 * Parent must have: position:relative; overflow:hidden; min-height set.
 */
export default function GlobalScene() {
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
      }}
    >
      <SceneCanvas
        className=""
        camera={{ position: [0, 0, 7.5], fov: 42 }}
        interactive={false}
        opaque={false}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[6, 3, 3]}   intensity={1.6} color="#67f6ff" />
        <pointLight position={[-2, -2, 4]} intensity={0.8} color="#a071ff" />
        {/* Centred in the right half — x offset pushes it to align with right column */}
        <group position={[2.4, 0, 0]}>
          <SentraCoreField scale={0.72} speed={0.65} />
        </group>
      </SceneCanvas>
    </div>
  );
}
