"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { FloatingBook, GraduationCap3D, FloatingPencil, ExamPaper } from "../primitives/EducationObjects";
import ParticleField from "../primitives/ParticleField";
import { useSceneTheme } from "../hooks/useSceneTheme";
import { usePerformanceTier, tierValue } from "../hooks/usePerformanceTier";
import { useMouseParallax } from "../hooks/useMouseParallax";

export default function LoginSceneContent() {
  const colors = useSceneTheme();
  const tier = usePerformanceTier();
  const mouse = useMouseParallax();
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.04 + mouse.current.x * 0.15;
    }
  });

  return (
    <>
      <fog attach="fog" args={[colors.fog, 5, 18]} />
      <ambientLight intensity={colors.ambient} />
      <pointLight position={[4, 3, 4]} intensity={0.9} color={colors.primary} />
      <pointLight position={[-4, -2, 2]} intensity={0.6} color={colors.accent} />

      <ParticleField color={colors.particle} tier={tier} spread={10} size={0.035} mouse={mouse} count={tierValue(tier, 60, 40, 20)} />

      <group ref={ref}>
        <FloatingBook position={[-2.5, 1.5, -2]} color={colors.primary} scale={0.8} />
        <FloatingBook position={[2.8, -0.8, -1.5]} color={colors.accent} scale={0.65} />
        <GraduationCap3D position={[0, 2.2, -3]} color={colors.primary} />
        <FloatingPencil position={[-1.5, -1.5, -2]} />
        <ExamPaper position={[2, 1.8, -2.5]} />
      </group>
    </>
  );
}
