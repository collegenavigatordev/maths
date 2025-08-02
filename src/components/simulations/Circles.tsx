import React, { useState, useMemo } from 'react';
import { Line, Text, Box } from '@react-three/drei';
import { Vector3 } from 'three';

interface CirclesProps {
  mode: 'guided' | 'free';
}

const Circles: React.FC<CirclesProps> = ({ mode }) => {
  const [radius, setRadius] = useState(3);
  const [centerX, setCenterX] = useState(0);
  const [centerY, setCenterY] = useState(0);
  const [showTangent, setShowTangent] = useState(true);
  const [showChord, setShowChord] = useState(true);

  // Generate circle points
  const circlePoints = useMemo(() => {
    const points = [];
    for (let angle = 0; angle <= 2 * Math.PI; angle += 0.1) {
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      points.push(new Vector3(x, y, 0));
    }
    return points;
  }, [radius, centerX, centerY]);

  // Tangent line at 45 degrees
  const tangentPoint = useMemo(() => {
    const angle = Math.PI / 4; // 45 degrees
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  }, [radius, centerX, centerY]);

  const tangentLine = useMemo(() => {
    const slope = -Math.cos(Math.PI / 4) / Math.sin(Math.PI / 4); // Perpendicular to radius
    const length = 4;
    return [
      new Vector3(tangentPoint.x - length, tangentPoint.y + slope * length, 0),
      new Vector3(tangentPoint.x + length, tangentPoint.y - slope * length, 0)
    ];
  }, [tangentPoint]);

  // Chord points
  const chordPoints = useMemo(() => {
    const angle1 = Math.PI / 6; // 30 degrees
    const angle2 = 5 * Math.PI / 6; // 150 degrees
    return [
      new Vector3(centerX + radius * Math.cos(angle1), centerY + radius * Math.sin(angle1), 0),
      new Vector3(centerX + radius * Math.cos(angle2), centerY + radius * Math.sin(angle2), 0)
    ];
  }, [radius, centerX, centerY]);

  return (
    <group>
      {/* Coordinate System */}
      <Line points={[new Vector3(-8, 0, 0), new Vector3(8, 0, 0)]} color="#666666" />
      <Line points={[new Vector3(0, -8, 0), new Vector3(0, 8, 0)]} color="#666666" />

      {/* Circle */}
      <Line points={circlePoints} color="#4ecdc4" lineWidth={3} />

      {/* Center point */}
      <mesh position={[centerX, centerY, 0]}>
        <sphereGeometry args={[0.1]} />
        <meshStandardMaterial color="#ff6b6b" emissive="#ff6b6b" emissiveIntensity={0.5} />
      </mesh>
      <Text position={[centerX + 0.3, centerY + 0.3, 0]} fontSize={0.2} color="#ff6b6b">
        O({centerX}, {centerY})
      </Text>

      {/* Radius */}
      <Line 
        points={[new Vector3(centerX, centerY, 0), new Vector3(centerX + radius, centerY, 0)]} 
        color="#feca57" 
        lineWidth={2}
      />
      <Text position={[centerX + radius/2, centerY + 0.3, 0]} fontSize={0.2} color="#feca57">
        r = {radius}
      </Text>

      {/* Diameter */}
      <Line 
        points={[new Vector3(centerX - radius, centerY, 0), new Vector3(centerX + radius, centerY, 0)]} 
        color="#ff9ff3" 
        lineWidth={2}
      />
      <Text position={[centerX, centerY - 0.5, 0]} fontSize={0.2} color="#ff9ff3" anchorX="center">
        d = {2 * radius}
      </Text>

      {/* Tangent */}
      {showTangent && (
        <>
          <Line points={tangentLine} color="#96ceb4" lineWidth={2} />
          <mesh position={[tangentPoint.x, tangentPoint.y, 0]}>
            <sphereGeometry args={[0.08]} />
            <meshStandardMaterial color="#96ceb4" />
          </mesh>
          <Text position={[tangentPoint.x + 0.5, tangentPoint.y + 0.5, 0]} fontSize={0.15} color="#96ceb4">
            Tangent
          </Text>
          {/* Radius to tangent point */}
          <Line 
            points={[new Vector3(centerX, centerY, 0), new Vector3(tangentPoint.x, tangentPoint.y, 0)]} 
            color="#888888" 
            lineWidth={1}
          />
        </>
      )}

      {/* Chord */}
      {showChord && (
        <>
          <Line points={chordPoints} color="#45b7d1" lineWidth={2} />
          <Text position={[chordPoints[0].x, chordPoints[0].y + 0.3, 0]} fontSize={0.15} color="#45b7d1">
            A
          </Text>
          <Text position={[chordPoints[1].x, chordPoints[1].y + 0.3, 0]} fontSize={0.15} color="#45b7d1">
            B
          </Text>
          <Text position={[centerX - 1, centerY + 2, 0]} fontSize={0.15} color="#45b7d1">
            Chord AB
          </Text>
        </>
      )}

      {/* Properties Panel */}
      <group position={[9, 2, 0]}>
        <Box args={[4, 8, 0.1]}>
          <meshBasicMaterial color="#000000" transparent opacity={0.8} />
        </Box>
        
        <Text position={[0, 3.5, 0.1]} fontSize={0.25} color="#4ecdc4" anchorX="center">
          Circle Properties
        </Text>
        
        <Text position={[0, 3, 0.1]} fontSize={0.2} color="#ff6b6b" anchorX="center">
          Basic Elements
        </Text>
        <Text position={[0, 2.7, 0.1]} fontSize={0.12} color="white" anchorX="center">
          Center: ({centerX}, {centerY})
        </Text>
        <Text position={[0, 2.5, 0.1]} fontSize={0.12} color="white" anchorX="center">
          Radius: {radius}
        </Text>
        <Text position={[0, 2.3, 0.1]} fontSize={0.12} color="white" anchorX="center">
          Diameter: {2 * radius}
        </Text>
        
        <Text position={[0, 1.9, 0.1]} fontSize={0.2} color="#feca57" anchorX="center">
          Measurements
        </Text>
        <Text position={[0, 1.6, 0.1]} fontSize={0.12} color="white" anchorX="center">
          Circumference: 2πr = {(2 * Math.PI * radius).toFixed(2)}
        </Text>
        <Text position={[0, 1.4, 0.1]} fontSize={0.12} color="white" anchorX="center">
          Area: πr² = {(Math.PI * radius * radius).toFixed(2)}
        </Text>
        
        <Text position={[0, 1, 0.1]} fontSize={0.2} color="#96ceb4" anchorX="center">
          Circle Theorems
        </Text>
        <Text position={[0, 0.7, 0.1]} fontSize={0.1} color="white" anchorX="center">
          • Tangent ⊥ Radius at point of contact
        </Text>
        <Text position={[0, 0.5, 0.1]} fontSize={0.1} color="white" anchorX="center">
          • Equal chords equidistant from center
        </Text>
        <Text position={[0, 0.3, 0.1]} fontSize={0.1} color="white" anchorX="center">
          • Angle in semicircle = 90°
        </Text>
        <Text position={[0, 0.1, 0.1]} fontSize={0.1} color="white" anchorX="center">
          • Angles in same segment are equal
        </Text>
        
        <Text position={[0, -0.3, 0.1]} fontSize={0.2} color="#45b7d1" anchorX="center">
          Equation Forms
        </Text>
        <Text position={[0, -0.6, 0.1]} fontSize={0.12} color="white" anchorX="center">
          Standard: (x-h)² + (y-k)² = r²
        </Text>
        <Text position={[0, -0.8, 0.1]} fontSize={0.12} color="white" anchorX="center">
          Current: (x-{centerX})² + (y-{centerY})² = {radius}²
        </Text>
        <Text position={[0, -1, 0.1]} fontSize={0.12} color="white" anchorX="center">
          General: x² + y² + Dx + Ey + F = 0
        </Text>
        
        <Text position={[0, -1.4, 0.1]} fontSize={0.2} color="#ff9ff3" anchorX="center">
          Tangent Properties
        </Text>
        <Text position={[0, -1.7, 0.1]} fontSize={0.1} color="white" anchorX="center">
          • Length from external point equal
        </Text>
        <Text position={[0, -1.9, 0.1]} fontSize={0.1} color="white" anchorX="center">
          • Tangent perpendicular to radius
        </Text>
        <Text position={[0, -2.1, 0.1]} fontSize={0.1} color="white" anchorX="center">
          • Common tangents to two circles
        </Text>
        
        <Text position={[0, -2.5, 0.1]} fontSize={0.2} color="#feca57" anchorX="center">
          Chord Properties
        </Text>
        <Text position={[0, -2.8, 0.1]} fontSize={0.1} color="white" anchorX="center">
          • Perpendicular from center bisects chord
        </Text>
        <Text position={[0, -3, 0.1]} fontSize={0.1} color="white" anchorX="center">
          • Equal chords subtend equal angles
        </Text>
      </group>

      {/* Interactive Controls */}
      {mode === 'free' && (
        <group position={[-9, 0, 0]}>
          <Box args={[3, 6, 0.1]}>
            <meshBasicMaterial color="#000000" transparent opacity={0.8} />
          </Box>
          
          <Text position={[0, 2.5, 0.1]} fontSize={0.2} color="white" anchorX="center">
            Circle Controls
          </Text>
          
          <Text position={[0, 2, 0.1]} fontSize={0.15} color="#feca57" anchorX="center">
            Radius
          </Text>
          <Box
            args={[0.3, 0.3, 0.1]}
            position={[0, 1.6, 0.1]}
            onClick={() => setRadius(prev => prev >= 5 ? 1 : prev + 0.5)}
          >
            <meshStandardMaterial color="#feca57" />
          </Box>
          <Text position={[0.5, 1.6, 0.1]} fontSize={0.15} color="white">
            {radius}
          </Text>
          
          <Text position={[0, 1, 0.1]} fontSize={0.15} color="#ff6b6b" anchorX="center">
            Center X
          </Text>
          <Box
            args={[0.3, 0.3, 0.1]}
            position={[0, 0.6, 0.1]}
            onClick={() => setCenterX(prev => prev >= 3 ? -3 : prev + 1)}
          >
            <meshStandardMaterial color="#ff6b6b" />
          </Box>
          <Text position={[0.5, 0.6, 0.1]} fontSize={0.15} color="white">
            {centerX}
          </Text>
          
          <Text position={[0, 0, 0.1]} fontSize={0.15} color="#96ceb4" anchorX="center">
            Center Y
          </Text>
          <Box
            args={[0.3, 0.3, 0.1]}
            position={[0, -0.4, 0.1]}
            onClick={() => setCenterY(prev => prev >= 3 ? -3 : prev + 1)}
          >
            <meshStandardMaterial color="#96ceb4" />
          </Box>
          <Text position={[0.5, -0.4, 0.1]} fontSize={0.15} color="white">
            {centerY}
          </Text>
          
          <Box
            args={[2, 0.3, 0.1]}
            position={[0, -1, 0.1]}
            onClick={() => setShowTangent(!showTangent)}
          >
            <meshStandardMaterial color={showTangent ? "#96ceb4" : "#333333"} />
          </Box>
          <Text position={[0, -1, 0.15]} fontSize={0.12} color="white" anchorX="center">
            Toggle Tangent
          </Text>
          
          <Box
            args={[2, 0.3, 0.1]}
            position={[0, -1.5, 0.1]}
            onClick={() => setShowChord(!showChord)}
          >
            <meshStandardMaterial color={showChord ? "#45b7d1" : "#333333"} />
          </Box>
          <Text position={[0, -1.5, 0.15]} fontSize={0.12} color="white" anchorX="center">
            Toggle Chord
          </Text>
        </group>
      )}

      {/* Real-world Applications */}
      <group position={[0, -6, 0]}>
        <Text fontSize={0.2} color="#96ceb4" anchorX="center">
          Real-world Applications
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -0.3, 0]}>
          • Wheel design and mechanics
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -0.6, 0]}>
          • Satellite orbits and planetary motion
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -0.9, 0]}>
          • Architecture: domes, arches, circular buildings
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -1.2, 0]}>
          • Sports: circular tracks, ball trajectories
        </Text>
      </group>
    </group>
  );
};

export default Circles;