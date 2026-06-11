"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Environment, Stars } from "@react-three/drei";
import {
  EducationCore,
  FloatingBook,
  GraduationCap3D,
  FloatingPencil,
  SchoolBag,
  ExamPaper,
  Certificate3D,
  FormulaOrb,
} from "../primitives/EducationObjects";
import ParticleField, { GlowParticles } from "../primitives/ParticleField";
import LearningPath3D from "../primitives/LearningPath3D";
import { useSceneTheme } from "../hooks/useSceneTheme";
import { usePerformanceTier, tierValue } from "../hooks/usePerformanceTier";
import { useMouseParallax } from "../hooks/useMouseParallax";

function CameraRig({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const { camera } = useThree();
  useFrame(() => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.current.x * 0.8, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.current.y * 0.4 + 0.5, 0.04);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function LandingSceneContent({ hero = false }: { hero?: boolean }) {
  const colors = useSceneTheme();
  const tier = usePerformanceTier();
  const mouse = useMouseParallax();
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.03 + mouse.current.x * 0.12;
    }
  });

  const bookCount = tierValue(tier, 5, 4, 3);

  return (
    <>
      <color attach="background" args={[colors.bg]} />
      <fog attach="fog" args={[colors.fog, 8, 28]} />
      <ambientLight intensity={colors.ambient} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color={colors.primary} />
      <pointLight position={[-5, -3, 3]} intensity={0.8} color={colors.accent} />
      <spotLight position={[0, 8, 4]} angle={0.4} penumbra={0.8} intensity={1.5} color={colors.glow} castShadow />

      <CameraRig mouse={mouse} />

      {tier !== "low" && <Stars radius={40} depth={30} count={tierValue(tier, 800, 400, 0)} factor={3} fade speed={0.5} />}
      {tier === "high" && <Environment preset="city" />}

      <ParticleField color={colors.particle} accent={colors.accent} tier={tier} mouse={mouse} spread={18} />
      <GlowParticles color={colors.accent} count={tierValue(tier, 24, 14, 8)} />

      <group ref={groupRef}>
        {hero && <EducationCore color={colors.primary} accent={colors.accent} />}

        <LearningPath3D color={colors.primary} accent={colors.accent} />

        {bookCount >= 1 && <FloatingBook position={[-3.5, 1.2, -1]} color={colors.primary} scale={0.9} speed={1.1} />}
        {bookCount >= 2 && <FloatingBook position={[3.8, -0.5, 0.5]} color={colors.accent} rotation={[0.3, 0.8, 0]} scale={0.75} />}
        {bookCount >= 3 && <FloatingBook position={[-2, -2, 1.5]} color={colors.glow} rotation={[-0.2, -0.5, 0.1]} scale={0.65} />}
        {bookCount >= 4 && <FloatingBook position={[2.5, 2, -1.5]} color="#818cf8" scale={0.8} speed={1.3} />}
        {bookCount >= 5 && <FloatingBook position={[0.5, -2.5, -2]} color={colors.primary} scale={0.55} />}

        <GraduationCap3D position={[-4, 2.5, -2]} color={colors.primary} />
        <FloatingPencil position={[4.2, 1.8, -1]} />
        <SchoolBag position={[-3, -1.5, 2]} color={colors.primary} />
        <ExamPaper position={[3.5, -1.8, 1.5]} />
        <Certificate3D position={[-1.5, 3, 1]} />

        {tier !== "low" && (
          <>
            <FormulaOrb position={[-2.5, 0.5, 2]} label="E=mc²" color={colors.accent} />
            <FormulaOrb position={[1.8, 2.2, 1.5]} label="π" color={colors.glow} />
            <FormulaOrb position={[0.5, -1.2, -2.5]} label="a²+b²" color={colors.primary} />
          </>
        )}
      </group>
    </>
  );
}
