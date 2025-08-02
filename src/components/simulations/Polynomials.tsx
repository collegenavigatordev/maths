import React, { useState, useMemo } from 'react';
import { Line, Text, Box } from '@react-three/drei';
import { Vector3 } from 'three';

interface PolynomialsProps {
  mode: 'guided' | 'free';
}

const Polynomials: React.FC<PolynomialsProps> = ({ mode }) => {
  const [coefficients, setCoefficients] = useState({ a: 1, b: -2, c: 1 });
  const [degree, setDegree] = useState(2);

  // Generate polynomial curve points
  const curvePoints = useMemo(() => {
    const points = [];
    for (let x = -5; x <= 5; x += 0.1) {
      let y = 0;
      if (degree === 1) {
        y = coefficients.a * x + coefficients.b;
      } else if (degree === 2) {
        y = coefficients.a * x * x + coefficients.b * x + coefficients.c;
      } else if (degree === 3) {
        y = coefficients.a * x * x * x + coefficients.b * x * x + coefficients.c * x + 1;
      }
      
      // Clamp y values for visualization
      y = Math.max(-10, Math.min(10, y));
      points.push(new Vector3(x, y, 0));
    }
    return points;
  }, [coefficients, degree]);

  // Find roots (simplified for quadratic)
  const roots = useMemo(() => {
    if (degree === 2) {
      const discriminant = coefficients.b * coefficients.b - 4 * coefficients.a * coefficients.c;
      if (discriminant >= 0) {
        const root1 = (-coefficients.b + Math.sqrt(discriminant)) / (2 * coefficients.a);
        const root2 = (-coefficients.b - Math.sqrt(discriminant)) / (2 * coefficients.a);
        return [root1, root2].filter(r => r >= -5 && r <= 5);
      }
    }
    return [];
  }, [coefficients, degree]);

  return (
    <group>
      {/* Coordinate System */}
      <Line points={[new Vector3(-6, 0, 0), new Vector3(6, 0, 0)]} color="#666666" />
      <Line points={[new Vector3(0, -6, 0), new Vector3(0, 6, 0)]} color="#666666" />
      
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
          <Text position={[i, -0.3, 0]} fontSize={0.2} color="#888888">{i}</Text>
          <Text position={[-0.3, i, 0]} fontSize={0.2} color="#888888">{i}</Text>
        </React.Fragment>
      ))}

      {/* Polynomial Curve */}
      <Line points={curvePoints} color="#4ecdc4" lineWidth={3} />

      {/* Roots */}
      {roots.map((root, index) => (
        <group key={index} position={[root, 0, 0]}>
          <Box args={[0.1, 0.1, 0.1]}>
            <meshStandardMaterial color="#ff6b6b" />
          </Box>
          <Text position={[0, -0.5, 0]} fontSize={0.2} color="#ff6b6b" anchorX="center">
            x = {root.toFixed(2)}
          </Text>
        </group>
      ))}

      {/* Polynomial Expression */}
      <group position={[0, 5, 0]}>
        <Text fontSize={0.4} color="#feca57" anchorX="center">
          {degree === 1 && `f(x) = ${coefficients.a}x + ${coefficients.b}`}
          {degree === 2 && `f(x) = ${coefficients.a}x² + ${coefficients.b}x + ${coefficients.c}`}
          {degree === 3 && `f(x) = ${coefficients.a}x³ + ${coefficients.b}x² + ${coefficients.c}x + 1`}
        </Text>
      </group>

      {/* Control Panel */}
      <group position={[7, 2, 0]}>
        <Box args={[3, 6, 0.1]}>
          <meshBasicMaterial color="#000000" transparent opacity={0.8} />
        </Box>
        
        <Text position={[0, 2.5, 0.1]} fontSize={0.25} color="#4ecdc4" anchorX="center">
          Polynomial Controls
        </Text>
        
        <Text position={[0, 2, 0.1]} fontSize={0.2} color="white" anchorX="center">
          Degree: {degree}
        </Text>
        
        {[1, 2, 3].map(d => (
          <Box
            key={d}
            args={[0.4, 0.3, 0.1]}
            position={[-0.8 + (d-1) * 0.8, 1.5, 0.1]}
            onClick={() => setDegree(d)}
          >
            <meshStandardMaterial color={degree === d ? "#ff6b6b" : "#333333"} />
            <Text position={[0, 0, 0.1]} fontSize={0.15} color="white" anchorX="center">
              {d}
            </Text>
          </Box>
        ))}
        
        <Text position={[0, 1, 0.1]} fontSize={0.2} color="white" anchorX="center">
          Coefficients
        </Text>
        
        <Text position={[0, 0.6, 0.1]} fontSize={0.15} color="#feca57" anchorX="center">
          a = {coefficients.a}
        </Text>
        <Text position={[0, 0.2, 0.1]} fontSize={0.15} color="#feca57" anchorX="center">
          b = {coefficients.b}
        </Text>
        <Text position={[0, -0.2, 0.1]} fontSize={0.15} color="#feca57" anchorX="center">
          c = {coefficients.c}
        </Text>

        {/* Polynomial Properties */}
        <Text position={[0, -0.8, 0.1]} fontSize={0.2} color="white" anchorX="center">
          Properties
        </Text>
        
        {degree === 2 && (
          <>
            <Text position={[0, -1.2, 0.1]} fontSize={0.12} color="#96ceb4" anchorX="center">
              Discriminant: {(coefficients.b * coefficients.b - 4 * coefficients.a * coefficients.c).toFixed(2)}
            </Text>
            <Text position={[0, -1.4, 0.1]} fontSize={0.12} color="#96ceb4" anchorX="center">
              Vertex: ({(-coefficients.b / (2 * coefficients.a)).toFixed(2)}, 
              {(coefficients.c - coefficients.b * coefficients.b / (4 * coefficients.a)).toFixed(2)})
            </Text>
            <Text position={[0, -1.6, 0.1]} fontSize={0.12} color="#96ceb4" anchorX="center">
              Roots: {roots.length}
            </Text>
          </>
        )}
      </group>

      {/* Interactive Sliders */}
      {mode === 'free' && (
        <group position={[-7, 0, 0]}>
          <Text position={[0, 2, 0]} fontSize={0.2} color="white" anchorX="center">
            Drag to adjust coefficients
          </Text>
          
          {['a', 'b', 'c'].map((coef, index) => (
            <group key={coef} position={[0, 1 - index * 0.8, 0]}>
              <Text position={[-1.5, 0, 0]} fontSize={0.2} color="#feca57">
                {coef}:
              </Text>
              <Box
                args={[0.2, 0.2, 0.2]}
                position={[coefficients[coef as keyof typeof coefficients] * 0.5, 0, 0]}
                onClick={() => {
                  const newCoef = coefficients[coef as keyof typeof coefficients] + 0.5;
                  setCoefficients(prev => ({ ...prev, [coef]: newCoef > 3 ? -3 : newCoef }));
                }}
              >
                <meshStandardMaterial color="#ff6b6b" />
              </Box>
              <Line 
                points={[new Vector3(-1.5, 0, 0), new Vector3(1.5, 0, 0)]} 
                color="#666666" 
              />
            </group>
          ))}
        </group>
      )}
    </group>
  );
};

export default Polynomials;