"use client";

import { useEffect, useState } from "react";

export type PerformanceTier = "high" | "medium" | "low";

export function usePerformanceTier(): PerformanceTier {
  const [tier, setTier] = useState<PerformanceTier>("medium");

  useEffect(() => {
    const w = window.innerWidth;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;

    if (w < 480 || (coarse && mem <= 2)) setTier("low");
    else if (w < 1024 || coarse || mem <= 4) setTier("medium");
    else setTier("high");
  }, []);

  return tier;
}

export function tierValue(tier: PerformanceTier, high: number, medium: number, low: number) {
  if (tier === "high") return high;
  if (tier === "medium") return medium;
  return low;
}
