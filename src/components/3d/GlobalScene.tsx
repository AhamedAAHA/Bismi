"use client";

import { usePathname } from "next/navigation";
import SceneCanvas from "./SceneCanvas";
import { SentraCoreField } from "./SentraField";

/** Full-screen ambient 3D background for authenticated and login areas. */
export default function GlobalScene() {
  const pathname = usePathname() || "/";

  if (pathname.startsWith("/receipt")) return null;
  const isLanding = pathname === "/";
  const fieldScale = isLanding ? 0.58 : 0.72;
  const fieldSpeed = isLanding ? 0.78 : 1;
  const fieldPosition: [number, number, number] = isLanding
    ? [2.15, -0.26, -0.7]
    : [1.1, -0.2, 0];

  return (
    <SceneCanvas
      className="global-scene"
      camera={{ position: [0, 0.2, 6.8], fov: 38 }}
      interactive={false}
      opaque={false}
    >
      <ambientLight intensity={0.7} />
      <pointLight
        position={[3, 4, 4]}
        intensity={isLanding ? 1.6 : 2.3}
        color="#67f6ff"
      />
      <pointLight
        position={[-4, -2, 3]}
        intensity={isLanding ? 0.85 : 1.2}
        color="#a071ff"
      />
      <group position={fieldPosition}>
        <SentraCoreField scale={fieldScale} speed={fieldSpeed} />
      </group>
    </SceneCanvas>
  );
}
