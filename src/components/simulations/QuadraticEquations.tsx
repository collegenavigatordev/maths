import React, { useState, useMemo } from 'react';
import { Line, Text, Box, Sphere } from '@react-three/drei';
import { Vector3 } from 'three';

interface QuadraticEquationsProps {
  mode: 'guided' | 'free';
}

const QuadraticEquations: React.FC<QuadraticEquationsProps> = ({ mode }) => {
  const [coefficients, setCoefficients] = useState({ a: 1, b: -4, c: 3 });
  const [showRoots, setShowRoots] = useState(true);
  const [showVertex, setShowVertex] = useState(true);

  // Calculate discriminant and roots
  const { discriminant, roots, vertex, axisOfSymmetry } = useMemo(() => {
    const { a, b, c } = coefficients;
    const discriminant = b * b - 4 * a * c;
    
    let roots = [];
    if (discriminant >= 0) {
      const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
      roots = [root1, root2];
    }
    
    const vertexX = -b / (2 * a);
    const vertexY = a * vertexX * vertexX + b * vertexX + c;
    const vertex = { x: vertexX, y: vertexY };
    
    return { discriminant, roots, vertex, axisOfSymmetry: vertexX };
  }, [coefficients]);

  // Generate parabola points
  const parabolaPoints = useMemo(() => {
    const points = [];
    for (let x = -6; x <= 6; x += 0.1) {
      const y = coefficients.a * x * x + coefficients.b * x + coefficients.c;
      if (y >= -8 && y <= 8) {
        points.push(new Vector3(x, y, 0));
      }
    }
    return points;
  }, [coefficients]);

  return (
    <group>
      {/* Coordinate System */}
      <Line points={[new Vector3(-7, 0, 0), new Vector3(7, 0, 0)]} color="#ffffff" lineWidth={2} />
      <Line points={[new Vector3(0, -8, 0), new Vector3(0, 8, 0)]} color="#ffffff" lineWidth={2} />
      
      {/* Grid */}
      {[-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6].map(i => (
        <React.Fragment key={i}>
          <Line 
            points={[new Vector3(i, -8, 0), new Vector3(i, 8, 0)]} 
            color="#333333" 
            lineWidth={0.5}
          />
          <Text position={[i, -0.3, 0]} fontSize={0.15} color="#888888">{i}</Text>
        </React.Fragment>
      ))}
      
      {[-7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7].map(i => (
        <React.Fragment key={`h${i}`}>
          <Line 
            points={[new Vector3(-7, i, 0), new Vector3(7, i, 0)]} 
            color="#333333" 
            lineWidth={0.5}
          />
          <Text position={[-0.3, i, 0]} fontSize={0.15} color="#888888">{i}</Text>
        </React.Fragment>
      ))}

      {/* Parabola */}
      <Line points={parabolaPoints} color="#4ecdc4" lineWidth={4} />

      {/* Roots */}
      {showRoots && roots.map((root, index) => (
        <group key={index} position={[root, 0, 0]}>
          <Sphere args={[0.1]}>
            <meshStandardMaterial color="#ff6b6b" emissive="#ff6b6b" emissiveIntensity={0.5} />
          </Sphere>
          <Text position={[0, -0.5, 0]} fontSize={0.2} color="#ff6b6b" anchorX="center">
            x = {root.toFixed(2)}
          </Text>
        </group>
      ))}

      {/* Vertex */}
      {showVertex && (
        <group position={[vertex.x, vertex.y, 0]}>
          <Sphere args={[0.12]}>
            <meshStandardMaterial color="#feca57" emissive="#feca57" emissiveIntensity={0.5} />
          </Sphere>
          <Text position={[0.5, 0.5, 0]} fontSize={0.2} color="#feca57">
            Vertex ({vertex.x.toFixed(2)}, {vertex.y.toFixed(2)})
          </Text>
        </group>
      )}

      {/* Axis of Symmetry */}
      <Line 
        points={[new Vector3(axisOfSymmetry, -8, 0), new Vector3(axisOfSymmetry, 8, 0)]} 
        color="#96ceb4" 
        lineWidth={1}
        transparent
        opacity={0.5}
      />

      {/* Equation Display */}
      <group position={[0, 7, 0]}>
        <Text fontSize={0.4} color="#4ecdc4" anchorX="center">
          f(x) = {coefficients.a}x² + {coefficients.b}x + {coefficients.c}
        </Text>
      </group>

      {/* Properties Panel */}
      <group position={[8, 2, 0]}>
        <Box args={[4, 8, 0.1]}>
          <meshBasicMaterial color="#000000" transparent opacity={0.8} />
        </Box>
        
        <Text position={[0, 3.5, 0.1]} fontSize={0.25} color="#4ecdc4" anchorX="center">
          Quadratic Properties
        </Text>
        
        <Text position={[0, 3, 0.1]} fontSize={0.2} color="#ff6b6b" anchorX="center">
          Standard Form
        </Text>
        <Text position={[0, 2.7, 0.1]} fontSize={0.15} color="white" anchorX="center">
          ax² + bx + c = 0
        </Text>
        
        <Text position={[0, 2.3, 0.1]} fontSize={0.2} color="#feca57" anchorX="center">
          Discriminant
        </Text>
        <Text position={[0, 2, 0.1]} fontSize={0.15} color="white" anchorX="center">
          Δ = b² - 4ac = {discriminant.toFixed(2)}
        </Text>
        
        <Text position={[0, 1.6, 0.1]} fontSize={0.15} color="#96ceb4" anchorX="center">
          {discriminant > 0 ? 'Two real roots' : 
           discriminant === 0 ? 'One real root' : 'No real roots'}
        </Text>
        
        <Text position={[0, 1.2, 0.1]} fontSize={0.2} color="#feca57" anchorX="center">
          Vertex Form
        </Text>
        <Text position={[0, 0.9, 0.1]} fontSize={0.12} color="white" anchorX="center">
          f(x) = a(x - h)² + k
        </Text>
        <Text position={[0, 0.6, 0.1]} fontSize={0.12} color="white" anchorX="center">
          h = {vertex.x.toFixed(2)}, k = {vertex.y.toFixed(2)}
        </Text>
        
        <Text position={[0, 0.2, 0.1]} fontSize={0.2} color="#96ceb4" anchorX="center">
          Factored Form
        </Text>
        {roots.length === 2 && (
          <Text position={[0, -0.1, 0.1]} fontSize={0.12} color="white" anchorX="center">
            f(x) = {coefficients.a}(x - {roots[0].toFixed(2)})(x - {roots[1].toFixed(2)})
          </Text>
        )}
        
        <Text position={[0, -0.5, 0.1]} fontSize={0.2} color="#ff9ff3" anchorX="center">
          Solution Methods
        </Text>
        <Text position={[0, -0.8, 0.1]} fontSize={0.12} color="white" anchorX="center">
          • Factoring
        </Text>
        <Text position={[0, -1, 0.1]} fontSize={0.12} color="white" anchorX="center">
          • Quadratic Formula
        </Text>
        <Text position={[0, -1.2, 0.1]} fontSize={0.12} color="white" anchorX="center">
          • Completing the Square
        </Text>
        <Text position={[0, -1.4, 0.1]} fontSize={0.12} color="white" anchorX="center">
          • Graphing
        </Text>
        
        {roots.length > 0 && (
          <>
            <Text position={[0, -1.8, 0.1]} fontSize={0.2} color="#feca57" anchorX="center">
              Quadratic Formula
            </Text>
            <Text position={[0, -2.1, 0.1]} fontSize={0.1} color="white" anchorX="center">
              x = (-b ± √(b² - 4ac)) / 2a
            </Text>
            <Text position={[0, -2.4, 0.1]} fontSize={0.12} color="#feca57" anchorX="center">
              x₁ = {roots[0]?.toFixed(3)}, x₂ = {roots[1]?.toFixed(3)}
            </Text>
          </>
        )}
      </group>

      {/* Interactive Controls */}
      {mode === 'free' && (
        <group position={[-8, 0, 0]}>
          <Box args={[3, 6, 0.1]}>
            <meshBasicMaterial color="#000000" transparent opacity={0.8} />
          </Box>
          
          <Text position={[0, 2.5, 0.1]} fontSize={0.2} color="white" anchorX="center">
            Coefficient Controls
          </Text>
          
          {['a', 'b', 'c'].map((coef, index) => (
            <group key={coef} position={[0, 1.5 - index * 0.8, 0]}>
              <Text position={[-1, 0, 0.1]} fontSize={0.2} color="#feca57">
                {coef}:
              </Text>
              <Box
                args={[0.2, 0.2, 0.1]}
                position={[coefficients[coef as keyof typeof coefficients] * 0.2, 0, 0.1]}
                onClick={() => {
                  const current = coefficients[coef as keyof typeof coefficients];
                  const newVal = current + 0.5;
                  setCoefficients(prev => ({ ...prev, [coef]: newVal > 5 ? -5 : newVal }));
                }}
              >
                <meshStandardMaterial color="#ff6b6b" />
              </Box>
              <Line 
                points={[new Vector3(-1, 0, 0), new Vector3(1, 0, 0)]} 
                color="#666666" 
              />
              <Text position={[1.2, 0, 0.1]} fontSize={0.15} color="white">
                {coefficients[coef as keyof typeof coefficients]}
              </Text>
            </group>
          ))}
        </group>
      )}

      {/* Real-world Application */}
      <group position={[0, -6, 0]}>
        <Text fontSize={0.2} color="#96ceb4" anchorX="center">
          Real-world: Projectile Motion
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -0.3, 0]}>
          Height h(t) = -4.9t² + v₀t + h₀
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -0.6, 0]}>
          Maximum height at vertex, hits ground at roots
        </Text>
      </group>
    </group>
  );
};

export default QuadraticEquations;