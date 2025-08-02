import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Box, Sphere } from '@react-three/drei';
import { Vector3 } from 'three';

interface RealNumbersProps {
  mode: 'guided' | 'free';
}

const RealNumbers: React.FC<RealNumbersProps> = ({ mode }) => {
  const [selectedNumber, setSelectedNumber] = useState(Math.PI);
  const [showDecimals, setShowDecimals] = useState(10);
  const spiralRef = useRef();

  // Generate number line
  const numberLinePoints = [];
  for (let i = -10; i <= 10; i++) {
    numberLinePoints.push(i);
  }

  // Generate decimal expansion visualization
  const decimalDigits = selectedNumber.toString().split('.')[1]?.slice(0, showDecimals) || '';

  useFrame((state) => {
    if (spiralRef.current) {
      spiralRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group>
      {/* Number Line */}
      <group position={[0, -2, 0]}>
        <Box args={[20, 0.05, 0.05]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#ffffff" />
        </Box>
        
        {numberLinePoints.map((num) => (
          <group key={num} position={[num * 2, 0, 0]}>
            <Box args={[0.02, 0.3, 0.02]}>
              <meshStandardMaterial color="#4ecdc4" />
            </Box>
            <Text position={[0, -0.4, 0]} fontSize={0.2} color="white" anchorX="center">
              {num}
            </Text>
          </group>
        ))}
      </group>

      {/* Selected Number Visualization */}
      <group position={[0, 1, 0]}>
        <Sphere args={[0.2]} position={[selectedNumber * 2, 0, 0]}>
          <meshStandardMaterial color="#ff6b6b" emissive="#ff6b6b" emissiveIntensity={0.3} />
        </Sphere>
        <Text position={[selectedNumber * 2, 0.5, 0]} fontSize={0.3} color="#ff6b6b" anchorX="center">
          {selectedNumber.toFixed(showDecimals)}
        </Text>
      </group>

      {/* Decimal Expansion Spiral */}
      <group ref={spiralRef} position={[0, 3, 0]}>
        {decimalDigits.split('').map((digit, index) => {
          const angle = (index * Math.PI) / 4;
          const radius = 1 + index * 0.1;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const y = index * 0.1;
          
          return (
            <Text
              key={index}
              position={[x, y, z]}
              fontSize={0.3}
              color="#feca57"
              anchorX="center"
            >
              {digit}
            </Text>
          );
        })}
      </group>

      {/* Classification Panel */}
      <group position={[6, 2, 0]}>
        <Box args={[4, 5, 0.1]}>
          <meshBasicMaterial color="#000000" transparent opacity={0.8} />
        </Box>
        
        <Text position={[0, 2, 0.1]} fontSize={0.3} color="#4ecdc4" anchorX="center">
          Real Number Types
        </Text>
        
        <Text position={[0, 1.5, 0.1]} fontSize={0.2} color="#ff6b6b" anchorX="center">
          Natural Numbers (N)
        </Text>
        <Text position={[0, 1.2, 0.1]} fontSize={0.15} color="white" anchorX="center">
          1, 2, 3, 4, 5, ...
        </Text>
        
        <Text position={[0, 0.8, 0.1]} fontSize={0.2} color="#feca57" anchorX="center">
          Whole Numbers (W)
        </Text>
        <Text position={[0, 0.5, 0.1]} fontSize={0.15} color="white" anchorX="center">
          0, 1, 2, 3, 4, ...
        </Text>
        
        <Text position={[0, 0.1, 0.1]} fontSize={0.2} color="#96ceb4" anchorX="center">
          Integers (Z)
        </Text>
        <Text position={[0, -0.2, 0.1]} fontSize={0.15} color="white" anchorX="center">
          ..., -2, -1, 0, 1, 2, ...
        </Text>
        
        <Text position={[0, -0.6, 0.1]} fontSize={0.2} color="#45b7d1" anchorX="center">
          Rational Numbers (Q)
        </Text>
        <Text position={[0, -0.9, 0.1]} fontSize={0.15} color="white" anchorX="center">
          p/q where p,q ∈ Z, q ≠ 0
        </Text>
        
        <Text position={[0, -1.3, 0.1]} fontSize={0.2} color="#ff9ff3" anchorX="center">
          Irrational Numbers
        </Text>
        <Text position={[0, -1.6, 0.1]} fontSize={0.15} color="white" anchorX="center">
          π, e, √2, √3, ...
        </Text>
      </group>

      {/* Interactive Controls */}
      <group position={[-6, 0, 0]}>
        <Text position={[0, 2, 0]} fontSize={0.25} color="white" anchorX="center">
          Explore Numbers
        </Text>
        
        {[Math.PI, Math.E, Math.sqrt(2), Math.sqrt(3), 22/7, 1.414].map((num, index) => (
          <Box
            key={index}
            args={[1.5, 0.3, 0.1]}
            position={[0, 1.5 - index * 0.4, 0]}
            onClick={() => setSelectedNumber(num)}
          >
            <meshStandardMaterial 
              color={selectedNumber === num ? "#ff6b6b" : "#333333"} 
            />
            <Text position={[0, 0, 0.1]} fontSize={0.15} color="white" anchorX="center">
              {num === Math.PI ? 'π' : num === Math.E ? 'e' : num.toString()}
            </Text>
          </Box>
        ))}
      </group>
    </group>
  );
};

export default RealNumbers;