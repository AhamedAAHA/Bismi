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
        camera={{ position: [0, 0.2, 6.8], fov: 38 }}
        interactive={false}
        opaque={false}
      >
        <ambientLight intensity={0.65} />
        <pointLight position={[3, 4, 4]}   intensity={1.8} color="#67f6ff" />
        <pointLight position={[-4, -2, 3]} intensity={1.0} color="#a071ff" />
        {/* Positioned far right so it decorates without covering centred text */}
        <group position={[3.2, -0.1, -1.2]}>
          <SentraCoreField scale={0.7} speed={0.75} />
        </group>
      </SceneCanvas>
    </div>
  );
}
