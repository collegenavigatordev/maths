import React, { useState, useMemo } from 'react';
import { Text, Box, Sphere } from '@react-three/drei';

interface ArithmeticProgressionsProps {
  mode: 'guided' | 'free';
}

const ArithmeticProgressions: React.FC<ArithmeticProgressionsProps> = ({ mode }) => {
  const [firstTerm, setFirstTerm] = useState(2);
  const [commonDiff, setCommonDiff] = useState(3);
  const [numTerms, setNumTerms] = useState(10);

  // Generate AP terms
  const apTerms = useMemo(() => {
    const terms = [];
    for (let n = 1; n <= numTerms; n++) {
      const term = firstTerm + (n - 1) * commonDiff;
      terms.push({ n, term, value: term });
    }
    return terms;
  }, [firstTerm, commonDiff, numTerms]);

  // Calculate sum
  const sum = useMemo(() => {
    return (numTerms / 2) * (2 * firstTerm + (numTerms - 1) * commonDiff);
  }, [firstTerm, commonDiff, numTerms]);

  return (
    <group>
      {/* AP Visualization as ascending steps */}
      <group position={[0, 0, 0]}>
        {apTerms.map((term, index) => (
          <group key={index} position={[index * 1.2 - 6, term.value * 0.3, 0]}>
            {/* Term block */}
            <Box args={[0.8, Math.abs(term.value * 0.1) + 0.2, 0.3]}>
              <meshStandardMaterial 
                color={`hsl(${200 + index * 15}, 70%, 60%)`}
                emissive={`hsl(${200 + index * 15}, 70%, 20%)`}
                emissiveIntensity={0.2}
              />
            </Box>
            
            {/* Term value */}
            <Text 
              position={[0, Math.abs(term.value * 0.1) + 0.5, 0.2]} 
              fontSize={0.2} 
              color="white" 
              anchorX="center"
            >
              a{term.n} = {term.term}
            </Text>
            
            {/* Position indicator */}
            <Text 
              position={[0, -0.5, 0.2]} 
              fontSize={0.15} 
              color="#888888" 
              anchorX="center"
            >
              n = {term.n}
            </Text>
          </group>
        ))}
      </group>

      {/* Common difference visualization */}
      <group position={[0, -3, 0]}>
        {apTerms.slice(0, -1).map((term, index) => (
          <group key={index} position={[index * 1.2 - 5.4, 0, 0]}>
            <Box args={[0.8, 0.2, 0.1]} position={[0.6, 0, 0]}>
              <meshStandardMaterial color="#feca57" />
            </Box>
            <Text 
              position={[0.6, 0.3, 0.1]} 
              fontSize={0.15} 
              color="#feca57" 
              anchorX="center"
            >
              +{commonDiff}
            </Text>
          </group>
        ))}
        
        <Text position={[0, -0.8, 0]} fontSize={0.2} color="#feca57" anchorX="center">
          Common Difference (d) = {commonDiff}
        </Text>
      </group>

      {/* Formula Panel */}
      <group position={[8, 2, 0]}>
        <Box args={[4, 8, 0.1]}>
          <meshBasicMaterial color="#000000" transparent opacity={0.8} />
        </Box>
        
        <Text position={[0, 3.5, 0.1]} fontSize={0.25} color="#4ecdc4" anchorX="center">
          AP Formulas
        </Text>
        
        <Text position={[0, 3, 0.1]} fontSize={0.2} color="#ff6b6b" anchorX="center">
          General Term
        </Text>
        <Text position={[0, 2.7, 0.1]} fontSize={0.15} color="white" anchorX="center">
          aₙ = a + (n-1)d
        </Text>
        <Text position={[0, 2.4, 0.1]} fontSize={0.12} color="#96ceb4" anchorX="center">
          a = {firstTerm}, d = {commonDiff}
        </Text>
        
        <Text position={[0, 2, 0.1]} fontSize={0.2} color="#feca57" anchorX="center">
          Sum Formula
        </Text>
        <Text position={[0, 1.7, 0.1]} fontSize={0.15} color="white" anchorX="center">
          Sₙ = n/2[2a + (n-1)d]
        </Text>
        <Text position={[0, 1.4, 0.1]} fontSize={0.15} color="white" anchorX="center">
          or Sₙ = n/2(first + last)
        </Text>
        
        <Text position={[0, 1, 0.1]} fontSize={0.2} color="#96ceb4" anchorX="center">
          Current Values
        </Text>
        <Text position={[0, 0.7, 0.1]} fontSize={0.15} color="white" anchorX="center">
          First term (a) = {firstTerm}
        </Text>
        <Text position={[0, 0.4, 0.1]} fontSize={0.15} color="white" anchorX="center">
          Common diff (d) = {commonDiff}
        </Text>
        <Text position={[0, 0.1, 0.1]} fontSize={0.15} color="white" anchorX="center">
          Number of terms (n) = {numTerms}
        </Text>
        
        <Text position={[0, -0.3, 0.1]} fontSize={0.2} color="#feca57" anchorX="center">
          Results
        </Text>
        <Text position={[0, -0.6, 0.1]} fontSize={0.15} color="#feca57" anchorX="center">
          Last term = {apTerms[apTerms.length - 1]?.term}
        </Text>
        <Text position={[0, -0.9, 0.1]} fontSize={0.15} color="#feca57" anchorX="center">
          Sum = {sum}
        </Text>
        
        <Text position={[0, -1.3, 0.1]} fontSize={0.2} color="#ff9ff3" anchorX="center">
          Properties
        </Text>
        <Text position={[0, -1.6, 0.1]} fontSize={0.12} color="white" anchorX="center">
          • Each term differs by constant d
        </Text>
        <Text position={[0, -1.8, 0.1]} fontSize={0.12} color="white" anchorX="center">
          • Forms a straight line when plotted
        </Text>
        <Text position={[0, -2, 0.1]} fontSize={0.12} color="white" anchorX="center">
          • Middle term = (first + last)/2
        </Text>
        
        <Text position={[0, -2.4, 0.1]} fontSize={0.2} color="#96ceb4" anchorX="center">
          Arithmetic Mean
        </Text>
        <Text position={[0, -2.7, 0.1]} fontSize={0.12} color="white" anchorX="center">
          If a, b, c are in AP
        </Text>
        <Text position={[0, -2.9, 0.1]} fontSize={0.12} color="white" anchorX="center">
          then b = (a + c)/2
        </Text>
      </group>

      {/* Interactive Controls */}
      {mode === 'free' && (
        <group position={[-8, 0, 0]}>
          <Box args={[3, 6, 0.1]}>
            <meshBasicMaterial color="#000000" transparent opacity={0.8} />
          </Box>
          
          <Text position={[0, 2.5, 0.1]} fontSize={0.2} color="white" anchorX="center">
            AP Controls
          </Text>
          
          <Text position={[0, 2, 0.1]} fontSize={0.15} color="#ff6b6b" anchorX="center">
            First Term (a)
          </Text>
          <Box
            args={[0.3, 0.3, 0.1]}
            position={[0, 1.6, 0.1]}
            onClick={() => setFirstTerm(prev => prev + 1)}
          >
            <meshStandardMaterial color="#ff6b6b" />
          </Box>
          <Text position={[0.5, 1.6, 0.1]} fontSize={0.15} color="white">
            {firstTerm}
          </Text>
          
          <Text position={[0, 1, 0.1]} fontSize={0.15} color="#feca57" anchorX="center">
            Common Difference (d)
          </Text>
          <Box
            args={[0.3, 0.3, 0.1]}
            position={[0, 0.6, 0.1]}
            onClick={() => setCommonDiff(prev => prev === 5 ? -5 : prev + 1)}
          >
            <meshStandardMaterial color="#feca57" />
          </Box>
          <Text position={[0.5, 0.6, 0.1]} fontSize={0.15} color="white">
            {commonDiff}
          </Text>
          
          <Text position={[0, 0, 0.1]} fontSize={0.15} color="#96ceb4" anchorX="center">
            Number of Terms (n)
          </Text>
          <Box
            args={[0.3, 0.3, 0.1]}
            position={[0, -0.4, 0.1]}
            onClick={() => setNumTerms(prev => prev >= 15 ? 5 : prev + 1)}
          >
            <meshStandardMaterial color="#96ceb4" />
          </Box>
          <Text position={[0.5, -0.4, 0.1]} fontSize={0.15} color="white">
            {numTerms}
          </Text>
        </group>
      )}

      {/* Real-world Applications */}
      <group position={[0, -5, 0]}>
        <Text fontSize={0.2} color="#96ceb4" anchorX="center">
          Real-world Applications
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -0.3, 0]}>
          • Salary increments: 30000, 32000, 34000, ...
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -0.6, 0]}>
          • Seating arrangements: Row 1: 20 seats, Row 2: 22 seats, ...
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -0.9, 0]}>
          • Time intervals: 5min, 10min, 15min, 20min, ...
        </Text>
      </group>

      {/* Sequence Pattern Visualization */}
      <group position={[0, 4, 0]}>
        <Text fontSize={0.3} color="#4ecdc4" anchorX="center">
          AP: {firstTerm}, {firstTerm + commonDiff}, {firstTerm + 2*commonDiff}, {firstTerm + 3*commonDiff}, ...
        </Text>
        
        {/* Visual pattern with connecting lines */}
        {apTerms.slice(0, 8).map((term, index) => (
          <group key={index} position={[index * 1.5 - 5.25, -1, 0]}>
            <Sphere args={[0.15]}>
              <meshStandardMaterial 
                color={`hsl(${200 + index * 20}, 70%, 60%)`}
                emissive={`hsl(${200 + index * 20}, 70%, 30%)`}
                emissiveIntensity={0.3}
              />
            </Sphere>
            
            {index < 7 && (
              <Box args={[1.2, 0.05, 0.05]} position={[0.75, 0, 0]}>
                <meshStandardMaterial color="#666666" />
              </Box>
            )}
          </group>
        ))}
      </group>
    </group>
  );
};

export default ArithmeticProgressions;