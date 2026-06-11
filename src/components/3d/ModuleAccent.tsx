"use client";

import SceneCanvas from "./SceneCanvas";
import { SentraCoreField } from "./SentraField";

export type ModuleAccentVariant =
  | "attendance"
  | "qr"
  | "test"
  | "leaderboard"
  | "ai"
  | "homework"
  | "result";

const tones: Record<ModuleAccentVariant, { a: string; b: string; c: string }> = {
  attendance: { a: "#67f6ff", b: "#67d0ff", c: "#9b8cff" },
  qr: { a: "#5ef5df", b: "#67f6ff", c: "#7ea2ff" },
  test: { a: "#63e3ff", b: "#67f6ff", c: "#9b8cff" },
  leaderboard: { a: "#ffd36a", b: "#67f6ff", c: "#b88cff" },
  ai: { a: "#67f6ff", b: "#9b8cff", c: "#ff83de" },
  homework: { a: "#67f6ff", b: "#7ea2ff", c: "#9b8cff" },
  result: { a: "#ffe084", b: "#67f6ff", c: "#9b8cff" },
};

export default function ModuleAccent({
  variant,
  className = "",
  height = 220,
}: {
  variant: ModuleAccentVariant;
  className?: string;
  scanActive?: boolean;
  height?: number;
}) {
  const tone = tones[variant];

  return (
    <div className={`module-accent ${className}`} style={{ height }}>
      <SceneCanvas camera={{ position: [0, 0.15, 5], fov: 36 }} interactive={false}>
        <ambientLight intensity={0.75} />
        <pointLight position={[2.5, 3.2, 4]} intensity={2} color={tone.a} />
        <pointLight position={[-2.5, -2, 3]} intensity={1.3} color={tone.c} />
        <group position={[0, -0.05, 0]} scale={0.72}>
          <SentraCoreField speed={0.8} />
        </group>
      </SceneCanvas>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at 28% 32%, ${tone.a}2b, transparent 40%), radial-gradient(circle at 74% 70%, ${tone.c}26, transparent 45%)`,
        }}
      />
    </div>
  );
}

