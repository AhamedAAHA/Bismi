"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function SentraCoreField({
  scale = 1,
  speed = 1,
}: {
  scale?: number;
  speed?: number;
}) {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const ringC = useRef<THREE.Mesh>(null);
  const nodes = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => {
        const angle = (index / 18) * Math.PI * 2;
        const radius = 2.1 + (index % 3) * 0.28;
        return {
          position: new THREE.Vector3(
            Math.cos(angle) * radius,
            Math.sin(angle * 1.7) * 0.28,
            Math.sin(angle) * radius
          ),
          size: 0.035 + (index % 4) * 0.008,
          glow: index % 2 ? "#9ca8ff" : "#54f4ff",
        };
      }),
    []
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    if (group.current) {
      group.current.rotation.y = t * 0.22;
      group.current.rotation.x = Math.sin(t * 0.35) * 0.08;
    }
    if (core.current) {
      core.current.rotation.x = t * 0.34;
      core.current.rotation.y = t * 0.48;
    }
    if (ringA.current) ringA.current.rotation.z = t * 0.36;
    if (ringB.current) ringB.current.rotation.x = Math.PI / 2 + t * 0.24;
    if (ringC.current) ringC.current.rotation.y = Math.PI / 2 - t * 0.28;
  });

  return (
    <group ref={group} scale={scale}>
      <mesh ref={core}>
        <icosahedronGeometry args={[0.92, 2]} />
        <meshStandardMaterial
          color="#8eefff"
          emissive="#2fd7ff"
          emissiveIntensity={0.42}
          roughness={0.18}
          metalness={0.52}
        />
      </mesh>
      <mesh scale={1.05}>
        <icosahedronGeometry args={[0.92, 1]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.18} />
      </mesh>
      <mesh ref={ringA} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.55, 0.018, 18, 160]} />
        <meshStandardMaterial
          color="#53f4ff"
          emissive="#53f4ff"
          emissiveIntensity={1.2}
          roughness={0.32}
        />
      </mesh>
      <mesh ref={ringB} rotation={[Math.PI / 2, 0.5, 0.1]}>
        <torusGeometry args={[1.92, 0.012, 18, 160]} />
        <meshStandardMaterial
          color="#8b7cff"
          emissive="#8b7cff"
          emissiveIntensity={0.75}
          roughness={0.28}
        />
      </mesh>
      <mesh ref={ringC} rotation={[0.18, Math.PI / 2, 0.18]}>
        <torusGeometry args={[2.02, 0.01, 18, 180]} />
        <meshStandardMaterial
          color="#ff65dd"
          emissive="#ff65dd"
          emissiveIntensity={0.55}
          roughness={0.3}
        />
      </mesh>
      {nodes.map((node, index) => (
        <mesh key={index} position={node.position} scale={node.size}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial
            color={node.glow}
            emissive={node.glow}
            emissiveIntensity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

