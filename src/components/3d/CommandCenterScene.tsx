"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import SceneCanvas from "./SceneCanvas";

export default function CommandCenterScene({ className = "", animated = true }: { className?: string; animated?: boolean }) {
  function SceneContent({ animatedFlag = true }: { animatedFlag?: boolean } = { animatedFlag: true }) {
    const root = useRef<THREE.Group | null>(null);
    const mouse = useRef({ x: 0, y: 0 });

    const panelData = useMemo(
      () => [
        { label: "Attendance", offset: [2.1, 0.25, 0] as const },
        { label: "Tests", offset: [-2.2, 0.3, 0.2] as const },
        { label: "Fees", offset: [0.2, 0.4, 2.2] as const },
        { label: "Parents", offset: [-0.2, 0.32, -2.3] as const },
      ],
      []
    );

    useEffect(() => {
      const onMove = (e: MouseEvent) => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        mouse.current.x = (e.clientX / w - 0.5) * 1.6;
        mouse.current.y = (e.clientY / h - 0.5) * -1.6;
      };
      window.addEventListener("mousemove", onMove);
      return () => window.removeEventListener("mousemove", onMove);
    }, []);

    useFrame(({ clock }) => {
      const t = clock.getElapsedTime();
      if (root.current) {
        const targetX = animatedFlag ? mouse.current.y * 0.05 + Math.sin(t * 0.18) * 0.035 : 0;
        const targetY = animatedFlag ? mouse.current.x * 0.05 + Math.cos(t * 0.12) * 0.04 : 0;
        root.current.rotation.x += (targetX - root.current.rotation.x) * 0.08;
        root.current.rotation.y += (targetY - root.current.rotation.y) * 0.08;
        root.current.position.y = animatedFlag ? Math.sin(t * 0.32) * 0.04 : 0;
      }
    });

    return (
      <group ref={root} position={[0, -0.04, 0]}>
        <group position={[0, 0.08, 0]}>
          <mesh>
            <icosahedronGeometry args={[1.1, 3]} />
            <meshPhysicalMaterial
              color="#78d8ff"
              emissive="#3fd6ff"
              emissiveIntensity={0.92}
              roughness={0.08}
              metalness={0.35}
              clearcoat={0.72}
              clearcoatRoughness={0.06}
              transparent
              opacity={0.98}
            />
          </mesh>
        </group>

        <group position={[0, 0.02, 0]}>
          {panelData.map((panel, index) => {
            const angle = (index / panelData.length) * Math.PI * 2;
            return (
              <group key={panel.label} position={panel.offset} rotation={[0, angle + 0.45, 0]}>
                <mesh>
                  <planeGeometry args={[0.96, 0.46]} />
                  <meshStandardMaterial color="#0e1a2a" transparent opacity={0.86} roughness={0.2} metalness={0.18} emissive="#2faaff" emissiveIntensity={0.08} />
                </mesh>
                <mesh position={[-0.32, 0.12, 0.01]}>
                  <boxGeometry args={[0.08, 0.08, 0.02]} />
                  <meshStandardMaterial color="#7de6ff" emissive="#7de6ff" emissiveIntensity={0.85} roughness={0.2} metalness={0.3} />
                </mesh>
                <mesh position={[0.28, 0.12, 0.01]}>
                  <boxGeometry args={[0.16, 0.06, 0.02]} />
                  <meshStandardMaterial color="#d1e9ff" transparent opacity={0.75} roughness={0.15} />
                </mesh>
              </group>
            );
          })}
        </group>

        <group position={[0, 0.04, 0]}> 
          {[...Array(18)].map((_, i) => {
            const angle = (i / 18) * Math.PI * 2;
            const radius = 2.4 + (i % 2) * 0.12;
            return (
              <mesh key={i} position={[Math.cos(angle) * radius, Math.sin(angle * 0.45) * 0.08 - 0.03, Math.sin(angle) * radius]}>
                <sphereGeometry args={[0.07, 10, 10]} />
                <meshStandardMaterial color="#72c8ff" emissive="#5fd6ff" emissiveIntensity={0.45} roughness={0.35} />
              </mesh>
            );
          })}
        </group>

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.48, 0]}>
          <ringGeometry args={[2.3, 2.95, 64]} />
          <meshBasicMaterial color="#071823" transparent opacity={0.12} side={THREE.DoubleSide} />
        </mesh>
      </group>
    );
  }

  return (
    <div className={`hero-scene ${className}`} aria-hidden>
      <SceneCanvas camera={{ position: [0, 0.4, 6.2], fov: 42 }} interactive={false} opaque={false}>
        <ambientLight intensity={0.75} />
        <directionalLight position={[3.6, 5.2, 1.8]} intensity={0.78} color="#8bdcff" />
        <SceneContent animatedFlag={animated} />
      </SceneCanvas>
    </div>
  );
}
