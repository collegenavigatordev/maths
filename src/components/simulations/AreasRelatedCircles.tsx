import React, { useState, useMemo } from 'react';
import { Line, Text, Box } from '@react-three/drei';
import { Vector3 } from 'three';

interface AreasRelatedCirclesProps {
  mode: 'guided' | 'free';
}

const AreasRelatedCircles: React.FC<AreasRelatedCirclesProps> = ({ mode }) => {
  const [radius, setRadius] = useState(2);
  const [sectorAngle, setSectorAngle] = useState(90); // degrees
  const [showSector, setShowSector] = useState(true);
  const [showSegment, setShowSegment] = useState(true);

  // Generate circle points
  const circlePoints = useMemo(() => {
    const points = [];
    for (let angle = 0; angle <= 2 * Math.PI; angle += 0.1) {
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      points.push(new Vector3(x, y, 0));
    }
    return points;
  }, [radius]);

  // Generate sector arc
  const sectorPoints = useMemo(() => {
    const points = [new Vector3(0, 0, 0)]; // Start from center
    const angleRad = (sectorAngle * Math.PI) / 180;
    
    for (let angle = 0; angle <= angleRad; angle += 0.1) {
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      points.push(new Vector3(x, y, 0));
    }
    points.push(new Vector3(0, 0, 0)); // Back to center
    return points;
  }, [radius, sectorAngle]);

  // Generate segment (sector minus triangle)
  const segmentPoints = useMemo(() => {
    const points = [];
    const angleRad = (sectorAngle * Math.PI) / 180;
    
    for (let angle = 0; angle <= angleRad; angle += 0.1) {
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      points.push(new Vector3(x, y, 0));
    }
    return points;
  }, [radius, sectorAngle]);

  // Calculate areas
  const calculations = useMemo(() => {
    const angleRad = (sectorAngle * Math.PI) / 180;
    
    // Circle area
    const circleArea = Math.PI * radius * radius;
    
    // Sector area
    const sectorArea = (angleRad / (2 * Math.PI)) * circleArea;
    
    // Arc length
    const arcLength = radius * angleRad;
    
    // Triangle area (for segment calculation)
    const triangleArea = 0.5 * radius * radius * Math.sin(angleRad);
    
    // Segment area
    const segmentArea = sectorArea - triangleArea;
    
    // Circumference
    const circumference = 2 * Math.PI * radius;
    
    return {
      circleArea,
      sectorArea,
      segmentArea,
      arcLength,
      circumference,
      triangleArea
    };
  }, [radius, sectorAngle]);

  return (
    <group>
      {/* Main Circle */}
      <Line points={circlePoints} color="#4ecdc4" lineWidth={3} />
      
      {/* Center point */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.08]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <Text position={[0.2, 0.2, 0]} fontSize={0.15} color="white">O</Text>

      {/* Radius lines */}
      <Line 
        points={[new Vector3(0, 0, 0), new Vector3(radius, 0, 0)]} 
        color="#feca57" 
        lineWidth={2}
      />
      <Text position={[radius/2, -0.2, 0]} fontSize={0.15} color="#feca57" anchorX="center">
        r = {radius}
      </Text>

      {/* Sector */}
      {showSector && (
        <>
          <Line points={sectorPoints} color="#ff6b6b" lineWidth={2} />
          <Text position={[radius * 0.7, radius * 0.3, 0]} fontSize={0.15} color="#ff6b6b">
            Sector
          </Text>
          
          {/* Angle arc indicator */}
          <group>
            {Array.from({ length: Math.floor(sectorAngle / 10) }, (_, i) => {
              const a = (i * 10 * Math.PI) / 180;
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
          <Text position={[0.8, 0.3, 0]} fontSize={0.15} color="#feca57">
            {sectorAngle}°
          </Text>
        </>
      )}

      {/* Segment */}
      {showSegment && (
        <>
          <Line points={segmentPoints} color="#96ceb4" lineWidth={2} />
          {/* Chord line */}
          <Line 
            points={[
              new Vector3(radius, 0, 0),
              new Vector3(radius * Math.cos((sectorAngle * Math.PI) / 180), radius * Math.sin((sectorAngle * Math.PI) / 180), 0)
            ]} 
            color="#96ceb4" 
            lineWidth={2}
          />
          <Text position={[radius * 0.5, radius * 0.6, 0]} fontSize={0.15} color="#96ceb4">
            Segment
          </Text>
        </>
      )}

      {/* Calculations Panel */}
      <group position={[6, 2, 0]}>
        <Box args={[4, 8, 0.1]}>
          <meshBasicMaterial color="#000000" transparent opacity={0.8} />
        </Box>
        
        <Text position={[0, 3.5, 0.1]} fontSize={0.25} color="#4ecdc4" anchorX="center">
          Areas Related to Circles
        </Text>
        
        <Text position={[0, 3, 0.1]} fontSize={0.2} color="#ff6b6b" anchorX="center">
          Circle Properties
        </Text>
        <Text position={[0, 2.7, 0.1]} fontSize={0.12} color="white" anchorX="center">
          Radius: r = {radius}
        </Text>
        <Text position={[0, 2.5, 0.1]} fontSize={0.12} color="white" anchorX="center">
          Area: πr² = {calculations.circleArea.toFixed(2)}
        </Text>
        <Text position={[0, 2.3, 0.1]} fontSize={0.12} color="white" anchorX="center">
          Circumference: 2πr = {calculations.circumference.toFixed(2)}
        </Text>
        
        <Text position={[0, 1.9, 0.1]} fontSize={0.2} color="#feca57" anchorX="center">
          Sector
        </Text>
        <Text position={[0, 1.6, 0.1]} fontSize={0.12} color="white" anchorX="center">
          Central angle: θ = {sectorAngle}°
        </Text>
        <Text position={[0, 1.4, 0.1]} fontSize={0.12} color="white" anchorX="center">
          Area: (θ/360°) × πr² = {calculations.sectorArea.toFixed(2)}
        </Text>
        <Text position={[0, 1.2, 0.1]} fontSize={0.12} color="white" anchorX="center">
          Arc length: (θ/360°) × 2πr = {calculations.arcLength.toFixed(2)}
        </Text>
        
        <Text position={[0, 0.8, 0.1]} fontSize={0.2} color="#96ceb4" anchorX="center">
          Segment
        </Text>
        <Text position={[0, 0.5, 0.1]} fontSize={0.12} color="white" anchorX="center">
          Area: Sector - Triangle
        </Text>
        <Text position={[0, 0.3, 0.1]} fontSize={0.12} color="white" anchorX="center">
          = {calculations.sectorArea.toFixed(2)} - {calculations.triangleArea.toFixed(2)}
        </Text>
        <Text position={[0, 0.1, 0.1]} fontSize={0.12} color="white" anchorX="center">
          = {calculations.segmentArea.toFixed(2)}
        </Text>
        
        <Text position={[0, -0.3, 0.1]} fontSize={0.2} color="#45b7d1" anchorX="center">
          Formulas
        </Text>
        <Text position={[0, -0.6, 0.1]} fontSize={0.1} color="white" anchorX="center">
          Sector area = (θ/360°) × πr²
        </Text>
        <Text position={[0, -0.8, 0.1]} fontSize={0.1} color="white" anchorX="center">
          Arc length = (θ/360°) × 2πr
        </Text>
        <Text position={[0, -1, 0.1]} fontSize={0.1} color="white" anchorX="center">
          Segment area = Sector area - Triangle area
        </Text>
        <Text position={[0, -1.2, 0.1]} fontSize={0.1} color="white" anchorX="center">
          Triangle area = (1/2)r²sin(θ)
        </Text>
        
        <Text position={[0, -1.6, 0.1]} fontSize={0.2} color="#ff9ff3" anchorX="center">
          Alternative Formulas
        </Text>
        <Text position={[0, -1.9, 0.1]} fontSize={0.1} color="white" anchorX="center">
          Sector area = (1/2)r²θ (θ in radians)
        </Text>
        <Text position={[0, -2.1, 0.1]} fontSize={0.1} color="white" anchorX="center">
          Arc length = rθ (θ in radians)
        </Text>
        
        <Text position={[0, -2.5, 0.1]} fontSize={0.2} color="#feca57" anchorX="center">
          Current Values
        </Text>
        <Text position={[0, -2.8, 0.1]} fontSize={0.1} color="white" anchorX="center">
          θ in radians = {((sectorAngle * Math.PI) / 180).toFixed(3)}
        </Text>
        <Text position={[0, -3, 0.1]} fontSize={0.1} color="white" anchorX="center">
          Sector/Circle ratio = {(calculations.sectorArea / calculations.circleArea).toFixed(3)}
        </Text>
      </group>

      {/* Interactive Controls */}
      {mode === 'free' && (
        <group position={[-6, 0, 0]}>
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
            onClick={() => setRadius(prev => prev >= 4 ? 1 : prev + 0.5)}
          >
            <meshStandardMaterial color="#feca57" />
          </Box>
          <Text position={[0.5, 1.6, 0.1]} fontSize={0.15} color="white">
            {radius}
          </Text>
          
          <Text position={[0, 1, 0.1]} fontSize={0.15} color="#ff6b6b" anchorX="center">
            Sector Angle
          </Text>
          <Box
            args={[0.3, 0.3, 0.1]}
            position={[0, 0.6, 0.1]}
            onClick={() => setSectorAngle(prev => (prev + 30) % 360 || 30)}
          >
            <meshStandardMaterial color="#ff6b6b" />
          </Box>
          <Text position={[0.5, 0.6, 0.1]} fontSize={0.15} color="white">
            {sectorAngle}°
          </Text>
          
          <Box
            args={[2, 0.3, 0.1]}
            position={[0, 0, 0.1]}
            onClick={() => setShowSector(!showSector)}
          >
            <meshStandardMaterial color={showSector ? "#ff6b6b" : "#333333"} />
          </Box>
          <Text position={[0, 0, 0.15]} fontSize={0.12} color="white" anchorX="center">
            Toggle Sector
          </Text>
          
          <Box
            args={[2, 0.3, 0.1]}
            position={[0, -0.5, 0.1]}
            onClick={() => setShowSegment(!showSegment)}
          >
            <meshStandardMaterial color={showSegment ? "#96ceb4" : "#333333"} />
          </Box>
          <Text position={[0, -0.5, 0.15]} fontSize={0.12} color="white" anchorX="center">
            Toggle Segment
          </Text>
          
          <Text position={[0, -1, 0.1]} fontSize={0.15} color="white" anchorX="center">
            Quick Angles
          </Text>
          {[30, 60, 90, 120, 180].map((angle, index) => (
            <Box
              key={angle}
              args={[0.4, 0.25, 0.1]}
              position={[-1 + index * 0.5, -1.4, 0.1]}
              onClick={() => setSectorAngle(angle)}
            >
              <meshStandardMaterial color={sectorAngle === angle ? "#feca57" : "#333333"} />
              <Text position={[0, 0, 0.1]} fontSize={0.08} color="white" anchorX="center">
                {angle}°
              </Text>
            </Box>
          ))}
        </group>
      )}

      {/* Real-world Applications */}
      <group position={[0, -4, 0]}>
        <Text fontSize={0.2} color="#96ceb4" anchorX="center">
          Real-world Applications
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -0.3, 0]}>
          • Pizza slices and pie charts (sectors)
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -0.6, 0]}>
          • Windshield wipers coverage area (segments)
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -0.9, 0]}>
          • Stadium seating and amphitheater design
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -1.2, 0]}>
          • Irrigation systems and sprinkler coverage
        </Text>
      </group>

      {/* Visual Examples */}
      <group position={[0, -6, 0]}>
        <Text fontSize={0.2} color="#feca57" anchorX="center">
          Common Sector Angles
        </Text>
        
        {[
          { angle: 90, name: "Quarter", color: "#ff6b6b" },
          { angle: 180, name: "Semicircle", color: "#4ecdc4" },
          { angle: 120, name: "One-third", color: "#feca57" },
          { angle: 60, name: "One-sixth", color: "#96ceb4" }
        ].map((example, index) => (
          <group key={example.angle} position={[index * 2 - 3, -1, 0]}>
            <Text position={[0, 0.5, 0]} fontSize={0.12} color="white" anchorX="center">
              {example.name}
            </Text>
            <Text position={[0, 0.3, 0]} fontSize={0.1} color={example.color} anchorX="center">
              {example.angle}°
            </Text>
            <Text position={[0, 0.1, 0]} fontSize={0.1} color="white" anchorX="center">
              {((example.angle / 360) * 100).toFixed(1)}%
            </Text>
          </group>
        ))}
      </group>
    </group>
  );
};

export default AreasRelatedCircles;