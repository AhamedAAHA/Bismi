"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

export default function LearningPath3D({ color, accent }: { color: string; accent: string }) {
  const materialRef = useRef<THREE.LineBasicMaterial>(null);

  const points = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-4, -1, -2),
      new THREE.Vector3(-2, 1.5, 0),
      new THREE.Vector3(0, 0.5, 1),
      new THREE.Vector3(2, 2, -1),
      new THREE.Vector3(4, 0, 2),
    ]);
    return curve.getPoints(64).map((p) => [p.x, p.y, p.z] as [number, number, number]);
  }, []);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.opacity = 0.35 + Math.sin(clock.getElapsedTime()) * 0.15;
    }
  });

  return (
    <>
      <Line points={points} transparent lineWidth={1}>
        <lineBasicMaterial ref={materialRef} color={color} transparent opacity={0.5} />
      </Line>
      {points.filter((_, i) => i % 8 === 0).map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.8} />
        </mesh>
      ))}
    </>
  );
}

export function NetworkNodes({ color, accent }: { color: string; accent: string }) {
  const ref = useRef<THREE.Group>(null);
  const nodes: [number, number, number][] = [
    [-1.5, 0.5, 0], [0, 1, -0.5], [1.5, 0.3, 0.3], [-0.5, -0.8, 0.5], [1, -0.5, -0.3],
  ];
  const edges = [[0, 1], [1, 2], [0, 3], [3, 4], [2, 4], [1, 4]];

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.15;
  });

  return (
    <group ref={ref}>
      {edges.map(([a, b], i) => {
        const start = new THREE.Vector3(...nodes[a]);
        const end = new THREE.Vector3(...nodes[b]);
        const mid = start.clone().lerp(end, 0.5);
        const len = start.distanceTo(end);
        const dir = end.clone().sub(start).normalize();
        const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        return (
          <mesh key={i} position={mid.toArray()} quaternion={quat}>
            <cylinderGeometry args={[0.015, 0.015, len, 6]} />
            <meshStandardMaterial color={color} emissive={accent} emissiveIntensity={0.3} transparent opacity={0.6} />
          </mesh>
        );
      })}
      {nodes.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[i === 1 ? 0.14 : 0.1, 12, 12]} />
          <meshStandardMaterial color={i === 1 ? accent : color} emissive={accent} emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  );
}
