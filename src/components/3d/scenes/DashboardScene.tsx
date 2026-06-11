"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  FloatingBook,
  AnalyticsCube,
  ProgressRing,
  StarTrophy,
  KnowledgeSphere,
} from "../primitives/EducationObjects";
import ParticleField from "../primitives/ParticleField";
import { NetworkNodes } from "../primitives/LearningPath3D";
import { useSceneTheme } from "../hooks/useSceneTheme";
import { usePerformanceTier, tierValue } from "../hooks/usePerformanceTier";

export type DashboardVariant = "admin" | "student" | "parent";

function AdminElements({ colors }: { colors: ReturnType<typeof useSceneTheme> }) {
  const tier = usePerformanceTier();
  const n = tierValue(tier, 4, 3, 2);
  return (
    <>
      {n >= 1 && <AnalyticsCube position={[-3, 1.5, -3]} color={colors.primary} />}
      {n >= 2 && <AnalyticsCube position={[3.5, -1, -4]} color={colors.accent} />}
      {n >= 3 && <AnalyticsCube position={[0, 2.5, -5]} color={colors.glow} />}
      <ProgressRing position={[-2, -1.5, -3]} color={colors.accent} />
      <ProgressRing position={[2.5, 1, -4]} color={colors.primary} />
    </>
  );
}

function StudentElements({ colors }: { colors: ReturnType<typeof useSceneTheme> }) {
  const tier = usePerformanceTier();
  return (
    <>
      <FloatingBook position={[-3.5, 1, -4]} color={colors.primary} scale={0.7} />
      <FloatingBook position={[3, -0.5, -3.5]} color={colors.accent} scale={0.6} />
      <ProgressRing position={[0, 0, -4]} color={colors.accent} />
      <StarTrophy position={[-1.5, 2, -3]} color="#fbbf24" />
      <StarTrophy position={[2, 1.5, -4]} color={colors.glow} />
      {tier !== "low" && <KnowledgeSphere position={[0, -1.5, -3]} color={colors.primary} accent={colors.accent} />}
    </>
  );
}

function ParentElements({ colors }: { colors: ReturnType<typeof useSceneTheme> }) {
  return (
    <>
      <group position={[0, 0, -4]}>
        <NetworkNodes color={colors.primary} accent={colors.accent} />
      </group>
      <ProgressRing position={[-3, 0.5, -3.5]} color={colors.glow} />
      <ProgressRing position={[3, -0.5, -3.5]} color={colors.accent} />
    </>
  );
}

export default function DashboardSceneContent({ variant }: { variant: DashboardVariant }) {
  const colors = useSceneTheme();
  const tier = usePerformanceTier();
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) groupRef.current.rotation.y = clock.getElapsedTime() * 0.015;
  });

  return (
    <>
      <fog attach="fog" args={[colors.fog, 6, 22]} />
      <ambientLight intensity={colors.ambient * 0.7} />
      <pointLight position={[3, 4, 2]} intensity={0.6} color={colors.primary} />
      <pointLight position={[-3, -2, 1]} intensity={0.4} color={colors.accent} />

      <ParticleField color={colors.particle} tier={tier} spread={12} size={0.03} count={tierValue(tier, 50, 30, 15)} />

      <group ref={groupRef}>
        {variant === "admin" && <AdminElements colors={colors} />}
        {variant === "student" && <StudentElements colors={colors} />}
        {variant === "parent" && <ParentElements colors={colors} />}
      </group>
    </>
  );
}
