import React, { useState, useMemo } from 'react';
import { Line, Text, Box, Sphere } from '@react-three/drei';
import { Vector3 } from 'three';

interface LinearEquationsProps {
  mode: 'guided' | 'free';
}

const LinearEquations: React.FC<LinearEquationsProps> = ({ mode }) => {
  const [equation1, setEquation1] = useState({ a1: 2, b1: 3, c1: 6 }); // 2x + 3y = 6
  const [equation2, setEquation2] = useState({ a2: 1, b2: -1, c2: 1 }); // x - y = 1
  const [showSolution, setShowSolution] = useState(true);

  // Calculate intersection point (solution)
  const solution = useMemo(() => {
    const { a1, b1, c1 } = equation1;
    const { a2, b2, c2 } = equation2;
    
    const determinant = a1 * b2 - a2 * b1;
    
    if (Math.abs(determinant) < 0.001) {
      return null; // No unique solution
    }
    
    const x = (c1 * b2 - c2 * b1) / determinant;
    const y = (a1 * c2 - a2 * c1) / determinant;
    
    return { x, y };
  }, [equation1, equation2]);

  // Generate line points for equation 1
  const line1Points = useMemo(() => {
    const points = [];
    for (let x = -5; x <= 5; x += 0.5) {
      if (equation1.b1 !== 0) {
        const y = (equation1.c1 - equation1.a1 * x) / equation1.b1;
        if (y >= -5 && y <= 5) {
          points.push(new Vector3(x, y, 0));
        }
      }
    }
    return points;
  }, [equation1]);

  // Generate line points for equation 2
  const line2Points = useMemo(() => {
    const points = [];
    for (let x = -5; x <= 5; x += 0.5) {
      if (equation2.b2 !== 0) {
        const y = (equation2.c2 - equation2.a2 * x) / equation2.b2;
        if (y >= -5 && y <= 5) {
          points.push(new Vector3(x, y, 0));
        }
      }
    }
    return points;
  }, [equation2]);

  return (
    <group>
      {/* Coordinate System */}
      <Line points={[new Vector3(-6, 0, 0), new Vector3(6, 0, 0)]} color="#ffffff" lineWidth={2} />
      <Line points={[new Vector3(0, -6, 0), new Vector3(0, 6, 0)]} color="#ffffff" lineWidth={2} />
      
      {/* Grid */}
      {[-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].map(i => (
        <React.Fragment key={i}>
          <Line 
            points={[new Vector3(i, -6, 0), new Vector3(i, 6, 0)]} 
            color="#333333" 
            lineWidth={0.5}
          />
          <Line 
            points={[new Vector3(-6, i, 0), new Vector3(6, i, 0)]} 
            color="#333333" 
            lineWidth={0.5}
          />
          <Text position={[i, -0.3, 0]} fontSize={0.15} color="#888888">{i}</Text>
          <Text position={[-0.3, i, 0]} fontSize={0.15} color="#888888">{i}</Text>
        </React.Fragment>
      ))}

      {/* Equation Lines */}
      <Line points={line1Points} color="#ff6b6b" lineWidth={3} />
      <Line points={line2Points} color="#4ecdc4" lineWidth={3} />

      {/* Solution Point */}
      {solution && showSolution && (
        <group position={[solution.x, solution.y, 0]}>
          <Sphere args={[0.15]}>
            <meshStandardMaterial color="#feca57" emissive="#feca57" emissiveIntensity={0.5} />
          </Sphere>
          <Text position={[0.5, 0.5, 0]} fontSize={0.2} color="#feca57">
            ({solution.x.toFixed(2)}, {solution.y.toFixed(2)})
          </Text>
        </group>
      )}

      {/* Equation Labels */}
      <group position={[0, 5.5, 0]}>
        <Text fontSize={0.3} color="#ff6b6b" anchorX="center" position={[0, 0.5, 0]}>
          {equation1.a1}x + {equation1.b1}y = {equation1.c1}
        </Text>
        <Text fontSize={0.3} color="#4ecdc4" anchorX="center" position={[0, 0, 0]}>
          {equation2.a2}x + {equation2.b2}y = {equation2.c2}
        </Text>
      </group>

      {/* Solution Methods Panel */}
      <group position={[7, 1, 0]}>
        <Box args={[4, 7, 0.1]}>
          <meshBasicMaterial color="#000000" transparent opacity={0.8} />
        </Box>
        
        <Text position={[0, 3, 0.1]} fontSize={0.25} color="#4ecdc4" anchorX="center">
          Solution Methods
        </Text>
        
        {/* Substitution Method */}
        <Text position={[0, 2.5, 0.1]} fontSize={0.2} color="#ff6b6b" anchorX="center">
          Substitution Method
        </Text>
        <Text position={[0, 2.2, 0.1]} fontSize={0.12} color="white" anchorX="center">
          From equation 1: y = ({equation1.c1} - {equation1.a1}x)/{equation1.b1}
        </Text>
        <Text position={[0, 1.9, 0.1]} fontSize={0.12} color="white" anchorX="center">
          Substitute in equation 2
        </Text>
        
        {/* Elimination Method */}
        <Text position={[0, 1.4, 0.1]} fontSize={0.2} color="#feca57" anchorX="center">
          Elimination Method
        </Text>
        <Text position={[0, 1.1, 0.1]} fontSize={0.12} color="white" anchorX="center">
          Multiply equations to eliminate variables
        </Text>
        
        {/* Cross Multiplication */}
        <Text position={[0, 0.6, 0.1]} fontSize={0.2} color="#96ceb4" anchorX="center">
          Cross Multiplication
        </Text>
        <Text position={[0, 0.3, 0.1]} fontSize={0.12} color="white" anchorX="center">
          x/(b₁c₂ - b₂c₁) = y/(a₂c₁ - a₁c₂) = 1/(a₁b₂ - a₂b₁)
        </Text>
        
        {/* Solution */}
        {solution && (
          <>
            <Text position={[0, -0.2, 0.1]} fontSize={0.2} color="#feca57" anchorX="center">
              Solution
            </Text>
            <Text position={[0, -0.5, 0.1]} fontSize={0.15} color="#feca57" anchorX="center">
              x = {solution.x.toFixed(3)}
            </Text>
            <Text position={[0, -0.8, 0.1]} fontSize={0.15} color="#feca57" anchorX="center">
              y = {solution.y.toFixed(3)}
            </Text>
          </>
        )}
        
        {/* System Type */}
        <Text position={[0, -1.3, 0.1]} fontSize={0.2} color="white" anchorX="center">
          System Type
        </Text>
        <Text position={[0, -1.6, 0.1]} fontSize={0.12} color="#96ceb4" anchorX="center">
          {solution ? 'Consistent & Independent' : 'Inconsistent or Dependent'}
        </Text>
      </group>

      {/* Interactive Controls */}
      {mode === 'free' && (
        <group position={[-7, 0, 0]}>
          <Box args={[3, 6, 0.1]}>
            <meshBasicMaterial color="#000000" transparent opacity={0.8} />
          </Box>
          
          <Text position={[0, 2.5, 0.1]} fontSize={0.2} color="white" anchorX="center">
            Equation Controls
          </Text>
          
          <Text position={[0, 2, 0.1]} fontSize={0.15} color="#ff6b6b" anchorX="center">
            Equation 1
          </Text>
          
          {['a1', 'b1', 'c1'].map((coef, index) => (
            <group key={coef} position={[0, 1.5 - index * 0.4, 0]}>
              <Text position={[-1, 0, 0.1]} fontSize={0.12} color="white">
                {coef.charAt(0)}₁:
              </Text>
              <Box
                args={[0.15, 0.15, 0.1]}
                position={[0, 0, 0.1]}
                onClick={() => {
                  const current = equation1[coef as keyof typeof equation1];
                  const newVal = current + 1;
                  setEquation1(prev => ({ ...prev, [coef]: newVal > 5 ? -5 : newVal }));
                }}
              >
                <meshStandardMaterial color="#ff6b6b" />
              </Box>
              <Text position={[0.5, 0, 0.1]} fontSize={0.12} color="white">
                {equation1[coef as keyof typeof equation1]}
              </Text>
            </group>
          ))}
          
          <Text position={[0, 0, 0.1]} fontSize={0.15} color="#4ecdc4" anchorX="center">
            Equation 2
          </Text>
          
          {['a2', 'b2', 'c2'].map((coef, index) => (
            <group key={coef} position={[0, -0.5 - index * 0.4, 0]}>
              <Text position={[-1, 0, 0.1]} fontSize={0.12} color="white">
                {coef.charAt(0)}₂:
              </Text>
              <Box
                args={[0.15, 0.15, 0.1]}
                position={[0, 0, 0.1]}
                onClick={() => {
                  const current = equation2[coef as keyof typeof equation2];
                  const newVal = current + 1;
                  setEquation2(prev => ({ ...prev, [coef]: newVal > 5 ? -5 : newVal }));
                }}
              >
                <meshStandardMaterial color="#4ecdc4" />
              </Box>
              <Text position={[0.5, 0, 0.1]} fontSize={0.12} color="white">
                {equation2[coef as keyof typeof equation2]}
              </Text>
            </group>
          ))}
        </group>
      )}

      {/* Real-world Application */}
      <group position={[0, -4, 0]}>
        <Text fontSize={0.2} color="#96ceb4" anchorX="center">
          Real-world Example: Two friends buy fruits
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -0.3, 0]}>
          2 apples + 3 oranges = $6 (Red line)
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -0.6, 0]}>
          1 apple - 1 orange = $1 (Blue line)
        </Text>
        {solution && (
          <Text fontSize={0.15} color="#feca57" anchorX="center" position={[0, -0.9, 0]}>
            Apple = ${solution.x.toFixed(2)}, Orange = ${solution.y.toFixed(2)}
          </Text>
        )}
      </group>
    </group>
  );
};

export default LinearEquations;