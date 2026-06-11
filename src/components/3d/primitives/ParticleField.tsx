"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { tierValue, PerformanceTier } from "../hooks/usePerformanceTier";

interface Props {
  count?: number;
  color: string;
  accent?: string;
  tier?: PerformanceTier;
  spread?: number;
  size?: number;
  mouse?: React.MutableRefObject<{ x: number; y: number }>;
}

export default function ParticleField({
  count: countProp,
  color,
  accent,
  tier = "medium",
  spread = 14,
  size = 0.04,
  mouse,
}: Props) {
  const ref = useRef<THREE.Points>(null);
  const count = countProp ?? tierValue(tier, 120, 70, 35);

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * spread;
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.7;
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread;
      spd[i] = 0.2 + Math.random() * 0.8;
    }
    return [pos, spd];
  }, [count, spread]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += Math.sin(t * speeds[i] + i) * 0.002;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    if (mouse) {
      ref.current.rotation.y = mouse.current.x * 0.08;
      ref.current.rotation.x = mouse.current.y * 0.05;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={0.75}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export function GlowParticles({ color, count = 20 }: { color: string; count?: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.1;
  });
  return (
    <group ref={ref}>
      {Array.from({ length: count }).map((_, i) => {
        const a = (i / count) * Math.PI * 2;
        const r = 2.5 + (i % 3) * 0.4;
        return (
          <mesh key={i} position={[Math.cos(a) * r, Math.sin(i * 0.7) * 0.5, Math.sin(a) * r]}>
            <sphereGeometry args={[0.03, 6, 6]} />
            <meshBasicMaterial color={color} transparent opacity={0.6} />
          </mesh>
        );
      })}
    </group>
  );
}
