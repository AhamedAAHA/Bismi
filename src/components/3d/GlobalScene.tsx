"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { usePerformanceTier } from "./hooks/usePerformanceTier";

const SceneCanvas = dynamic(() => import("./SceneCanvas"), { ssr: false });
const LandingSceneContent = dynamic(() => import("./scenes/LandingScene"), { ssr: false });
const DashboardSceneContent = dynamic(() => import("./scenes/DashboardScene"), { ssr: false });
const LoginSceneContent = dynamic(() => import("./scenes/LoginScene"), { ssr: false });

function getDashboardVariant(path: string): "admin" | "student" | "parent" | null {
  if (path.startsWith("/admin")) return "admin";
  if (path.startsWith("/student")) return "student";
  if (path.startsWith("/parent")) return "parent";
  return null;
}

/** Full-screen ambient 3D background (excludes landing — it uses Hero3D) */
export default function GlobalScene() {
  const pathname = usePathname() || "/";

  if (pathname === "/" || pathname.startsWith("/receipt")) return null;

  const dash = getDashboardVariant(pathname);
  const isLogin = pathname.startsWith("/login");

  if (!dash && !isLogin) return null;

  return (
    <SceneCanvas
      className="global-scene"
      camera={{ position: [0, 0.5, 7], fov: 50 }}
      interactive={false}
    >
      {isLogin ? (
        <LoginSceneContent />
      ) : dash ? (
        <DashboardSceneContent variant={dash} />
      ) : null}
    </SceneCanvas>
  );
}

/** Cinematic landing background (lighter, behind content) */
export function LandingAmbientScene() {
  const tier = usePerformanceTier();
  if (tier === "low") return null;

  return (
    <SceneCanvas className="landing-ambient-scene" camera={{ position: [0, 0, 10], fov: 48 }} interactive={false}>
      <LandingSceneContent hero={false} />
    </SceneCanvas>
  );
}
