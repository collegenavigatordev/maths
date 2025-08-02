import React, { useState, useMemo } from 'react';
import { Line, Text, Box, Sphere } from '@react-three/drei';
import { Vector3 } from 'three';

interface PolynomialsProps {
  mode: 'guided' | 'free';
}

const Polynomials: React.FC<PolynomialsProps> = ({ mode }) => {
  const [coefficients, setCoefficients] = useState({ a: 1, b: -3, c: 2, d: 0 });
  const [degree, setDegree] = useState(2);
  const [showDerivative, setShowDerivative] = useState(false);
  const [showFactorization, setShowFactorization] = useState(true);
  const [showTangent, setShowTangent] = useState(false);
  const [tangentPoint, setTangentPoint] = useState(1);

  // Generate polynomial curve points
  const curvePoints = useMemo(() => {
    const points = [];
    for (let x = -6; x <= 6; x += 0.05) {
      let y = 0;
      if (degree === 1) {
        y = coefficients.a * x + coefficients.b;
      } else if (degree === 2) {
        y = coefficients.a * x * x + coefficients.b * x + coefficients.c;
      } else if (degree === 3) {
        y = coefficients.a * x * x * x + coefficients.b * x * x + coefficients.c * x + coefficients.d;
      }
      
      // Clamp y values for visualization
      y = Math.max(-8, Math.min(8, y));
      points.push(new Vector3(x, y, 0));
    }
    return points;
  }, [coefficients, degree]);

  // Generate derivative curve
  const derivativePoints = useMemo(() => {
    if (!showDerivative) return [];
    const points = [];
    for (let x = -6; x <= 6; x += 0.1) {
      let y = 0;
      if (degree === 1) {
        y = coefficients.a;
      } else if (degree === 2) {
        y = 2 * coefficients.a * x + coefficients.b;
      } else if (degree === 3) {
        y = 3 * coefficients.a * x * x + 2 * coefficients.b * x + coefficients.c;
      }
      
      y = Math.max(-8, Math.min(8, y));
      points.push(new Vector3(x, y, 0));
    }
    return points;
  }, [coefficients, degree, showDerivative]);

  // Find roots using various methods
  const roots = useMemo(() => {
    const { a, b, c, d } = coefficients;
    
    if (degree === 1) {
      return a !== 0 ? [-b / a] : [];
    } else if (degree === 2) {
      const discriminant = b * b - 4 * a * c;
      if (discriminant >= 0) {
        const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
        return [root1, root2].filter(r => r >= -6 && r <= 6);
      }
      return [];
    } else if (degree === 3) {
      // Simplified cubic root finding (numerical approximation)
      const roots = [];
      for (let x = -6; x <= 6; x += 0.1) {
        const y = a * x * x * x + b * x * x + c * x + d;
        if (Math.abs(y) < 0.1) {
          roots.push(x);
        }
      }
      return roots.filter((root, index, arr) => 
        index === 0 || Math.abs(root - arr[index - 1]) > 0.5
      );
    }
    return [];
  }, [coefficients, degree]);

  // Calculate polynomial properties
  const polynomialProperties = useMemo(() => {
    const { a, b, c, d } = coefficients;
    
    if (degree === 2) {
      const discriminant = b * b - 4 * a * c;
      const vertex = {
        x: -b / (2 * a),
        y: a * (-b / (2 * a)) ** 2 + b * (-b / (2 * a)) + c
      };
      
      return {
        discriminant,
        vertex,
        axisOfSymmetry: -b / (2 * a),
        concavity: a > 0 ? 'upward' : 'downward',
        yIntercept: c,
        leadingCoefficient: a
      };
    } else if (degree === 3) {
      // Critical points for cubic
      const criticalPoints = [];
      const derivative_a = 3 * a;
      const derivative_b = 2 * b;
      const derivative_c = c;
      
      const disc = derivative_b * derivative_b - 4 * derivative_a * derivative_c;
      if (disc >= 0) {
        const cp1 = (-derivative_b + Math.sqrt(disc)) / (2 * derivative_a);
        const cp2 = (-derivative_b - Math.sqrt(disc)) / (2 * derivative_a);
        criticalPoints.push(cp1, cp2);
      }
      
      return {
        criticalPoints,
        yIntercept: d,
        leadingCoefficient: a,
        endBehavior: a > 0 ? 'rises right, falls left' : 'falls right, rises left'
      };
    }
    
    return {
      yIntercept: degree === 1 ? b : c,
      leadingCoefficient: a,
      slope: degree === 1 ? a : null
    };
  }, [coefficients, degree]);

  // Tangent line calculation
  const tangentLine = useMemo(() => {
    if (!showTangent) return [];
    
    let slope = 0;
    let yValue = 0;
    
    if (degree === 1) {
      slope = coefficients.a;
      yValue = coefficients.a * tangentPoint + coefficients.b;
    } else if (degree === 2) {
      slope = 2 * coefficients.a * tangentPoint + coefficients.b;
      yValue = coefficients.a * tangentPoint * tangentPoint + coefficients.b * tangentPoint + coefficients.c;
    } else if (degree === 3) {
      slope = 3 * coefficients.a * tangentPoint * tangentPoint + 2 * coefficients.b * tangentPoint + coefficients.c;
      yValue = coefficients.a * tangentPoint * tangentPoint * tangentPoint + 
               coefficients.b * tangentPoint * tangentPoint + 
               coefficients.c * tangentPoint + coefficients.d;
    }
    
    const points = [];
    for (let x = tangentPoint - 2; x <= tangentPoint + 2; x += 0.1) {
      const y = yValue + slope * (x - tangentPoint);
      if (y >= -8 && y <= 8) {
        points.push(new Vector3(x, y, 0));
      }
    }
    
    return { points, slope, yValue };
  }, [coefficients, degree, tangentPoint, showTangent]);

  return (
    <group>
      {/* Coordinate System with enhanced grid */}
      <Line points={[new Vector3(-7, 0, 0), new Vector3(7, 0, 0)]} color="#666666" lineWidth={2} />
      <Line points={[new Vector3(0, -8, 0), new Vector3(0, 8, 0)]} color="#666666" lineWidth={2} />
      
      {/* Enhanced Grid */}
      {[-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6].map(i => (
        <React.Fragment key={i}>
          <Line 
            points={[new Vector3(i, -8, 0), new Vector3(i, 8, 0)]} 
            color="#333333" 
            lineWidth={0.5}
          />
          <Text position={[i, -0.4, 0]} fontSize={0.2} color="#888888">{i}</Text>
        </React.Fragment>
      ))}
      
      {[-7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7].map(i => (
        <React.Fragment key={`h${i}`}>
          <Line 
            points={[new Vector3(-7, i, 0), new Vector3(7, i, 0)]} 
            color="#333333" 
            lineWidth={0.5}
          />
          <Text position={[-0.4, i, 0]} fontSize={0.2} color="#888888">{i}</Text>
        </React.Fragment>
      ))}

      {/* Main Polynomial Curve */}
      <Line points={curvePoints} color="#4ecdc4" lineWidth={4} />

      {/* Derivative Curve */}
      {showDerivative && derivativePoints.length > 0 && (
        <Line points={derivativePoints} color="#ff9ff3" lineWidth={2} />
      )}

      {/* Tangent Line */}
      {showTangent && tangentLine.points && (
        <>
          <Line points={tangentLine.points} color="#feca57" lineWidth={2} />
          <Sphere args={[0.08]} position={[tangentPoint, tangentLine.yValue, 0]}>
            <meshStandardMaterial color="#feca57" emissive="#feca57" emissiveIntensity={0.5} />
          </Sphere>
        </>
      )}

      {/* Roots */}
      {roots.map((root, index) => (
        <group key={index} position={[root, 0, 0]}>
          <Sphere args={[0.1]}>
            <meshStandardMaterial color="#ff6b6b" emissive="#ff6b6b" emissiveIntensity={0.5} />
          </Sphere>
          <Text position={[0, -0.6, 0]} fontSize={0.2} color="#ff6b6b" anchorX="center">
            x = {root.toFixed(2)}
          </Text>
        </group>
      ))}

      {/* Critical Points for cubic */}
      {degree === 3 && polynomialProperties.criticalPoints && 
        polynomialProperties.criticalPoints.map((cp, index) => {
          const y = coefficients.a * cp * cp * cp + coefficients.b * cp * cp + coefficients.c * cp + coefficients.d;
          return (
            <group key={index} position={[cp, y, 0]}>
              <Sphere args={[0.08]}>
                <meshStandardMaterial color="#96ceb4" emissive="#96ceb4" emissiveIntensity={0.5} />
              </Sphere>
              <Text position={[0.3, 0.3, 0]} fontSize={0.15} color="#96ceb4">
                Critical
              </Text>
            </group>
          );
        })
      }

      {/* Vertex for quadratic */}
      {degree === 2 && polynomialProperties.vertex && (
        <group position={[polynomialProperties.vertex.x, polynomialProperties.vertex.y, 0]}>
          <Sphere args={[0.12]}>
            <meshStandardMaterial color="#feca57" emissive="#feca57" emissiveIntensity={0.5} />
          </Sphere>
          <Text position={[0.5, 0.5, 0]} fontSize={0.2} color="#feca57">
            Vertex ({polynomialProperties.vertex.x.toFixed(2)}, {polynomialProperties.vertex.y.toFixed(2)})
          </Text>
        </group>
      )}

      {/* Y-intercept */}
      <group position={[0, polynomialProperties.yIntercept, 0]}>
        <Sphere args={[0.08]}>
          <meshStandardMaterial color="#45b7d1" emissive="#45b7d1" emissiveIntensity={0.5} />
        </Sphere>
        <Text position={[0.3, 0, 0]} fontSize={0.15} color="#45b7d1">
          y-int: {polynomialProperties.yIntercept}
        </Text>
      </group>

      {/* Polynomial Expression */}
      <group position={[0, 7, 0]}>
        <Text fontSize={0.4} color="#feca57" anchorX="center">
          {degree === 1 && `f(x) = ${coefficients.a}x + ${coefficients.b}`}
          {degree === 2 && `f(x) = ${coefficients.a}x² + ${coefficients.b}x + ${coefficients.c}`}
          {degree === 3 && `f(x) = ${coefficients.a}x³ + ${coefficients.b}x² + ${coefficients.c}x + ${coefficients.d}`}
        </Text>
        
        {showDerivative && (
          <Text fontSize={0.3} color="#ff9ff3" anchorX="center" position={[0, -0.6, 0]}>
            {degree === 1 && `f'(x) = ${coefficients.a}`}
            {degree === 2 && `f'(x) = ${2 * coefficients.a}x + ${coefficients.b}`}
            {degree === 3 && `f'(x) = ${3 * coefficients.a}x² + ${2 * coefficients.b}x + ${coefficients.c}`}
          </Text>
        )}
      </group>

      {/* Comprehensive Properties Panel */}
      <group position={[9, 2, 0]}>
        <Box args={[5, 12, 0.1]}>
          <meshBasicMaterial color="#000000" transparent opacity={0.9} />
        </Box>
        
        <Text position={[0, 5.5, 0.1]} fontSize={0.25} color="#4ecdc4" anchorX="center">
          Polynomial Analysis
        </Text>
        
        {/* Basic Information */}
        <Text position={[0, 5, 0.1]} fontSize={0.2} color="#ff6b6b" anchorX="center">
          Basic Properties
        </Text>
        <Text position={[0, 4.7, 0.1]} fontSize={0.12} color="white" anchorX="center">
          Degree: {degree}
        </Text>
        <Text position={[0, 4.5, 0.1]} fontSize={0.12} color="white" anchorX="center">
          Leading Coefficient: {polynomialProperties.leadingCoefficient}
        </Text>
        <Text position={[0, 4.3, 0.1]} fontSize={0.12} color="white" anchorX="center">
          Y-intercept: {polynomialProperties.yIntercept}
        </Text>
        <Text position={[0, 4.1, 0.1]} fontSize={0.12} color="white" anchorX="center">
          Number of roots: {roots.length}
        </Text>
        
        {/* Degree-specific properties */}
        {degree === 1 && (
          <>
            <Text position={[0, 3.7, 0.1]} fontSize={0.2} color="#feca57" anchorX="center">
              Linear Function
            </Text>
            <Text position={[0, 3.4, 0.1]} fontSize={0.12} color="white" anchorX="center">
              Slope: {coefficients.a}
            </Text>
            <Text position={[0, 3.2, 0.1]} fontSize={0.12} color="white" anchorX="center">
              {coefficients.a > 0 ? 'Increasing' : coefficients.a < 0 ? 'Decreasing' : 'Constant'}
            </Text>
            <Text position={[0, 3, 0.1]} fontSize={0.12} color="white" anchorX="center">
              Domain: ℝ, Range: ℝ
            </Text>
          </>
        )}
        
        {degree === 2 && polynomialProperties.discriminant !== undefined && (
          <>
            <Text position={[0, 3.7, 0.1]} fontSize={0.2} color="#feca57" anchorX="center">
              Quadratic Function
            </Text>
            <Text position={[0, 3.4, 0.1]} fontSize={0.12} color="white" anchorX="center">
              Discriminant: Δ = {polynomialProperties.discriminant.toFixed(2)}
            </Text>
            <Text position={[0, 3.2, 0.1]} fontSize={0.12} color="white" anchorX="center">
              {polynomialProperties.discriminant > 0 ? 'Two real roots' : 
               polynomialProperties.discriminant === 0 ? 'One real root' : 'No real roots'}
            </Text>
            <Text position={[0, 3, 0.1]} fontSize={0.12} color="white" anchorX="center">
              Concavity: {polynomialProperties.concavity}
            </Text>
            <Text position={[0, 2.8, 0.1]} fontSize={0.12} color="white" anchorX="center">
              Axis of symmetry: x = {polynomialProperties.axisOfSymmetry?.toFixed(2)}
            </Text>
            <Text position={[0, 2.6, 0.1]} fontSize={0.12} color="white" anchorX="center">
              Vertex: ({polynomialProperties.vertex?.x.toFixed(2)}, {polynomialProperties.vertex?.y.toFixed(2)})
            </Text>
          </>
        )}
        
        {degree === 3 && (
          <>
            <Text position={[0, 3.7, 0.1]} fontSize={0.2} color="#feca57" anchorX="center">
              Cubic Function
            </Text>
            <Text position={[0, 3.4, 0.1]} fontSize={0.12} color="white" anchorX="center">
              End behavior: {polynomialProperties.endBehavior}
            </Text>
            <Text position={[0, 3.2, 0.1]} fontSize={0.12} color="white" anchorX="center">
              Critical points: {polynomialProperties.criticalPoints?.length || 0}
            </Text>
            <Text position={[0, 3, 0.1]} fontSize={0.12} color="white" anchorX="center">
              Domain: ℝ, Range: ℝ
            </Text>
          </>
        )}
        
        {/* Factorization */}
        {showFactorization && roots.length > 0 && (
          <>
            <Text position={[0, 2.4, 0.1]} fontSize={0.2} color="#96ceb4" anchorX="center">
              Factored Form
            </Text>
            {degree === 2 && roots.length === 2 && (
              <Text position={[0, 2.1, 0.1]} fontSize={0.12} color="white" anchorX="center">
                f(x) = {coefficients.a}(x - {roots[0].toFixed(2)})(x - {roots[1].toFixed(2)})
              </Text>
            )}
            {degree === 1 && roots.length === 1 && (
              <Text position={[0, 2.1, 0.1]} fontSize={0.12} color="white" anchorX="center">
                f(x) = {coefficients.a}(x - {roots[0].toFixed(2)})
              </Text>
            )}
          </>
        )}
        
        {/* Calculus Properties */}
        <Text position={[0, 1.7, 0.1]} fontSize={0.2} color="#ff9ff3" anchorX="center">
          Calculus Properties
        </Text>
        <Text position={[0, 1.4, 0.1]} fontSize={0.12} color="white" anchorX="center">
          Derivative degree: {Math.max(0, degree - 1)}
        </Text>
        {showTangent && (
          <>
            <Text position={[0, 1.2, 0.1]} fontSize={0.12} color="white" anchorX="center">
              Tangent at x = {tangentPoint}:
            </Text>
            <Text position={[0, 1, 0.1]} fontSize={0.12} color="white" anchorX="center">
              Slope = {tangentLine.slope?.toFixed(3)}
            </Text>
          </>
        )}
        
        {/* Polynomial Operations */}
        <Text position={[0, 0.6, 0.1]} fontSize={0.2} color="#45b7d1" anchorX="center">
          Operations & Theorems
        </Text>
        <Text position={[0, 0.3, 0.1]} fontSize={0.1} color="white" anchorX="center">
          • Addition: (P + Q)(x) = P(x) + Q(x)
        </Text>
        <Text position={[0, 0.1, 0.1]} fontSize={0.1} color="white" anchorX="center">
          • Multiplication: deg(PQ) = deg(P) + deg(Q)
        </Text>
        <Text position={[0, -0.1, 0.1]} fontSize={0.1} color="white" anchorX="center">
          • Division Algorithm: P = QD + R
        </Text>
        <Text position={[0, -0.3, 0.1]} fontSize={0.1} color="white" anchorX="center">
          • Remainder Theorem: P(a) = remainder when P(x) ÷ (x-a)
        </Text>
        <Text position={[0, -0.5, 0.1]} fontSize={0.1} color="white" anchorX="center">
          • Factor Theorem: (x-a) is factor ⟺ P(a) = 0
        </Text>
        
        {/* Fundamental Theorem of Algebra */}
        <Text position={[0, -0.9, 0.1]} fontSize={0.2} color="#feca57" anchorX="center">
          Fundamental Theorem
        </Text>
        <Text position={[0, -1.2, 0.1]} fontSize={0.1} color="white" anchorX="center">
          Every polynomial of degree n ≥ 1 has exactly n
        </Text>
        <Text position={[0, -1.4, 0.1]} fontSize={0.1} color="white" anchorX="center">
          complex roots (counting multiplicity)
        </Text>
        
        {/* Polynomial Inequalities */}
        <Text position={[0, -1.8, 0.1]} fontSize={0.2} color="#96ceb4" anchorX="center">
          Sign Analysis
        </Text>
        <Text position={[0, -2.1, 0.1]} fontSize={0.1} color="white" anchorX="center">
          Use roots to determine intervals where f(x) > 0 or f(x) < 0
        </Text>
        
        {/* Rational Root Theorem */}
        <Text position={[0, -2.5, 0.1]} fontSize={0.2} color="#ff6b6b" anchorX="center">
          Rational Root Theorem
        </Text>
        <Text position={[0, -2.8, 0.1]} fontSize={0.1} color="white" anchorX="center">
          If p/q is a rational root of polynomial with
        </Text>
        <Text position={[0, -3, 0.1]} fontSize={0.1} color="white" anchorX="center">
          integer coefficients, then p divides constant
        </Text>
        <Text position={[0, -3.2, 0.1]} fontSize={0.1} color="white" anchorX="center">
          term and q divides leading coefficient
        </Text>
        
        {/* Synthetic Division */}
        <Text position={[0, -3.6, 0.1]} fontSize={0.2} color="#ff9ff3" anchorX="center">
          Synthetic Division
        </Text>
        <Text position={[0, -3.9, 0.1]} fontSize={0.1} color="white" anchorX="center">
          Efficient method for dividing by (x - a)
        </Text>
        <Text position={[0, -4.1, 0.1]} fontSize={0.1} color="white" anchorX="center">
          Used for finding roots and factoring
        </Text>
        
        {/* Complex Roots */}
        <Text position={[0, -4.5, 0.1]} fontSize={0.2} color="#45b7d1" anchorX="center">
          Complex Conjugate Theorem
        </Text>
        <Text position={[0, -4.8, 0.1]} fontSize={0.1} color="white" anchorX="center">
          If a + bi is a root of polynomial with real
        </Text>
        <Text position={[0, -5, 0.1]} fontSize={0.1} color="white" anchorX="center">
          coefficients, then a - bi is also a root
        </Text>
      </group>

      {/* Enhanced Interactive Controls */}
      <group position={[-9, 0, 0]}>
        <Box args={[4, 10, 0.1]}>
          <meshBasicMaterial color="#000000" transparent opacity={0.9} />
        </Box>
        
        <Text position={[0, 4.5, 0.1]} fontSize={0.2} color="white" anchorX="center">
          Polynomial Controls
        </Text>
        
        <Text position={[0, 4, 0.1]} fontSize={0.15} color="white" anchorX="center">
          Degree: {degree}
        </Text>
        
        {[1, 2, 3].map(d => (
          <Box
            key={d}
            args={[0.6, 0.3, 0.1]}
            position={[-0.8 + (d-1) * 0.8, 3.5, 0.1]}
            onClick={() => setDegree(d)}
          >
            <meshStandardMaterial color={degree === d ? "#ff6b6b" : "#333333"} />
            <Text position={[0, 0, 0.1]} fontSize={0.15} color="white" anchorX="center">
              {d}
            </Text>
          </Box>
        ))}
        
        <Text position={[0, 3, 0.1]} fontSize={0.15} color="white" anchorX="center">
          Coefficients
        </Text>
        
        {/* Coefficient controls */}
        {['a', 'b', 'c', 'd'].slice(0, degree + 1).map((coef, index) => (
          <group key={coef} position={[0, 2.5 - index * 0.4, 0]}>
            <Text position={[-1.5, 0, 0.1]} fontSize={0.12} color="#feca57">
              {coef} = {coefficients[coef as keyof typeof coefficients]}
            </Text>
            <Box
              args={[0.2, 0.2, 0.1]}
              position={[-0.5, 0, 0.1]}
              onClick={() => {
                const current = coefficients[coef as keyof typeof coefficients];
                const newVal = current - 0.5;
                setCoefficients(prev => ({ ...prev, [coef]: newVal < -5 ? 5 : newVal }));
              }}
            >
              <meshStandardMaterial color="#ff6b6b" />
              <Text position={[0, 0, 0.1]} fontSize={0.1} color="white" anchorX="center">-</Text>
            </Box>
            <Box
              args={[0.2, 0.2, 0.1]}
              position={[0.5, 0, 0.1]}
              onClick={() => {
                const current = coefficients[coef as keyof typeof coefficients];
                const newVal = current + 0.5;
                setCoefficients(prev => ({ ...prev, [coef]: newVal > 5 ? -5 : newVal }));
              }}
            >
              <meshStandardMaterial color="#4ecdc4" />
              <Text position={[0, 0, 0.1]} fontSize={0.1} color="white" anchorX="center">+</Text>
            </Box>
          </group>
        ))}
        
        {/* Feature toggles */}
        <Text position={[0, -0.5, 0.1]} fontSize={0.15} color="white" anchorX="center">
          Display Options
        </Text>
        
        <Box
          args={[3, 0.3, 0.1]}
          position={[0, -1, 0.1]}
          onClick={() => setShowDerivative(!showDerivative)}
        >
          <meshStandardMaterial color={showDerivative ? "#ff9ff3" : "#333333"} />
        </Box>
        <Text position={[0, -1, 0.15]} fontSize={0.12} color="white" anchorX="center">
          Show Derivative
        </Text>
        
        <Box
          args={[3, 0.3, 0.1]}
          position={[0, -1.5, 0.1]}
          onClick={() => setShowFactorization(!showFactorization)}
        >
          <meshStandardMaterial color={showFactorization ? "#96ceb4" : "#333333"} />
        </Box>
        <Text position={[0, -1.5, 0.15]} fontSize={0.12} color="white" anchorX="center">
          Show Factorization
        </Text>
        
        <Box
          args={[3, 0.3, 0.1]}
          position={[0, -2, 0.1]}
          onClick={() => setShowTangent(!showTangent)}
        >
          <meshStandardMaterial color={showTangent ? "#feca57" : "#333333"} />
        </Box>
        <Text position={[0, -2, 0.15]} fontSize={0.12} color="white" anchorX="center">
          Show Tangent Line
        </Text>
        
        {showTangent && (
          <group>
            <Text position={[0, -2.5, 0.1]} fontSize={0.12} color="white" anchorX="center">
              Tangent at x = {tangentPoint}
            </Text>
            <Box
              args={[0.3, 0.3, 0.1]}
              position={[0, -2.9, 0.1]}
              onClick={() => setTangentPoint(prev => prev >= 3 ? -3 : prev + 0.5)}
            >
              <meshStandardMaterial color="#feca57" />
            </Box>
          </group>
        )}
        
        {/* Preset polynomials */}
        <Text position={[0, -3.5, 0.1]} fontSize={0.15} color="white" anchorX="center">
          Presets
        </Text>
        
        <Box
          args={[3, 0.25, 0.1]}
          position={[0, -3.9, 0.1]}
          onClick={() => setCoefficients({ a: 1, b: 0, c: -4, d: 0 })}
        >
          <meshStandardMaterial color="#45b7d1" />
        </Box>
        <Text position={[0, -3.9, 0.15]} fontSize={0.1} color="white" anchorX="center">
          x² - 4 (Difference of squares)
        </Text>
        
        <Box
          args={[3, 0.25, 0.1]}
          position={[0, -4.3, 0.1]}
          onClick={() => setCoefficients({ a: 1, b: -1, c: -6, d: 0 })}
        >
          <meshStandardMaterial color="#96ceb4" />
        </Box>
        <Text position={[0, -4.3, 0.15]} fontSize={0.1} color="white" anchorX="center">
          x² - x - 6 (Factorizable)
        </Text>
      </group>

      {/* Applications and Examples */}
      <group position={[0, -10, 0]}>
        <Text fontSize={0.2} color="#96ceb4" anchorX="center">
          Real-world Applications
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -0.3, 0]}>
          • Physics: Projectile motion (quadratic), wave equations
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -0.6, 0]}>
          • Economics: Cost functions, profit maximization
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -0.9, 0]}>
          • Engineering: Signal processing, control systems
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -1.2, 0]}>
          • Computer Graphics: Bezier curves, interpolation
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -1.5, 0]}>
          • Biology: Population growth models
        </Text>
      </group>
    </group>
  );
};

export default Polynomials;