import React, { useState } from 'react';
import { Line, Text } from '@react-three/drei';
import { Vector3 } from 'three';

interface CoordinateGeometryProps {
  mode: 'guided' | 'free';
}

const CoordinateGeometry: React.FC<CoordinateGeometryProps> = ({ mode }) => {
  const [points, setPoints] = useState([
    { x: -2, y: 1, label: 'A' },
    { x: 3, y: 2, label: 'B' },
    { x: 1, y: -2, label: 'C' }
  ]);

  // Grid lines
  const gridLines = [];
  for (let i = -5; i <= 5; i++) {
    // Vertical lines
    gridLines.push(
      <Line
        key={`v${i}`}
        points={[new Vector3(i, -5, 0), new Vector3(i, 5, 0)]}
        color={i === 0 ? '#ffffff' : '#333333'}
        lineWidth={i === 0 ? 2 : 1}
      />
    );
    // Horizontal lines
    gridLines.push(
      <Line
        key={`h${i}`}
        points={[new Vector3(-5, i, 0), new Vector3(5, i, 0)]}
        color={i === 0 ? '#ffffff' : '#333333'}
        lineWidth={i === 0 ? 2 : 1}
      />
    );
  }

  // Calculate distances
  const distanceAB = Math.sqrt(Math.pow(points[1].x - points[0].x, 2) + Math.pow(points[1].y - points[0].y, 2));
  const distanceBC = Math.sqrt(Math.pow(points[2].x - points[1].x, 2) + Math.pow(points[2].y - points[1].y, 2));
  const distanceCA = Math.sqrt(Math.pow(points[0].x - points[2].x, 2) + Math.pow(points[0].y - points[2].y, 2));

  // Calculate midpoints
  const midpointAB = { x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2 };
  const midpointBC = { x: (points[1].x + points[2].x) / 2, y: (points[1].y + points[2].y) / 2 };
  const midpointCA = { x: (points[2].x + points[0].x) / 2, y: (points[2].y + points[0].y) / 2 };

  return (
    <group>
      {/* Grid */}
      {gridLines}
      
      {/* Axis labels */}
      <Text position={[5.2, 0, 0]} fontSize={0.3} color="white">X</Text>
      <Text position={[0, 5.2, 0]} fontSize={0.3} color="white">Y</Text>
      
      {/* Grid numbers */}
      {[-4, -3, -2, -1, 1, 2, 3, 4].map(num => (
        <React.Fragment key={num}>
          <Text position={[num, -0.3, 0]} fontSize={0.2} color="#888888">{num}</Text>
          <Text position={[-0.3, num, 0]} fontSize={0.2} color="#888888">{num}</Text>
        </React.Fragment>
      ))}

      {/* Points */}
      {points.map((point, index) => (
        <group key={index}>
          <mesh position={[point.x, point.y, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="#ff6b6b" emissive="#ff6b6b" emissiveIntensity={0.3} />
          </mesh>
          <Text 
            position={[point.x + 0.2, point.y + 0.2, 0]} 
            fontSize={0.25} 
            color="white"
          >
            {point.label}({point.x}, {point.y})
          </Text>
        </group>
      ))}

      {/* Lines connecting points */}
      <Line
        points={[
          new Vector3(points[0].x, points[0].y, 0),
          new Vector3(points[1].x, points[1].y, 0),
          new Vector3(points[2].x, points[2].y, 0),
          new Vector3(points[0].x, points[0].y, 0)
        ]}
        color="#4ecdc4"
        lineWidth={2}
      />

      {/* Midpoints */}
      <mesh position={[midpointAB.x, midpointAB.y, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#feca57" />
      </mesh>
      <mesh position={[midpointBC.x, midpointBC.y, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#feca57" />
      </mesh>
      <mesh position={[midpointCA.x, midpointCA.y, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#feca57" />
      </mesh>

      {/* Information panel */}
      <group position={[6, 2, 0]}>
        <mesh>
          <planeGeometry args={[4, 5]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.8} />
        </mesh>
        
        <Text position={[0, 2, 0.01]} fontSize={0.25} color="#4ecdc4" anchorX="center">
          Coordinate Analysis
        </Text>
        
        <Text position={[0, 1.5, 0.01]} fontSize={0.15} color="white" anchorX="center">
          Distances:
        </Text>
        <Text position={[0, 1.2, 0.01]} fontSize={0.12} color="#ff6b6b" anchorX="center">
          AB = {distanceAB.toFixed(2)}
        </Text>
        <Text position={[0, 1, 0.01]} fontSize={0.12} color="#ff6b6b" anchorX="center">
          BC = {distanceBC.toFixed(2)}
        </Text>
        <Text position={[0, 0.8, 0.01]} fontSize={0.12} color="#ff6b6b" anchorX="center">
          CA = {distanceCA.toFixed(2)}
        </Text>
        
        <Text position={[0, 0.4, 0.01]} fontSize={0.15} color="white" anchorX="center">
          Midpoints:
        </Text>
        <Text position={[0, 0.1, 0.01]} fontSize={0.12} color="#feca57" anchorX="center">
          M(AB) = ({midpointAB.x.toFixed(1)}, {midpointAB.y.toFixed(1)})
        </Text>
        <Text position={[0, -0.1, 0.01]} fontSize={0.12} color="#feca57" anchorX="center">
          M(BC) = ({midpointBC.x.toFixed(1)}, {midpointBC.y.toFixed(1)})
        </Text>
        <Text position={[0, -0.3, 0.01]} fontSize={0.12} color="#feca57" anchorX="center">
          M(CA) = ({midpointCA.x.toFixed(1)}, {midpointCA.y.toFixed(1)})
        </Text>
        
        <Text position={[0, -0.7, 0.01]} fontSize={0.15} color="white" anchorX="center">
          Formulas:
        </Text>
        <Text position={[0, -1, 0.01]} fontSize={0.1} color="#96ceb4" anchorX="center">
          Distance = √[(x₂-x₁)² + (y₂-y₁)²]
        </Text>
        <Text position={[0, -1.2, 0.01]} fontSize={0.1} color="#96ceb4" anchorX="center">
          Midpoint = ((x₁+x₂)/2, (y₁+y₂)/2)
        </Text>
      </group>
    </group>
  );
};

export default CoordinateGeometry;