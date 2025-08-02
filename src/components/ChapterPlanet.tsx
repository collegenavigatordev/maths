import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Text } from '@react-three/drei';
import { Mesh } from 'three';

interface ChapterPlanetProps {
  chapter: {
    id: number;
    title: string;
    color: string;
    position: [number, number, number];
  };
  onSelect: (id: number) => void;
  isSelected: boolean;
}

const ChapterPlanet: React.FC<ChapterPlanetProps> = ({ chapter, onSelect, isSelected }) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x += 0.005;
      
      if (hovered) {
        meshRef.current.scale.setScalar(1.2);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  return (
    <group position={chapter.position}>
      <Sphere
        ref={meshRef}
        args={[0.5, 32, 32]}
        onClick={() => onSelect(chapter.id)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial 
          color={chapter.color}
          roughness={0.3}
          metalness={0.7}
          emissive={hovered ? chapter.color : '#000000'}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
      </Sphere>
      
      {hovered && (
        <Text
          position={[0, 1, 0]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {chapter.title}
        </Text>
      )}
      
      {/* Orbital ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 0.81, 64]} />
        <meshBasicMaterial color={chapter.color} transparent opacity={0.3} />
      </mesh>
    </group>
  );
};

export default ChapterPlanet;