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
  const [showSteps, setShowSteps] = useState(false);
  const [solutionMethod, setSolutionMethod] = useState<'substitution' | 'elimination' | 'matrix' | 'graphical'>('graphical');

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
    
    return { x, y, determinant };
  }, [equation1, equation2]);

  // System classification
  const systemType = useMemo(() => {
    const { a1, b1, c1 } = equation1;
    const { a2, b2, c2 } = equation2;
    
    const det = a1 * b2 - a2 * b1;
    const detX = c1 * b2 - c2 * b1;
    const detY = a1 * c2 - a2 * c1;
    
    if (Math.abs(det) > 0.001) {
      return { type: 'consistent_independent', description: 'Unique solution exists' };
    } else if (Math.abs(detX) < 0.001 && Math.abs(detY) < 0.001) {
      return { type: 'consistent_dependent', description: 'Infinitely many solutions' };
    } else {
      return { type: 'inconsistent', description: 'No solution exists' };
    }
  }, [equation1, equation2]);

  // Generate line points for equation 1
  const line1Points = useMemo(() => {
    const points = [];
    for (let x = -8; x <= 8; x += 0.2) {
      if (equation1.b1 !== 0) {
        const y = (equation1.c1 - equation1.a1 * x) / equation1.b1;
        if (y >= -8 && y <= 8) {
          points.push(new Vector3(x, y, 0));
        }
      } else if (equation1.a1 !== 0) {
        // Vertical line
        const xVal = equation1.c1 / equation1.a1;
        for (let y = -8; y <= 8; y += 0.2) {
          points.push(new Vector3(xVal, y, 0));
        }
      }
    }
    return points;
  }, [equation1]);

  // Generate line points for equation 2
  const line2Points = useMemo(() => {
    const points = [];
    for (let x = -8; x <= 8; x += 0.2) {
      if (equation2.b2 !== 0) {
        const y = (equation2.c2 - equation2.a2 * x) / equation2.b2;
        if (y >= -8 && y <= 8) {
          points.push(new Vector3(x, y, 0));
        }
      } else if (equation2.a2 !== 0) {
        // Vertical line
        const xVal = equation2.c2 / equation2.a2;
        for (let y = -8; y <= 8; y += 0.2) {
          points.push(new Vector3(xVal, y, 0));
        }
      }
    }
    return points;
  }, [equation2]);

  // Solution steps for different methods
  const solutionSteps = useMemo(() => {
    const { a1, b1, c1 } = equation1;
    const { a2, b2, c2 } = equation2;
    
    switch (solutionMethod) {
      case 'substitution':
        return [
          `Step 1: Solve equation 1 for y: y = (${c1} - ${a1}x)/${b1}`,
          `Step 2: Substitute into equation 2: ${a2}x + ${b2}((${c1} - ${a1}x)/${b1}) = ${c2}`,
          `Step 3: Simplify: ${a2}x + ${b2 * c1 / b1} - ${(b2 * a1) / b1}x = ${c2}`,
          `Step 4: Combine like terms: ${a2 - (b2 * a1) / b1}x = ${c2 - (b2 * c1) / b1}`,
          `Step 5: Solve for x: x = ${solution?.x.toFixed(3)}`,
          `Step 6: Substitute back: y = ${solution?.y.toFixed(3)}`
        ];
        
      case 'elimination':
        const lcm = Math.abs(b1 * b2) / gcd(Math.abs(b1), Math.abs(b2));
        const mult1 = lcm / Math.abs(b1);
        const mult2 = lcm / Math.abs(b2);
        return [
          `Step 1: Multiply equation 1 by ${mult1}: ${a1 * mult1}x + ${b1 * mult1}y = ${c1 * mult1}`,
          `Step 2: Multiply equation 2 by ${mult2}: ${a2 * mult2}x + ${b2 * mult2}y = ${c2 * mult2}`,
          `Step 3: Subtract equations to eliminate y`,
          `Step 4: Solve for x: x = ${solution?.x.toFixed(3)}`,
          `Step 5: Substitute back: y = ${solution?.y.toFixed(3)}`
        ];
        
      case 'matrix':
        return [
          `Step 1: Write in matrix form: [${a1} ${b1}][x] = [${c1}]`,
          `                              [${a2} ${b2}][y]   [${c2}]`,
          `Step 2: Calculate determinant: Δ = ${a1}×${b2} - ${a2}×${b1} = ${solution?.determinant.toFixed(3)}`,
          `Step 3: Apply Cramer's rule: x = Δₓ/Δ, y = Δᵧ/Δ`,
          `Step 4: x = ${solution?.x.toFixed(3)}, y = ${solution?.y.toFixed(3)}`
        ];
        
      case 'graphical':
        return [
          `Step 1: Graph both equations as lines`,
          `Step 2: Find intersection point`,
          `Step 3: Verify solution in both equations`,
          `Solution: (${solution?.x.toFixed(3)}, ${solution?.y.toFixed(3)})`
        ];
        
      default:
        return [];
    }
  }, [equation1, equation2, solution, solutionMethod]);

  // Helper function for GCD
  function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
  }

  return (
    <group>
      {/* Enhanced Coordinate System */}
      <Line points={[new Vector3(-8, 0, 0), new Vector3(8, 0, 0)]} color="#ffffff" lineWidth={3} />
      <Line points={[new Vector3(0, -8, 0), new Vector3(0, 8, 0)]} color="#ffffff" lineWidth={3} />
      
      {/* Enhanced Grid */}
      {[-7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7].map(i => (
        <React.Fragment key={i}>
          <Line 
            points={[new Vector3(i, -8, 0), new Vector3(i, 8, 0)]} 
            color="#333333" 
            lineWidth={0.5}
          />
          <Line 
            points={[new Vector3(-8, i, 0), new Vector3(8, i, 0)]} 
            color="#333333" 
            lineWidth={0.5}
          />
          <Text position={[i, -0.4, 0]} fontSize={0.15} color="#888888">{i}</Text>
          <Text position={[-0.4, i, 0]} fontSize={0.15} color="#888888">{i}</Text>
        </React.Fragment>
      ))}

      {/* Axis labels */}
      <Text position={[8.2, 0, 0]} fontSize={0.3} color="white">x</Text>
      <Text position={[0, 8.2, 0]} fontSize={0.3} color="white">y</Text>

      {/* Equation Lines */}
      <Line points={line1Points} color="#ff6b6b" lineWidth={4} />
      <Line points={line2Points} color="#4ecdc4" lineWidth={4} />

      {/* Solution Point */}
      {solution && showSolution && systemType.type === 'consistent_independent' && (
        <group position={[solution.x, solution.y, 0]}>
          <Sphere args={[0.2]}>
            <meshStandardMaterial color="#feca57" emissive="#feca57" emissiveIntensity={0.6} />
          </Sphere>
          <Text position={[0.8, 0.8, 0]} fontSize={0.25} color="#feca57">
            ({solution.x.toFixed(2)}, {solution.y.toFixed(2)})
          </Text>
          
          {/* Highlight lines at solution */}
          <Line 
            points={[new Vector3(solution.x, -8, 0), new Vector3(solution.x, 8, 0)]} 
            color="#feca57" 
            lineWidth={1}
            transparent
            opacity={0.3}
          />
          <Line 
            points={[new Vector3(-8, solution.y, 0), new Vector3(8, solution.y, 0)]} 
            color="#feca57" 
            lineWidth={1}
            transparent
            opacity={0.3}
          />
        </group>
      )}

      {/* Intercepts for Line 1 */}
      {equation1.a1 !== 0 && (
        <group position={[equation1.c1 / equation1.a1, 0, 0]}>
          <Sphere args={[0.08]}>
            <meshStandardMaterial color="#ff6b6b" />
          </Sphere>
          <Text position={[0, -0.5, 0]} fontSize={0.12} color="#ff6b6b" anchorX="center">
            x-int: {(equation1.c1 / equation1.a1).toFixed(2)}
          </Text>
        </group>
      )}
      
      {equation1.b1 !== 0 && (
        <group position={[0, equation1.c1 / equation1.b1, 0]}>
          <Sphere args={[0.08]}>
            <meshStandardMaterial color="#ff6b6b" />
          </Sphere>
          <Text position={[-0.8, 0, 0]} fontSize={0.12} color="#ff6b6b">
            y-int: {(equation1.c1 / equation1.b1).toFixed(2)}
          </Text>
        </group>
      )}

      {/* Intercepts for Line 2 */}
      {equation2.a2 !== 0 && (
        <group position={[equation2.c2 / equation2.a2, 0, 0]}>
          <Sphere args={[0.08]}>
            <meshStandardMaterial color="#4ecdc4" />
          </Sphere>
          <Text position={[0, 0.5, 0]} fontSize={0.12} color="#4ecdc4" anchorX="center">
            x-int: {(equation2.c2 / equation2.a2).toFixed(2)}
          </Text>
        </group>
      )}
      
      {equation2.b2 !== 0 && (
        <group position={[0, equation2.c2 / equation2.b2, 0]}>
          <Sphere args={[0.08]}>
            <meshStandardMaterial color="#4ecdc4" />
          </Sphere>
          <Text position={[0.8, 0, 0]} fontSize={0.12} color="#4ecdc4">
            y-int: {(equation2.c2 / equation2.b2).toFixed(2)}
          </Text>
        </group>
      )}

      {/* Equation Labels */}
      <group position={[0, 7.5, 0]}>
        <Text fontSize={0.35} color="#ff6b6b" anchorX="center" position={[0, 0.5, 0]}>
          {equation1.a1}x + {equation1.b1}y = {equation1.c1}
        </Text>
        <Text fontSize={0.35} color="#4ecdc4" anchorX="center" position={[0, 0, 0]}>
          {equation2.a2}x + {equation2.b2}y = {equation2.c2}
        </Text>
        
        <Text fontSize={0.2} color="#feca57" anchorX="center" position={[0, -0.8, 0]}>
          System Type: {systemType.description}
        </Text>
      </group>

      {/* Comprehensive Solution Methods Panel */}
      <group position={[10, 2, 0]}>
        <Box args={[6, 14, 0.1]}>
          <meshBasicMaterial color="#000000" transparent opacity={0.9} />
        </Box>
        
        <Text position={[0, 6.5, 0.1]} fontSize={0.3} color="#4ecdc4" anchorX="center">
          Linear Systems Analysis
        </Text>
        
        {/* System Classification */}
        <Text position={[0, 6, 0.1]} fontSize={0.2} color="#ff6b6b" anchorX="center">
          System Classification
        </Text>
        <Text position={[0, 5.7, 0.1]} fontSize={0.15} color="#feca57" anchorX="center">
          {systemType.description}
        </Text>
        
        {solution && (
          <>
            <Text position={[0, 5.4, 0.1]} fontSize={0.12} color="white" anchorX="center">
              Determinant: Δ = {solution.determinant.toFixed(4)}
            </Text>
            <Text position={[0, 5.2, 0.1]} fontSize={0.12} color="white" anchorX="center">
              Solution: x = {solution.x.toFixed(4)}, y = {solution.y.toFixed(4)}
            </Text>
          </>
        )}
        
        {/* Solution Methods */}
        <Text position={[0, 4.8, 0.1]} fontSize={0.2} color="#96ceb4" anchorX="center">
          Solution Methods
        </Text>
        
        {/* Method Selection */}
        <group position={[0, 4.3, 0]}>
          {['substitution', 'elimination', 'matrix', 'graphical'].map((method, index) => (
            <Box
              key={method}
              args={[1.2, 0.25, 0.1]}
              position={[index * 1.3 - 1.95, 0, 0.1]}
              onClick={() => setSolutionMethod(method as any)}
            >
              <meshStandardMaterial 
                color={solutionMethod === method ? "#feca57" : "#333333"}
              />
              <Text position={[0, 0, 0.1]} fontSize={0.08} color="white" anchorX="center">
                {method.charAt(0).toUpperCase() + method.slice(1)}
              </Text>
            </Box>
          ))}
        </group>
        
        {/* Solution Steps */}
        {showSteps && (
          <group position={[0, 3.5, 0]}>
            <Text position={[0, 0.3, 0.1]} fontSize={0.15} color="#45b7d1" anchorX="center">
              {solutionMethod.charAt(0).toUpperCase() + solutionMethod.slice(1)} Method
            </Text>
            {solutionSteps.map((step, index) => (
              <Text 
                key={index}
                position={[0, 0 - index * 0.25, 0.1]} 
                fontSize={0.1} 
                color="white" 
                anchorX="center"
              >
                {step}
              </Text>
            ))}
          </group>
        )}
        
        {/* Geometric Interpretation */}
        <Text position={[0, 1.5, 0.1]} fontSize={0.2} color="#ff9ff3" anchorX="center">
          Geometric Interpretation
        </Text>
        <Text position={[0, 1.2, 0.1]} fontSize={0.12} color="white" anchorX="center">
          Each equation represents a line in the xy-plane
        </Text>
        <Text position={[0, 1, 0.1]} fontSize={0.12} color="white" anchorX="center">
          Solution is the intersection point(s) of the lines
        </Text>
        
        {systemType.type === 'consistent_independent' && (
          <Text position={[0, 0.8, 0.1]} fontSize={0.12} color="#96ceb4" anchorX="center">
            Lines intersect at exactly one point
          </Text>
        )}
        
        {systemType.type === 'consistent_dependent' && (
          <Text position={[0, 0.8, 0.1]} fontSize={0.12} color="#96ceb4" anchorX="center">
            Lines are identical (infinitely many solutions)
          </Text>
        )}
        
        {systemType.type === 'inconsistent' && (
          <Text position={[0, 0.8, 0.1]} fontSize={0.12} color="#96ceb4" anchorX="center">
            Lines are parallel (no intersection)
          </Text>
        )}
        
        {/* Matrix Form */}
        <Text position={[0, 0.4, 0.1]} fontSize={0.2} color="#45b7d1" anchorX="center">
          Matrix Form: AX = B
        </Text>
        <Text position={[0, 0.1, 0.1]} fontSize={0.12} color="white" anchorX="center">
          A = [{equation1.a1} {equation1.b1}]  X = [x]  B = [{equation1.c1}]
        </Text>
        <Text position={[0, -0.1, 0.1]} fontSize={0.12} color="white" anchorX="center">
              [{equation2.a2} {equation2.b2}]      [y]      [{equation2.c2}]
        </Text>
        
        {/* Cramer's Rule */}
        {solution && (
          <>
            <Text position={[0, -0.5, 0.1]} fontSize={0.2} color="#feca57" anchorX="center">
              Cramer's Rule
            </Text>
            <Text position={[0, -0.8, 0.1]} fontSize={0.12} color="white" anchorX="center">
              x = det(Aₓ)/det(A) = {((equation1.c1 * equation2.b2 - equation2.c2 * equation1.b1) / solution.determinant).toFixed(4)}
            </Text>
            <Text position={[0, -1, 0.1]} fontSize={0.12} color="white" anchorX="center">
              y = det(Aᵧ)/det(A) = {((equation1.a1 * equation2.c2 - equation2.a2 * equation1.c1) / solution.determinant).toFixed(4)}
            </Text>
          </>
        )}
        
        {/* Linear Algebra Concepts */}
        <Text position={[0, -1.4, 0.1]} fontSize={0.2} color="#96ceb4" anchorX="center">
          Key Concepts
        </Text>
        <Text position={[0, -1.7, 0.1]} fontSize={0.1} color="white" anchorX="center">
          • Slope-intercept form: y = mx + b
        </Text>
        <Text position={[0, -1.9, 0.1]} fontSize={0.1} color="white" anchorX="center">
          • Standard form: Ax + By = C
        </Text>
        <Text position={[0, -2.1, 0.1]} fontSize={0.1} color="white" anchorX="center">
          • Point-slope form: y - y₁ = m(x - x₁)
        </Text>
        <Text position={[0, -2.3, 0.1]} fontSize={0.1} color="white" anchorX="center">
          • Parallel lines: same slope, different y-intercepts
        </Text>
        <Text position={[0, -2.5, 0.1]} fontSize={0.1} color="white" anchorX="center">
          • Perpendicular lines: slopes are negative reciprocals
        </Text>
        
        {/* Applications */}
        <Text position={[0, -2.9, 0.1]} fontSize={0.2} color="#ff6b6b" anchorX="center">
          Applications
        </Text>
        <Text position={[0, -3.2, 0.1]} fontSize={0.1} color="white" anchorX="center">
          • Economics: Supply and demand curves
        </Text>
        <Text position={[0, -3.4, 0.1]} fontSize={0.1} color="white" anchorX="center">
          • Physics: Motion problems, force equilibrium
        </Text>
        <Text position={[0, -3.6, 0.1]} fontSize={0.1} color="white" anchorX="center">
          • Engineering: Circuit analysis, optimization
        </Text>
        <Text position={[0, -3.8, 0.1]} fontSize={0.1} color="white" anchorX="center">
          • Business: Break-even analysis, profit models
        </Text>
        
        {/* Advanced Topics */}
        <Text position={[0, -4.2, 0.1]} fontSize={0.2} color="#ff9ff3" anchorX="center">
          Extensions
        </Text>
        <Text position={[0, -4.5, 0.1]} fontSize={0.1} color="white" anchorX="center">
          • Systems with 3+ variables (hyperplanes)
        </Text>
        <Text position={[0, -4.7, 0.1]} fontSize={0.1} color="white" anchorX="center">
          • Linear programming and optimization
        </Text>
        <Text position={[0, -4.9, 0.1]} fontSize={0.1} color="white" anchorX="center">
          • Gaussian elimination for larger systems
        </Text>
        <Text position={[0, -5.1, 0.1]} fontSize={0.1} color="white" anchorX="center">
          • Vector spaces and linear transformations
        </Text>
        
        {/* Verification */}
        {solution && (
          <>
            <Text position={[0, -5.5, 0.1]} fontSize={0.2} color="#45b7d1" anchorX="center">
              Solution Verification
            </Text>
            <Text position={[0, -5.8, 0.1]} fontSize={0.1} color="white" anchorX="center">
              Eq1: {equation1.a1}({solution.x.toFixed(2)}) + {equation1.b1}({solution.y.toFixed(2)}) = {(equation1.a1 * solution.x + equation1.b1 * solution.y).toFixed(2)}
            </Text>
            <Text position={[0, -6, 0.1]} fontSize={0.1} color="white" anchorX="center">
              Eq2: {equation2.a2}({solution.x.toFixed(2)}) + {equation2.b2}({solution.y.toFixed(2)}) = {(equation2.a2 * solution.x + equation2.b2 * solution.y).toFixed(2)}
            </Text>
          </>
        )}
      </group>

      {/* Enhanced Interactive Controls */}
      <group position={[-10, 0, 0]}>
        <Box args={[4, 12, 0.1]}>
          <meshBasicMaterial color="#000000" transparent opacity={0.9} />
        </Box>
        
        <Text position={[0, 5.5, 0.1]} fontSize={0.2} color="white" anchorX="center">
          System Controls
        </Text>
        
        <Text position={[0, 5, 0.1]} fontSize={0.15} color="#ff6b6b" anchorX="center">
          Equation 1: {equation1.a1}x + {equation1.b1}y = {equation1.c1}
        </Text>
        
        {['a1', 'b1', 'c1'].map((coef, index) => (
          <group key={coef} position={[0, 4.5 - index * 0.4, 0]}>
            <Text position={[-1.5, 0, 0.1]} fontSize={0.12} color="white">
              {coef.charAt(0)}₁:
            </Text>
            <Box
              args={[0.2, 0.2, 0.1]}
              position={[-0.5, 0, 0.1]}
              onClick={() => {
                const current = equation1[coef as keyof typeof equation1];
                const newVal = current - 1;
                setEquation1(prev => ({ ...prev, [coef]: newVal < -10 ? 10 : newVal }));
              }}
            >
              <meshStandardMaterial color="#ff6b6b" />
              <Text position={[0, 0, 0.1]} fontSize={0.1} color="white" anchorX="center">-</Text>
            </Box>
            <Text position={[0, 0, 0.1]} fontSize={0.15} color="white" anchorX="center">
              {equation1[coef as keyof typeof equation1]}
            </Text>
            <Box
              args={[0.2, 0.2, 0.1]}
              position={[0.5, 0, 0.1]}
              onClick={() => {
                const current = equation1[coef as keyof typeof equation1];
                const newVal = current + 1;
                setEquation1(prev => ({ ...prev, [coef]: newVal > 10 ? -10 : newVal }));
              }}
            >
              <meshStandardMaterial color="#ff6b6b" />
              <Text position={[0, 0, 0.1]} fontSize={0.1} color="white" anchorX="center">+</Text>
            </Box>
          </group>
        ))}
        
        <Text position={[0, 2.5, 0.1]} fontSize={0.15} color="#4ecdc4" anchorX="center">
          Equation 2: {equation2.a2}x + {equation2.b2}y = {equation2.c2}
        </Text>
        
        {['a2', 'b2', 'c2'].map((coef, index) => (
          <group key={coef} position={[0, 2 - index * 0.4, 0]}>
            <Text position={[-1.5, 0, 0.1]} fontSize={0.12} color="white">
              {coef.charAt(0)}₂:
            </Text>
            <Box
              args={[0.2, 0.2, 0.1]}
              position={[-0.5, 0, 0.1]}
              onClick={() => {
                const current = equation2[coef as keyof typeof equation2];
                const newVal = current - 1;
                setEquation2(prev => ({ ...prev, [coef]: newVal < -10 ? 10 : newVal }));
              }}
            >
              <meshStandardMaterial color="#4ecdc4" />
              <Text position={[0, 0, 0.1]} fontSize={0.1} color="white" anchorX="center">-</Text>
            </Box>
            <Text position={[0, 0, 0.1]} fontSize={0.15} color="white" anchorX="center">
              {equation2[coef as keyof typeof equation2]}
            </Text>
            <Box
              args={[0.2, 0.2, 0.1]}
              position={[0.5, 0, 0.1]}
              onClick={() => {
                const current = equation2[coef as keyof typeof equation2];
                const newVal = current + 1;
                setEquation2(prev => ({ ...prev, [coef]: newVal > 10 ? -10 : newVal }));
              }}
            >
              <meshStandardMaterial color="#4ecdc4" />
              <Text position={[0, 0, 0.1]} fontSize={0.1} color="white" anchorX="center">+</Text>
            </Box>
          </group>
        ))}
        
        {/* Display Options */}
        <Text position={[0, 0, 0.1]} fontSize={0.15} color="white" anchorX="center">
          Display Options
        </Text>
        
        <Box
          args={[3, 0.3, 0.1]}
          position={[0, -0.5, 0.1]}
          onClick={() => setShowSolution(!showSolution)}
        >
          <meshStandardMaterial color={showSolution ? "#feca57" : "#333333"} />
        </Box>
        <Text position={[0, -0.5, 0.15]} fontSize={0.12} color="white" anchorX="center">
          Show Solution Point
        </Text>
        
        <Box
          args={[3, 0.3, 0.1]}
          position={[0, -1, 0.1]}
          onClick={() => setShowSteps(!showSteps)}
        >
          <meshStandardMaterial color={showSteps ? "#96ceb4" : "#333333"} />
        </Box>
        <Text position={[0, -1, 0.15]} fontSize={0.12} color="white" anchorX="center">
          Show Solution Steps
        </Text>
        
        {/* Preset Systems */}
        <Text position={[0, -1.5, 0.1]} fontSize={0.15} color="white" anchorX="center">
          Preset Systems
        </Text>
        
        <Box
          args={[3, 0.25, 0.1]}
          position={[0, -1.9, 0.1]}
          onClick={() => {
            setEquation1({ a1: 1, b1: 1, c1: 5 });
            setEquation2({ a2: 1, b2: -1, c2: 1 });
          }}
        >
          <meshStandardMaterial color="#45b7d1" />
        </Box>
        <Text position={[0, -1.9, 0.15]} fontSize={0.1} color="white" anchorX="center">
          Simple System
        </Text>
        
        <Box
          args={[3, 0.25, 0.1]}
          position={[0, -2.3, 0.1]}
          onClick={() => {
            setEquation1({ a1: 2, b1: 3, c1: 7 });
            setEquation2({ a2: 4, b2: 6, c2: 14 });
          }}
        >
          <meshStandardMaterial color="#96ceb4" />
        </Box>
        <Text position={[0, -2.3, 0.15]} fontSize={0.1} color="white" anchorX="center">
          Dependent System
        </Text>
        
        <Box
          args={[3, 0.25, 0.1]}
          position={[0, -2.7, 0.1]}
          onClick={() => {
            setEquation1({ a1: 1, b1: 2, c1: 3 });
            setEquation2({ a2: 1, b2: 2, c2: 5 });
          }}
        >
          <meshStandardMaterial color="#ff9ff3" />
        </Box>
        <Text position={[0, -2.7, 0.15]} fontSize={0.1} color="white" anchorX="center">
          Inconsistent System
        </Text>
      </group>

      {/* Real-world Application Examples */}
      <group position={[0, -10, 0]}>
        <Text fontSize={0.25} color="#96ceb4" anchorX="center">
          Real-world Problem Example
        </Text>
        <Text fontSize={0.18} color="#feca57" anchorX="center" position={[0, -0.4, 0]}>
          Coffee Shop Problem
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -0.7, 0]}>
          2 lattes + 3 cappuccinos = $15 (Red line)
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -1, 0]}>
          1 latte - 1 cappuccino = $1 (Blue line)
        </Text>
        {solution && (
          <>
            <Text fontSize={0.15} color="#feca57" anchorX="center" position={[0, -1.3, 0]}>
              Solution: Latte = ${solution.x.toFixed(2)}, Cappuccino = ${solution.y.toFixed(2)}
            </Text>
            <Text fontSize={0.12} color="#96ceb4" anchorX="center" position={[0, -1.6, 0]}>
              Verification: 2(${solution.x.toFixed(2)}) + 3(${solution.y.toFixed(2)}) = ${(2*solution.x + 3*solution.y).toFixed(2)}
            </Text>
          </>
        )}
      </group>

      {/* Historical Context */}
      <group position={[0, -12, 0]}>
        <Text fontSize={0.2} color="#ff9ff3" anchorX="center">
          Historical Development
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -0.3, 0]}>
          • Ancient Babylon (2000 BCE): First linear equations
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -0.6, 0]}>
          • Chinese "Nine Chapters" (200 BCE): Matrix methods
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -0.9, 0]}>
          • Cramer (1750): Cramer's rule for solving systems
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -1.2, 0]}>
          • Gauss (1800s): Gaussian elimination method
        </Text>
      </group>
    </group>
  );
};

export default LinearEquations;