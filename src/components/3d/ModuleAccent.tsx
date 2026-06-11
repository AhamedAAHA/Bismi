"use client";

import dynamic from "next/dynamic";
import SceneCanvas from "./SceneCanvas";
import {
  ProgressRing,
  QRPedestal,
  KnowledgeSphere,
  StarTrophy,
  PodiumBlock,
} from "./primitives/EducationObjects";
import ParticleField from "./primitives/ParticleField";
import { useSceneTheme } from "./hooks/useSceneTheme";
import { usePerformanceTier, tierValue } from "./hooks/usePerformanceTier";

export type ModuleAccentVariant =
  | "attendance"
  | "qr"
  | "test"
  | "leaderboard"
  | "ai"
  | "homework"
  | "result";

function AccentContent({ variant, scanActive }: { variant: ModuleAccentVariant; scanActive?: boolean }) {
  const colors = useSceneTheme();
  const tier = usePerformanceTier();

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[2, 2, 3]} intensity={0.8} color={colors.primary} />
      <ParticleField color={colors.particle} tier={tier} spread={6} size={0.025} count={tierValue(tier, 30, 18, 10)} />

      {variant === "attendance" && (
        <>
          <mesh>
            <sphereGeometry args={[0.9, 32, 32]} />
            <meshStandardMaterial color={colors.primary} emissive={colors.accent} emissiveIntensity={0.2} wireframe transparent opacity={0.35} />
          </mesh>
          <ProgressRing position={[0, 0, 0.5]} color={colors.accent} />
        </>
      )}

      {variant === "qr" && <QRPedestal color={colors.primary} accent={colors.accent} scanActive={scanActive} />}

      {variant === "test" && (
        <>
          <mesh position={[0, 0, 0]} rotation={[0.2, 0.4, 0]}>
            <boxGeometry args={[1.4, 1.8, 0.08]} />
            <meshStandardMaterial color={colors.primary} emissive={colors.glow} emissiveIntensity={0.15} metalness={0.7} roughness={0.2} />
          </mesh>
          <ProgressRing position={[0, 0, 0.6]} color={colors.accent} />
        </>
      )}

      {variant === "leaderboard" && (
        <>
          <PodiumBlock position={[-0.9, -0.3, 0]} color="#cbd5e1" height={0.6} />
          <PodiumBlock position={[0, 0, 0]} color="#fbbf24" height={1} />
          <PodiumBlock position={[0.9, -0.15, 0]} color="#d97706" height={0.75} />
          <StarTrophy position={[0, 1.2, 0]} color="#fbbf24" />
        </>
      )}

      {variant === "ai" && <KnowledgeSphere position={[0, 0, 0]} color={colors.primary} accent={colors.accent} />}

      {variant === "homework" && (
        <>
          <mesh position={[-0.4, 0.2, 0]} rotation={[0, 0.3, 0.1]}>
            <boxGeometry args={[0.8, 1, 0.06]} />
            <meshStandardMaterial color={colors.primary} emissive={colors.accent} emissiveIntensity={0.12} />
          </mesh>
          <mesh position={[0.5, -0.1, 0.2]} rotation={[0, -0.4, -0.05]}>
            <boxGeometry args={[0.7, 0.9, 0.06]} />
            <meshStandardMaterial color={colors.accent} emissive={colors.glow} emissiveIntensity={0.1} />
          </mesh>
        </>
      )}

      {variant === "result" && (
        <mesh rotation={[0, 0.3, 0]}>
          <planeGeometry args={[1.6, 2]} />
          <meshStandardMaterial color="#fef3c7" emissive="#f59e0b" emissiveIntensity={0.15} metalness={0.4} roughness={0.3} />
        </mesh>
      )}
    </>
  );
}

export default function ModuleAccent({
  variant,
  className = "",
  scanActive,
  height = 220,
}: {
  variant: ModuleAccentVariant;
  className?: string;
  scanActive?: boolean;
  height?: number;
}) {
  const tier = usePerformanceTier();
  if (tier === "low") return <div className={`module-accent-fallback ${className}`} style={{ height }} />;

  return (
    <div className={`module-accent ${className}`} style={{ height }}>
      <SceneCanvas camera={{ position: [0, 0.5, 3.5], fov: 40 }} interactive={false}>
        <AccentContent variant={variant} scanActive={scanActive} />
      </SceneCanvas>
    </div>
  );
}
