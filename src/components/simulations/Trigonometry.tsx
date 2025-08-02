import React, { useState, useMemo } from 'react';
import { Line, Text, Box } from '@react-three/drei';
import { Vector3 } from 'three';

interface TrigonometryProps {
  mode: 'guided' | 'free';
}

const Trigonometry: React.FC<TrigonometryProps> = ({ mode }) => {
  const [angle, setAngle] = useState(45); // degrees
  const [radius, setRadius] = useState(3);
  const [showUnitCircle, setShowUnitCircle] = useState(true);

  const angleRad = (angle * Math.PI) / 180;

  // Unit circle points
  const unitCirclePoints = useMemo(() => {
    const points = [];
    for (let a = 0; a <= 2 * Math.PI; a += 0.1) {
      points.push(new Vector3(Math.cos(a), Math.sin(a), 0));
    }
    return points;
  }, []);

  // Current angle point on unit circle
  const anglePoint = useMemo(() => ({
    x: Math.cos(angleRad),
    y: Math.sin(angleRad)
  }), [angleRad]);

  // Trigonometric values
  const trigValues = useMemo(() => ({
    sin: Math.sin(angleRad),
    cos: Math.cos(angleRad),
    tan: Math.tan(angleRad),
    csc: 1 / Math.sin(angleRad),
    sec: 1 / Math.cos(angleRad),
    cot: 1 / Math.tan(angleRad)
  }), [angleRad]);

  // Right triangle for visualization
  const trianglePoints = useMemo(() => [
    new Vector3(0, 0, 0), // Origin
    new Vector3(anglePoint.x * radius, 0, 0), // Adjacent
    new Vector3(anglePoint.x * radius, anglePoint.y * radius, 0), // Opposite
    new Vector3(0, 0, 0) // Back to origin
  ], [anglePoint, radius]);

  return (
    <group>
      {/* Coordinate System */}
      <Line points={[new Vector3(-4, 0, 0), new Vector3(4, 0, 0)]} color="#666666" />
      <Line points={[new Vector3(0, -4, 0), new Vector3(0, 4, 0)]} color="#666666" />

      {/* Unit Circle */}
      {showUnitCircle && (
        <Line points={unitCirclePoints} color="#4ecdc4" lineWidth={2} />
      )}

      {/* Right Triangle */}
      <Line points={trianglePoints} color="#ff6b6b" lineWidth={3} />

      {/* Angle arc */}
      <group>
        {Array.from({ length: Math.floor(angle / 5) }, (_, i) => {
          const a = (i * 5 * Math.PI) / 180;
          return (
            <Line
              key={i}
              points={[
                new Vector3(0, 0, 0),
                new Vector3(0.5 * Math.cos(a), 0.5 * Math.sin(a), 0)
              ]}
              color="#feca57"
              lineWidth={1}
            />
          );
        })}
      </group>

      {/* Angle point on circle */}
      <mesh position={[anglePoint.x, anglePoint.y, 0]}>
        <sphereGeometry args={[0.08]} />
        <meshStandardMaterial color="#ff6b6b" emissive="#ff6b6b" emissiveIntensity={0.5} />
      </mesh>

      {/* Sin line (vertical) */}
      <Line 
        points={[
          new Vector3(anglePoint.x * radius, 0, 0),
          new Vector3(anglePoint.x * radius, anglePoint.y * radius, 0)
        ]} 
        color="#96ceb4" 
        lineWidth={3}
      />
      <Text 
        position={[anglePoint.x * radius + 0.3, anglePoint.y * radius / 2, 0]} 
        fontSize={0.2} 
        color="#96ceb4"
      >
        sin = {trigValues.sin.toFixed(3)}
      </Text>

      {/* Cos line (horizontal) */}
      <Line 
        points={[
          new Vector3(0, 0, 0),
          new Vector3(anglePoint.x * radius, 0, 0)
        ]} 
        color="#45b7d1" 
        lineWidth={3}
      />
      <Text 
        position={[anglePoint.x * radius / 2, -0.3, 0]} 
        fontSize={0.2} 
        color="#45b7d1"
        anchorX="center"
      >
        cos = {trigValues.cos.toFixed(3)}
      </Text>

      {/* Hypotenuse */}
      <Line 
        points={[
          new Vector3(0, 0, 0),
          new Vector3(anglePoint.x * radius, anglePoint.y * radius, 0)
        ]} 
        color="#feca57" 
        lineWidth={3}
      />
      <Text 
        position={[anglePoint.x * radius / 2 - 0.3, anglePoint.y * radius / 2 + 0.3, 0]} 
        fontSize={0.2} 
        color="#feca57"
      >
        r = {radius}
      </Text>

      {/* Angle label */}
      <Text position={[0.8, 0.2, 0]} fontSize={0.2} color="#feca57">
        {angle}°
      </Text>

      {/* Trigonometric Functions Panel */}
      <group position={[6, 2, 0]}>
        <Box args={[4, 8, 0.1]}>
          <meshBasicMaterial color="#000000" transparent opacity={0.8} />
        </Box>
        
        <Text position={[0, 3.5, 0.1]} fontSize={0.25} color="#4ecdc4" anchorX="center">
          Trigonometric Functions
        </Text>
        
        <Text position={[0, 3, 0.1]} fontSize={0.2} color="#ff6b6b" anchorX="center">
          Primary Functions
        </Text>
        <Text position={[0, 2.7, 0.1]} fontSize={0.15} color="#96ceb4" anchorX="center">
          sin({angle}°) = {trigValues.sin.toFixed(4)}
        </Text>
        <Text position={[0, 2.4, 0.1]} fontSize={0.15} color="#45b7d1" anchorX="center">
          cos({angle}°) = {trigValues.cos.toFixed(4)}
        </Text>
        <Text position={[0, 2.1, 0.1]} fontSize={0.15} color="#feca57" anchorX="center">
          tan({angle}°) = {Math.abs(trigValues.tan) > 100 ? '∞' : trigValues.tan.toFixed(4)}
        </Text>
        
        <Text position={[0, 1.7, 0.1]} fontSize={0.2} color="#ff9ff3" anchorX="center">
          Reciprocal Functions
        </Text>
        <Text position={[0, 1.4, 0.1]} fontSize={0.15} color="white" anchorX="center">
          csc({angle}°) = {Math.abs(trigValues.csc) > 100 ? '∞' : trigValues.csc.toFixed(4)}
        </Text>
        <Text position={[0, 1.1, 0.1]} fontSize={0.15} color="white" anchorX="center">
          sec({angle}°) = {Math.abs(trigValues.sec) > 100 ? '∞' : trigValues.sec.toFixed(4)}
        </Text>
        <Text position={[0, 0.8, 0.1]} fontSize={0.15} color="white" anchorX="center">
          cot({angle}°) = {Math.abs(trigValues.cot) > 100 ? '∞' : trigValues.cot.toFixed(4)}
        </Text>
        
        <Text position={[0, 0.4, 0.1]} fontSize={0.2} color="#96ceb4" anchorX="center">
          Definitions
        </Text>
        <Text position={[0, 0.1, 0.1]} fontSize={0.12} color="white" anchorX="center">
          sin θ = opposite / hypotenuse
        </Text>
        <Text position={[0, -0.1, 0.1]} fontSize={0.12} color="white" anchorX="center">
          cos θ = adjacent / hypotenuse
        </Text>
        <Text position={[0, -0.3, 0.1]} fontSize={0.12} color="white" anchorX="center">
          tan θ = opposite / adjacent
        </Text>
        
        <Text position={[0, -0.7, 0.1]} fontSize={0.2} color="#feca57" anchorX="center">
          Identities
        </Text>
        <Text position={[0, -1, 0.1]} fontSize={0.12} color="white" anchorX="center">
          sin²θ + cos²θ = 1
        </Text>
        <Text position={[0, -1.2, 0.1]} fontSize={0.12} color="white" anchorX="center">
          Verification: {(trigValues.sin * trigValues.sin + trigValues.cos * trigValues.cos).toFixed(4)}
        </Text>
        <Text position={[0, -1.4, 0.1]} fontSize={0.12} color="white" anchorX="center">
          tan θ = sin θ / cos θ
        </Text>
        <Text position={[0, -1.6, 0.1]} fontSize={0.12} color="white" anchorX="center">
          1 + tan²θ = sec²θ
        </Text>
        <Text position={[0, -1.8, 0.1]} fontSize={0.12} color="white" anchorX="center">
          1 + cot²θ = csc²θ
        </Text>
        
        <Text position={[0, -2.2, 0.1]} fontSize={0.2} color="#45b7d1" anchorX="center">
          Special Angles
        </Text>
        <Text position={[0, -2.5, 0.1]} fontSize={0.1} color="white" anchorX="center">
          0°: sin=0, cos=1, tan=0
        </Text>
        <Text position={[0, -2.7, 0.1]} fontSize={0.1} color="white" anchorX="center">
          30°: sin=1/2, cos=√3/2, tan=1/√3
        </Text>
        <Text position={[0, -2.9, 0.1]} fontSize={0.1} color="white" anchorX="center">
          45°: sin=1/√2, cos=1/√2, tan=1
        </Text>
        <Text position={[0, -3.1, 0.1]} fontSize={0.1} color="white" anchorX="center">
          60°: sin=√3/2, cos=1/2, tan=√3
        </Text>
        <Text position={[0, -3.3, 0.1]} fontSize={0.1} color="white" anchorX="center">
          90°: sin=1, cos=0, tan=∞
        </Text>
      </group>

      {/* Interactive Controls */}
      {mode === 'free' && (
        <group position={[-6, 0, 0]}>
          <Box args={[3, 6, 0.1]}>
            <meshBasicMaterial color="#000000" transparent opacity={0.8} />
          </Box>
          
          <Text position={[0, 2.5, 0.1]} fontSize={0.2} color="white" anchorX="center">
            Angle Controls
          </Text>
          
          <Text position={[0, 2, 0.1]} fontSize={0.15} color="#feca57" anchorX="center">
            Angle (degrees)
          </Text>
          <Box
            args={[0.3, 0.3, 0.1]}
            position={[0, 1.6, 0.1]}
            onClick={() => setAngle(prev => (prev + 15) % 360)}
          >
            <meshStandardMaterial color="#feca57" />
          </Box>
          <Text position={[0.5, 1.6, 0.1]} fontSize={0.15} color="white">
            {angle}°
          </Text>
          
          <Text position={[0, 1, 0.1]} fontSize={0.15} color="#ff6b6b" anchorX="center">
            Triangle Scale
          </Text>
          <Box
            args={[0.3, 0.3, 0.1]}
            position={[0, 0.6, 0.1]}
            onClick={() => setRadius(prev => prev >= 4 ? 1 : prev + 0.5)}
          >
            <meshStandardMaterial color="#ff6b6b" />
          </Box>
          <Text position={[0.5, 0.6, 0.1]} fontSize={0.15} color="white">
            {radius}
          </Text>
          
          <Box
            args={[2, 0.3, 0.1]}
            position={[0, 0, 0.1]}
            onClick={() => setShowUnitCircle(!showUnitCircle)}
          >
            <meshStandardMaterial color={showUnitCircle ? "#4ecdc4" : "#333333"} />
          </Box>
          <Text position={[0, 0, 0.15]} fontSize={0.12} color="white" anchorX="center">
            Unit Circle
          </Text>
          
          {/* Quick angle buttons */}
          <Text position={[0, -0.5, 0.1]} fontSize={0.15} color="white" anchorX="center">
            Quick Angles
          </Text>
          {[0, 30, 45, 60, 90].map((quickAngle, index) => (
            <Box
              key={quickAngle}
              args={[0.4, 0.25, 0.1]}
              position={[-1 + index * 0.5, -1, 0.1]}
              onClick={() => setAngle(quickAngle)}
            >
              <meshStandardMaterial color={angle === quickAngle ? "#feca57" : "#333333"} />
              <Text position={[0, 0, 0.1]} fontSize={0.1} color="white" anchorX="center">
                {quickAngle}°
              </Text>
            </Box>
          ))}
        </group>
      )}

      {/* Real-world Applications */}
      <group position={[0, -5, 0]}>
        <Text fontSize={0.2} color="#96ceb4" anchorX="center">
          Real-world Applications
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -0.3, 0]}>
          • Navigation and GPS systems
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -0.6, 0]}>
          • Architecture: roof angles, ramp slopes
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -0.9, 0]}>
          • Engineering: force analysis, wave patterns
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -1.2, 0]}>
          • Astronomy: satellite tracking, celestial navigation
        </Text>
      </group>
    </group>
  );
};

export default Trigonometry;