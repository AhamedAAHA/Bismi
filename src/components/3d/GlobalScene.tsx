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
        camera={{ position: [0, 0, 7.5], fov: 32 }}
        interactive={false}
        opaque={false}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[6, 3, 3]}   intensity={1.4} color="#67f6ff" />
        <pointLight position={[-2, -2, 4]} intensity={0.7} color="#a071ff" />
        {/* Small sphere pushed far right — only partially visible, acts as accent */}
        <group position={[5.5, 0, -2]}>
          <SentraCoreField scale={0.38} speed={0.6} />
        </group>
      </SceneCanvas>
    </div>
  );
}
