"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const GlobalScene = dynamic(() => import("./3d/GlobalScene"), { ssr: false });
const LandingAmbientScene = dynamic(
  () => import("./3d/GlobalScene").then((m) => ({ default: m.LandingAmbientScene })),
  { ssr: false }
);

/** Minimal CSS fallback when user prefers reduced motion */
function ReducedMotionBg() {
  return <div className="reduced-motion-bg" aria-hidden="true" />;
}

export default function SceneRoot() {
  const pathname = usePathname() || "/";
  const [reduced, setReduced] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  if (!mounted) return null;
  if (reduced) return <ReducedMotionBg />;

  return (
    <>
      {pathname === "/" && <LandingAmbientScene />}
      <GlobalScene />
    </>
  );
}
