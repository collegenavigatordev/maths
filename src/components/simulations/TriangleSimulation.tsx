import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Line } from '@react-three/drei';
import { Vector3 } from 'three';

interface TriangleSimulationProps {
  mode: 'guided' | 'free';
}

const TriangleSimulation: React.FC<TriangleSimulationProps> = ({ mode }) => {
  const [vertices, setVertices] = useState([
    new Vector3(-2, -1, 0),
    new Vector3(2, -1, 0),
    new Vector3(0, 2, 0)
  ]);
  const [selectedVertex, setSelectedVertex] = useState<number | null>(null);
  const triangleRef = useRef();

  // Calculate triangle properties
  const sideA = vertices[1].distanceTo(vertices[2]);
  const sideB = vertices[0].distanceTo(vertices[2]);
  const sideC = vertices[0].distanceTo(vertices[1]);
  
  const angleA = Math.acos((sideB * sideB + sideC * sideC - sideA * sideA) / (2 * sideB * sideC)) * (180 / Math.PI);
  const angleB = Math.acos((sideA * sideA + sideC * sideC - sideB * sideB) / (2 * sideA * sideC)) * (180 / Math.PI);
  const angleC = 180 - angleA - angleB;

  const area = 0.5 * Math.abs((vertices[1].x - vertices[0].x) * (vertices[2].y - vertices[0].y) - (vertices[2].x - vertices[0].x) * (vertices[1].y - vertices[0].y));

  const handleVertexDrag = (index: number, newPosition: Vector3) => {
    if (mode === 'free') {
      const newVertices = [...vertices];
      newVertices[index] = newPosition;
      setVertices(newVertices);
    }
  };

  return (
    <group>
      {/* Triangle edges */}
      <Line
        points={[vertices[0], vertices[1], vertices[2], vertices[0]]}
        color="#4ecdc4"
        lineWidth={3}
      />
      
      {/* Vertices */}
      {vertices.map((vertex, index) => (
        <mesh
          key={index}
          position={vertex}
          onClick={() => setSelectedVertex(index)}
          onPointerOver={() => document.body.style.cursor = 'pointer'}
          onPointerOut={() => document.body.style.cursor = 'none'}
        >
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial 
            color={selectedVertex === index ? '#ff6b6b' : '#ffffff'}
            emissive={selectedVertex === index ? '#ff6b6b' : '#000000'}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}

      {/* Labels for vertices */}
      <Text position={[vertices[0].x - 0.3, vertices[0].y - 0.3, 0]} fontSize={0.3} color="white">
        A
      </Text>
      <Text position={[vertices[1].x + 0.3, vertices[1].y - 0.3, 0]} fontSize={0.3} color="white">
        B
      </Text>
      <Text position={[vertices[2].x, vertices[2].y + 0.3, 0]} fontSize={0.3} color="white">
        C
      </Text>

      {/* Side length labels */}
      <Text 
        position={[
          (vertices[0].x + vertices[1].x) / 2, 
          (vertices[0].y + vertices[1].y) / 2 - 0.4, 
          0
        ]} 
        fontSize={0.2} 
        color="#feca57"
      >
        c = {sideC.toFixed(2)}
      </Text>
      
      <Text 
        position={[
          (vertices[1].x + vertices[2].x) / 2 + 0.3, 
          (vertices[1].y + vertices[2].y) / 2, 
          0
        ]} 
        fontSize={0.2} 
        color="#feca57"
      >
        a = {sideA.toFixed(2)}
      </Text>
      
      <Text 
        position={[
          (vertices[0].x + vertices[2].x) / 2 - 0.3, 
          (vertices[0].y + vertices[2].y) / 2, 
          0
        ]} 
        fontSize={0.2} 
        color="#feca57"
      >
        b = {sideB.toFixed(2)}
      </Text>

      {/* Properties panel */}
      <group position={[4, 2, 0]}>
        <mesh>
          <planeGeometry args={[3, 4]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.7} />
        </mesh>
        
        <Text position={[0, 1.5, 0.01]} fontSize={0.25} color="#4ecdc4" anchorX="center">
          Triangle Properties
        </Text>
        
        <Text position={[0, 1, 0.01]} fontSize={0.15} color="white" anchorX="center">
          Angles:
        </Text>
        <Text position={[0, 0.7, 0.01]} fontSize={0.12} color="#feca57" anchorX="center">
          ∠A = {angleA.toFixed(1)}°
        </Text>
        <Text position={[0, 0.5, 0.01]} fontSize={0.12} color="#feca57" anchorX="center">
          ∠B = {angleB.toFixed(1)}°
        </Text>
        <Text position={[0, 0.3, 0.01]} fontSize={0.12} color="#feca57" anchorX="center">
          ∠C = {angleC.toFixed(1)}°
        </Text>
        
        <Text position={[0, -0.1, 0.01]} fontSize={0.15} color="white" anchorX="center">
          Area:
        </Text>
        <Text position={[0, -0.4, 0.01]} fontSize={0.12} color="#ff6b6b" anchorX="center">
          {area.toFixed(2)} units²
        </Text>
        
        <Text position={[0, -0.8, 0.01]} fontSize={0.12} color="#96ceb4" anchorX="center">
          Perimeter: {(sideA + sideB + sideC).toFixed(2)}
        </Text>
        
        {mode === 'free' && (
          <Text position={[0, -1.3, 0.01]} fontSize={0.1} color="#888888" anchorX="center">
            Click and drag vertices to modify
          </Text>
        )}
      </group>
    </group>
  );
};

export default TriangleSimulation;