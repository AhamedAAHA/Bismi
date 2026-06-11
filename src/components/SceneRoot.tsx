"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const GlobalScene = dynamic(() => import("./3d/GlobalScene"), { ssr: false });

export default function SceneRoot() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <GlobalScene />;
}
