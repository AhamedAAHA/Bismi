"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Float, MeshDistortMaterial } from "@react-three/drei";

export function EducationCore({ color, accent }: { color: string; accent: string }) {
  const ref = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) ref.current.rotation.y = t * 0.15;
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.5) * 0.1;
      ringRef.current.rotation.z = t * 0.3;
    }
  });

  return (
    <group ref={ref}>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.6}>
        <mesh>
          <icosahedronGeometry args={[1.1, 2]} />
          <MeshDistortMaterial
            color={color}
            emissive={accent}
            emissiveIntensity={0.45}
            roughness={0.15}
            metalness={0.85}
            distort={0.25}
            speed={1.8}
            transparent
            opacity={0.92}
          />
        </mesh>
      </Float>
      <mesh ref={ringRef}>
        <torusGeometry args={[1.65, 0.04, 16, 64]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.8} metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.1, 0.025, 12, 48]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

export function FloatingBook({
  position,
  rotation = [0, 0, 0],
  color,
  scale = 1,
  speed = 1,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  color: string;
  scale?: number;
  speed?: number;
}) {
  return (
    <Float speed={speed} rotationIntensity={0.4} floatIntensity={0.8}>
      <group position={position} rotation={rotation} scale={scale}>
        <mesh castShadow>
          <boxGeometry args={[0.9, 0.12, 0.65]} />
          <meshStandardMaterial color={color} roughness={0.4} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0.07, 0]}>
          <boxGeometry args={[0.85, 0.02, 0.6]} />
          <meshStandardMaterial color="#ffffff" emissive={color} emissiveIntensity={0.15} />
        </mesh>
      </group>
    </Float>
  );
}

export function GraduationCap3D({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <Float speed={1.2} rotationIntensity={0.5} floatIntensity={1}>
      <group position={position}>
        <mesh position={[0, 0.15, 0]} rotation={[0.1, 0.4, 0]}>
          <boxGeometry args={[0.9, 0.06, 0.9]} />
          <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.35, 12]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0.35, 0.05, 0.35]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
        </mesh>
      </group>
    </Float>
  );
}

export function FloatingPencil({ position }: { position: [number, number, number] }) {
  return (
    <Float speed={1.8} floatIntensity={1.2}>
      <group position={position} rotation={[0.5, 0.8, 0.3]}>
        <mesh>
          <cylinderGeometry args={[0.04, 0.04, 1.2, 8]} />
          <meshStandardMaterial color="#fbbf24" />
        </mesh>
        <mesh position={[0, -0.65, 0]}>
          <coneGeometry args={[0.05, 0.15, 8]} />
          <meshStandardMaterial color="#374151" />
        </mesh>
      </group>
    </Float>
  );
}

export function SchoolBag({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <Float speed={1} floatIntensity={0.6}>
      <group position={position}>
        <mesh>
          <boxGeometry args={[0.7, 0.85, 0.35]} />
          <meshStandardMaterial color={color} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.55, 0]}>
          <torusGeometry args={[0.25, 0.04, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      </group>
    </Float>
  );
}

export function ExamPaper({ position }: { position: [number, number, number] }) {
  return (
    <Float speed={1.4} rotationIntensity={0.3}>
      <mesh position={position} rotation={[0.2, -0.5, 0.1]}>
        <planeGeometry args={[0.55, 0.75]} />
        <meshStandardMaterial color="#f8fafc" emissive="#3563ff" emissiveIntensity={0.08} side={THREE.DoubleSide} />
      </mesh>
    </Float>
  );
}

export function Certificate3D({ position }: { position: [number, number, number] }) {
  return (
    <Float speed={0.9} floatIntensity={0.5}>
      <group position={position} rotation={[0, 0.6, 0]}>
        <mesh>
          <planeGeometry args={[0.7, 0.5]} />
          <meshStandardMaterial color="#fef3c7" emissive="#f59e0b" emissiveIntensity={0.12} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <circleGeometry args={[0.08, 16]} />
          <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.4} />
        </mesh>
      </group>
    </Float>
  );
}

export function FormulaOrb({ position, label, color }: { position: [number, number, number]; label: string; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.y = position[1] + Math.sin(clock.getElapsedTime() + position[0]) * 0.15;
  });
  return (
    <group position={position}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} transparent opacity={0.85} />
      </mesh>
    </group>
  );
}

export function AnalyticsCube({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.x = clock.getElapsedTime() * 0.4;
      ref.current.rotation.y = clock.getElapsedTime() * 0.55;
    }
  });
  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[0.45, 0.45, 0.45]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.25} wireframe transparent opacity={0.7} />
    </mesh>
  );
}

export function ProgressRing({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = clock.getElapsedTime() * 0.5;
  });
  return (
    <mesh ref={ref} position={position} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.6, 0.03, 8, 32, Math.PI * 1.5]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
    </mesh>
  );
}

export function StarTrophy({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <Float speed={1.6} floatIntensity={0.9}>
      <mesh position={position}>
        <octahedronGeometry args={[0.25, 0]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} metalness={0.9} roughness={0.1} />
      </mesh>
    </Float>
  );
}

export function KnowledgeSphere({ position, color, accent }: { position: [number, number, number]; color: string; accent: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.35;
  });
  return (
    <Float speed={2} floatIntensity={0.4}>
      <mesh ref={ref} position={position}>
        <sphereGeometry args={[0.55, 24, 24]} />
        <MeshDistortMaterial color={color} emissive={accent} emissiveIntensity={0.35} distort={0.3} speed={2} roughness={0.2} metalness={0.7} />
      </mesh>
    </Float>
  );
}

export function QRPedestal({ color, accent, scanActive }: { color: string; accent: string; scanActive?: boolean }) {
  const beamRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (beamRef.current && scanActive) {
      beamRef.current.position.y = -0.3 + (Math.sin(clock.getElapsedTime() * 2) * 0.5 + 0.5) * 1.2;
    }
  });
  return (
    <group>
      <mesh position={[0, -0.8, 0]}>
        <cylinderGeometry args={[1.2, 1.4, 0.3, 32]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} emissive={accent} emissiveIntensity={0.15} />
      </mesh>
      <mesh position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.9, 0.02, 8, 48]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.8} />
      </mesh>
      {scanActive && (
        <mesh ref={beamRef} position={[0, 0, 0]}>
          <planeGeometry args={[1.4, 0.04]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1} transparent opacity={0.7} />
        </mesh>
      )}
    </group>
  );
}

export function PodiumBlock({ position, color, height }: { position: [number, number, number]; color: string; height: number }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[1.2, height, 1.2]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} metalness={0.6} roughness={0.3} />
    </mesh>
  );
}
