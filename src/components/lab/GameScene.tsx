"use client";
import { Canvas } from "@react-three/fiber";
import { Float, Text } from "@react-three/drei";

function Coin({
  position,
  color,
  scale = 1,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
}) {
  return (
    <Float speed={1.6} rotationIntensity={1.2} floatIntensity={1.8}>
      <mesh position={position} rotation={[Math.PI / 2, 0, 0]} scale={scale}>
        <cylinderGeometry args={[0.45, 0.45, 0.1, 32]} />
        <meshStandardMaterial
          color={color}
          metalness={0.85}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.15}
        />
      </mesh>
    </Float>
  );
}

function FloatingQuestion({
  position,
  color = "#cfd6ff",
}: {
  position: [number, number, number];
  color?: string;
}) {
  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={1.4}>
      <Text
        position={position}
        fontSize={2.2}
        color={color}
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        ?
      </Text>
    </Float>
  );
}

function Orb({ position }: { position: [number, number, number] }) {
  return (
    <Float speed={2.4} rotationIntensity={0.4} floatIntensity={2}>
      <mesh position={position}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color="#a78bfa"
          emissive="#7c5cff"
          emissiveIntensity={0.5}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>
    </Float>
  );
}

export function GameScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 55 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.6]}
    >
      {/* Lighting — soft, cool, low-key */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -8, -8]} intensity={0.4} color="#8b5cf6" />
      <pointLight position={[8, -6, -4]} intensity={0.3} color="#5eead4" />

      {/* Floating coins — muted silver/gold */}
      <Coin position={[-5, 3, 0]} color="#cbd5e1" />
      <Coin position={[5, -2, -1]} color="#cbd5e1" />
      <Coin position={[-4, -3, -2]} color="#94a3b8" />
      <Coin position={[4, 2, -2]} color="#94a3b8" />
      <Coin position={[0, 4.5, -3]} color="#cbd5e1" scale={1.3} />
      <Coin position={[-2, 1, -4]} color="#cbd5e1" scale={0.7} />

      {/* Floating question marks — pale lavender */}
      <FloatingQuestion position={[-6, 0, -4]} />
      <FloatingQuestion position={[6, 1, -3]} />
      <FloatingQuestion position={[-3, -4, -5]} color="#a5b4fc" />
      <FloatingQuestion position={[3, 4, -5]} color="#a5b4fc" />

      {/* Glowing violet orbs — playful but subdued */}
      <Orb position={[-6, -1, -6]} />
      <Orb position={[6, -3, -5]} />
      <Orb position={[0, -4, -4]} />
    </Canvas>
  );
}