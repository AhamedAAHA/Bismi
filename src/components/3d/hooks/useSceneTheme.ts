"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export interface SceneColors {
  bg: string;
  primary: string;
  accent: string;
  glow: string;
  particle: string;
  fog: string;
  ambient: number;
}

export function useSceneTheme(): SceneColors {
  const { resolvedTheme } = useTheme();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(resolvedTheme === "dark");
  }, [resolvedTheme]);

  return dark
    ? {
        bg: "#060a14",
        primary: "#5b8cff",
        accent: "#22d3ee",
        glow: "#7c3aed",
        particle: "#60a5fa",
        fog: "#0a0f1e",
        ambient: 0.35,
      }
    : {
        bg: "#eef4fb",
        primary: "#3563ff",
        accent: "#06b6d4",
        glow: "#818cf8",
        particle: "#3563ff",
        fog: "#eef4fb",
        ambient: 0.55,
      };
}
