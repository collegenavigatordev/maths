import React, { useState, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Box, Sphere, Line } from '@react-three/drei';
import { Vector3 } from 'three';

interface RealNumbersProps {
  mode: 'guided' | 'free';
}

const RealNumbers: React.FC<RealNumbersProps> = ({ mode }) => {
  const [selectedNumber, setSelectedNumber] = useState(Math.PI);
  const [showDecimals, setShowDecimals] = useState(15);
  const [numberType, setNumberType] = useState<'rational' | 'irrational' | 'integer' | 'natural'>('irrational');
  const [showProofs, setShowProofs] = useState(false);
  const spiralRef = useRef();

  // Generate comprehensive number examples
  const numberExamples = useMemo(() => ({
    natural: [1, 2, 3, 4, 5, 10, 100, 1000],
    whole: [0, 1, 2, 3, 4, 5, 10, 100],
    integers: [-5, -3, -1, 0, 1, 3, 5, 10],
    rational: [1/2, 3/4, 22/7, -5/3, 0.25, 0.333, 1.5, -2.75],
    irrational: [Math.PI, Math.E, Math.sqrt(2), Math.sqrt(3), Math.sqrt(5), Math.sqrt(7), Math.LN2, Math.LOG10E]
  }), []);

  // Generate number line with more detail
  const numberLinePoints = [];
  for (let i = -15; i <= 15; i += 0.5) {
    numberLinePoints.push(i);
  }

  // Generate decimal expansion visualization
  const decimalDigits = selectedNumber.toString().split('.')[1]?.slice(0, showDecimals) || '';

  // Euclidean algorithm for GCD
  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  // Convert decimal to fraction
  const decimalToFraction = (decimal: number) => {
    const tolerance = 1.0E-6;
    let h1 = 1, h2 = 0, k1 = 0, k2 = 1;
    let b = decimal;
    
    do {
      const a = Math.floor(b);
      let aux = h1; h1 = a * h1 + h2; h2 = aux;
      aux = k1; k1 = a * k1 + k2; k2 = aux;
      b = 1 / (b - a);
    } while (Math.abs(decimal - h1 / k1) > decimal * tolerance);
    
    return { numerator: h1, denominator: k1 };
  };

  useFrame((state) => {
    if (spiralRef.current) {
      spiralRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group>
      {/* Enhanced Number Line with subdivisions */}
      <group position={[0, -3, 0]}>
        <Box args={[30, 0.05, 0.05]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#ffffff" />
        </Box>
        
        {/* Major tick marks */}
        {[-10, -5, 0, 5, 10].map((num) => (
          <group key={`major-${num}`} position={[num * 2, 0, 0]}>
            <Box args={[0.03, 0.4, 0.03]}>
              <meshStandardMaterial color="#ff6b6b" />
            </Box>
            <Text position={[0, -0.6, 0]} fontSize={0.25} color="#ff6b6b" anchorX="center">
              {num}
            </Text>
          </group>
        ))}
        
        {/* Minor tick marks */}
        {numberLinePoints.map((num) => (
          <group key={`minor-${num}`} position={[num * 2, 0, 0]}>
            <Box args={[0.01, 0.2, 0.01]}>
              <meshStandardMaterial color="#4ecdc4" />
            </Box>
            {num % 1 !== 0 && (
              <Text position={[0, -0.4, 0]} fontSize={0.12} color="#888888" anchorX="center">
                {num}
              </Text>
            )}
          </group>
        ))}
        
        {/* Special numbers on number line */}
        {[Math.PI, Math.E, Math.sqrt(2), -Math.sqrt(2)].map((num, index) => (
          <group key={`special-${index}`} position={[num * 2, 0, 0]}>
            <Sphere args={[0.08]}>
              <meshStandardMaterial color="#feca57" emissive="#feca57" emissiveIntensity={0.3} />
            </Sphere>
            <Text position={[0, 0.4, 0]} fontSize={0.15} color="#feca57" anchorX="center">
              {num === Math.PI ? 'π' : num === Math.E ? 'e' : num === Math.sqrt(2) ? '√2' : '-√2'}
            </Text>
          </group>
        ))}
      </group>

      {/* Selected Number Visualization with enhanced detail */}
      <group position={[0, 0, 0]}>
        <Sphere args={[0.25]} position={[Math.min(Math.max(selectedNumber * 2, -14), 14), 0, 0]}>
          <meshStandardMaterial color="#ff6b6b" emissive="#ff6b6b" emissiveIntensity={0.5} />
        </Sphere>
        <Text position={[Math.min(Math.max(selectedNumber * 2, -14), 14), 0.8, 0]} fontSize={0.3} color="#ff6b6b" anchorX="center">
          {selectedNumber === Math.PI ? 'π' : selectedNumber === Math.E ? 'e' : selectedNumber.toFixed(showDecimals)}
        </Text>
        
        {/* Show rational approximation if irrational */}
        {(selectedNumber === Math.PI || selectedNumber === Math.E || selectedNumber === Math.sqrt(2)) && (
          <Text position={[Math.min(Math.max(selectedNumber * 2, -14), 14), 0.4, 0]} fontSize={0.15} color="#96ceb4" anchorX="center">
            ≈ {selectedNumber.toFixed(6)}
          </Text>
        )}
      </group>

      {/* Enhanced Decimal Expansion Spiral */}
      <group ref={spiralRef} position={[0, 3, 0]}>
        {decimalDigits.split('').map((digit, index) => {
          const angle = (index * Math.PI) / 6;
          const radius = 1 + index * 0.08;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const y = index * 0.05;
          
          return (
            <group key={index}>
              <Text
                position={[x, y, z]}
                fontSize={0.2}
                color={`hsl(${(index * 30) % 360}, 70%, 60%)`}
                anchorX="center"
              >
                {digit}
              </Text>
              {index < 10 && (
                <Text
                  position={[x, y - 0.2, z]}
                  fontSize={0.1}
                  color="#888888"
                  anchorX="center"
                >
                  {index + 1}
                </Text>
              )}
            </group>
          );
        })}
        
        <Text position={[0, -0.5, 0]} fontSize={0.2} color="#feca57" anchorX="center">
          Decimal Expansion
        </Text>
      </group>

      {/* Comprehensive Classification Panel */}
      <group position={[8, 2, 0]}>
        <Box args={[5, 12, 0.1]}>
          <meshBasicMaterial color="#000000" transparent opacity={0.9} />
        </Box>
        
        <Text position={[0, 5.5, 0.1]} fontSize={0.3} color="#4ecdc4" anchorX="center">
          Real Number System
        </Text>
        
        {/* Natural Numbers */}
        <Text position={[0, 5, 0.1]} fontSize={0.2} color="#ff6b6b" anchorX="center">
          Natural Numbers (ℕ)
        </Text>
        <Text position={[0, 4.7, 0.1]} fontSize={0.12} color="white" anchorX="center">
          ℕ = {1, 2, 3, 4, 5, ...}
        </Text>
        <Text position={[0, 4.5, 0.1]} fontSize={0.1} color="#888888" anchorX="center">
          • Counting numbers • Positive integers
        </Text>
        <Text position={[0, 4.3, 0.1]} fontSize={0.1} color="#888888" anchorX="center">
          • Closed under addition and multiplication
        </Text>
        
        {/* Whole Numbers */}
        <Text position={[0, 3.9, 0.1]} fontSize={0.2} color="#feca57" anchorX="center">
          Whole Numbers (𝕎)
        </Text>
        <Text position={[0, 3.6, 0.1]} fontSize={0.12} color="white" anchorX="center">
          𝕎 = {0, 1, 2, 3, 4, ...}
        </Text>
        <Text position={[0, 3.4, 0.1]} fontSize={0.1} color="#888888" anchorX="center">
          • Natural numbers + zero • Identity for addition
        </Text>
        
        {/* Integers */}
        <Text position={[0, 3, 0.1]} fontSize={0.2} color="#96ceb4" anchorX="center">
          Integers (ℤ)
        </Text>
        <Text position={[0, 2.7, 0.1]} fontSize={0.12} color="white" anchorX="center">
          ℤ = {..., -2, -1, 0, 1, 2, ...}
        </Text>
        <Text position={[0, 2.5, 0.1]} fontSize={0.1} color="#888888" anchorX="center">
          • Whole numbers + negative numbers
        </Text>
        <Text position={[0, 2.3, 0.1]} fontSize={0.1} color="#888888" anchorX="center">
          • Closed under +, -, × • Ring structure
        </Text>
        
        {/* Rational Numbers */}
        <Text position={[0, 1.9, 0.1]} fontSize={0.2} color="#45b7d1" anchorX="center">
          Rational Numbers (ℚ)
        </Text>
        <Text position={[0, 1.6, 0.1]} fontSize={0.12} color="white" anchorX="center">
          ℚ = {p/q | p,q ∈ ℤ, q ≠ 0}
        </Text>
        <Text position={[0, 1.4, 0.1]} fontSize={0.1} color="#888888" anchorX="center">
          • Terminating or repeating decimals
        </Text>
        <Text position={[0, 1.2, 0.1]} fontSize={0.1} color="#888888" anchorX="center">
          • Dense in ℝ • Field structure
        </Text>
        <Text position={[0, 1, 0.1]} fontSize={0.1} color="#888888" anchorX="center">
          Examples: 1/2=0.5, 1/3=0.333..., 22/7≈π
        </Text>
        
        {/* Irrational Numbers */}
        <Text position={[0, 0.6, 0.1]} fontSize={0.2} color="#ff9ff3" anchorX="center">
          Irrational Numbers (ℝ\ℚ)
        </Text>
        <Text position={[0, 0.3, 0.1]} fontSize={0.12} color="white" anchorX="center">
          Non-terminating, non-repeating decimals
        </Text>
        <Text position={[0, 0.1, 0.1]} fontSize={0.1} color="#888888" anchorX="center">
          • π, e, √2, √3, φ (golden ratio)
        </Text>
        <Text position={[0, -0.1, 0.1]} fontSize={0.1} color="#888888" anchorX="center">
          • Cannot be expressed as p/q
        </Text>
        
        {/* Real Numbers */}
        <Text position={[0, -0.5, 0.1]} fontSize={0.2} color="#feca57" anchorX="center">
          Real Numbers (ℝ)
        </Text>
        <Text position={[0, -0.8, 0.1]} fontSize={0.12} color="white" anchorX="center">
          ℝ = ℚ ∪ (ℝ\ℚ)
        </Text>
        <Text position={[0, -1, 0.1]} fontSize={0.1} color="#888888" anchorX="center">
          • Complete ordered field
        </Text>
        <Text position={[0, -1.2, 0.1]} fontSize={0.1} color="#888888" anchorX="center">
          • Uncountably infinite
        </Text>
        
        {/* Properties */}
        <Text position={[0, -1.6, 0.1]} fontSize={0.2} color="#96ceb4" anchorX="center">
          Key Properties
        </Text>
        <Text position={[0, -1.9, 0.1]} fontSize={0.1} color="white" anchorX="center">
          Closure: a,b ∈ ℝ ⟹ a±b, a×b ∈ ℝ
        </Text>
        <Text position={[0, -2.1, 0.1]} fontSize={0.1} color="white" anchorX="center">
          Associativity: (a+b)+c = a+(b+c)
        </Text>
        <Text position={[0, -2.3, 0.1]} fontSize={0.1} color="white" anchorX="center">
          Commutativity: a+b = b+a, a×b = b×a
        </Text>
        <Text position={[0, -2.5, 0.1]} fontSize={0.1} color="white" anchorX="center">
          Identity: a+0=a, a×1=a
        </Text>
        <Text position={[0, -2.7, 0.1]} fontSize={0.1} color="white" anchorX="center">
          Inverse: a+(-a)=0, a×(1/a)=1 (a≠0)
        </Text>
        <Text position={[0, -2.9, 0.1]} fontSize={0.1} color="white" anchorX="center">
          Distributivity: a×(b+c) = a×b + a×c
        </Text>
        
        {/* Current number analysis */}
        <Text position={[0, -3.3, 0.1]} fontSize={0.2} color="#ff6b6b" anchorX="center">
          Current Number Analysis
        </Text>
        <Text position={[0, -3.6, 0.1]} fontSize={0.12} color="#feca57" anchorX="center">
          {selectedNumber === Math.PI ? 'π (Pi)' : 
           selectedNumber === Math.E ? 'e (Euler\'s number)' : 
           selectedNumber === Math.sqrt(2) ? '√2' :
           selectedNumber.toString()}
        </Text>
        <Text position={[0, -3.8, 0.1]} fontSize={0.1} color="white" anchorX="center">
          Value: {selectedNumber.toFixed(10)}
        </Text>
        
        {selectedNumber === Math.PI && (
          <>
            <Text position={[0, -4, 0.1]} fontSize={0.1} color="#96ceb4" anchorX="center">
              Ratio of circumference to diameter
            </Text>
            <Text position={[0, -4.2, 0.1]} fontSize={0.1} color="#96ceb4" anchorX="center">
              Transcendental number
            </Text>
            <Text position={[0, -4.4, 0.1]} fontSize={0.1} color="#96ceb4" anchorX="center">
              π = 4(1 - 1/3 + 1/5 - 1/7 + ...)
            </Text>
          </>
        )}
        
        {selectedNumber === Math.E && (
          <>
            <Text position={[0, -4, 0.1]} fontSize={0.1} color="#96ceb4" anchorX="center">
              Base of natural logarithm
            </Text>
            <Text position={[0, -4.2, 0.1]} fontSize={0.1} color="#96ceb4" anchorX="center">
              e = lim(n→∞)(1 + 1/n)ⁿ
            </Text>
            <Text position={[0, -4.4, 0.1]} fontSize={0.1} color="#96ceb4" anchorX="center">
              e = 1 + 1/1! + 1/2! + 1/3! + ...
            </Text>
          </>
        )}
        
        {selectedNumber === Math.sqrt(2) && (
          <>
            <Text position={[0, -4, 0.1]} fontSize={0.1} color="#96ceb4" anchorX="center">
              Diagonal of unit square
            </Text>
            <Text position={[0, -4.2, 0.1]} fontSize={0.1} color="#96ceb4" anchorX="center">
              First known irrational number
            </Text>
            <Text position={[0, -4.4, 0.1]} fontSize={0.1} color="#96ceb4" anchorX="center">
              Proof by contradiction (Pythagoreans)
            </Text>
          </>
        )}
      </group>

      {/* Interactive Controls with more options */}
      <group position={[-8, 0, 0]}>
        <Box args={[4, 8, 0.1]}>
          <meshBasicMaterial color="#000000" transparent opacity={0.9} />
        </Box>
        
        <Text position={[0, 3.5, 0.1]} fontSize={0.25} color="white" anchorX="center">
          Explore Numbers
        </Text>
        
        <Text position={[0, 3, 0.1]} fontSize={0.15} color="#ff6b6b" anchorX="center">
          Famous Constants
        </Text>
        
        {[
          { num: Math.PI, label: 'π (Pi)', color: '#ff6b6b' },
          { num: Math.E, label: 'e (Euler)', color: '#4ecdc4' },
          { num: Math.sqrt(2), label: '√2', color: '#feca57' },
          { num: Math.sqrt(3), label: '√3', color: '#96ceb4' },
          { num: (1 + Math.sqrt(5))/2, label: 'φ (Golden)', color: '#ff9ff3' },
          { num: Math.sqrt(5), label: '√5', color: '#45b7d1' }
        ].map((item, index) => (
          <Box
            key={index}
            args={[3, 0.3, 0.1]}
            position={[0, 2.5 - index * 0.4, 0]}
            onClick={() => setSelectedNumber(item.num)}
          >
            <meshStandardMaterial 
              color={selectedNumber === item.num ? item.color : "#333333"} 
            />
            <Text position={[0, 0, 0.1]} fontSize={0.12} color="white" anchorX="center">
              {item.label}: {item.num.toFixed(6)}
            </Text>
          </Box>
        ))}
        
        <Text position={[0, -0.5, 0.1]} fontSize={0.15} color="#96ceb4" anchorX="center">
          Decimal Places
        </Text>
        <Box
          args={[0.3, 0.3, 0.1]}
          position={[0, -0.9, 0.1]}
          onClick={() => setShowDecimals(prev => prev >= 20 ? 5 : prev + 5)}
        >
          <meshStandardMaterial color="#96ceb4" />
        </Box>
        <Text position={[0.5, -0.9, 0.1]} fontSize={0.15} color="white">
          {showDecimals}
        </Text>
        
        <Box
          args={[3, 0.3, 0.1]}
          position={[0, -1.5, 0.1]}
          onClick={() => setShowProofs(!showProofs)}
        >
          <meshStandardMaterial color={showProofs ? "#feca57" : "#333333"} />
        </Box>
        <Text position={[0, -1.5, 0.15]} fontSize={0.12} color="white" anchorX="center">
          Show Proofs
        </Text>
      </group>

      {/* Proofs and Theorems Section */}
      {showProofs && (
        <group position={[0, -6, 0]}>
          <Box args={[12, 4, 0.1]}>
            <meshBasicMaterial color="#000000" transparent opacity={0.9} />
          </Box>
          
          <Text position={[0, 1.5, 0.1]} fontSize={0.25} color="#feca57" anchorX="center">
            Mathematical Proofs & Theorems
          </Text>
          
          <Text position={[0, 1, 0.1]} fontSize={0.2} color="#ff6b6b" anchorX="center">
            Proof: √2 is Irrational
          </Text>
          <Text position={[0, 0.7, 0.1]} fontSize={0.12} color="white" anchorX="center">
            Assume √2 = p/q where p,q ∈ ℤ, gcd(p,q) = 1
          </Text>
          <Text position={[0, 0.5, 0.1]} fontSize={0.12} color="white" anchorX="center">
            Then 2 = p²/q² ⟹ 2q² = p²
          </Text>
          <Text position={[0, 0.3, 0.1]} fontSize={0.12} color="white" anchorX="center">
            So p² is even ⟹ p is even ⟹ p = 2k
          </Text>
          <Text position={[0, 0.1, 0.1]} fontSize={0.12} color="white" anchorX="center">
            Then 2q² = 4k² ⟹ q² = 2k² ⟹ q is even
          </Text>
          <Text position={[0, -0.1, 0.1]} fontSize={0.12} color="white" anchorX="center">
            Contradiction: both p,q even but gcd(p,q) = 1
          </Text>
          
          <Text position={[0, -0.5, 0.1]} fontSize={0.2} color="#4ecdc4" anchorX="center">
            Cantor's Theorem: ℝ is Uncountable
          </Text>
          <Text position={[0, -0.8, 0.1]} fontSize={0.12} color="white" anchorX="center">
            Diagonal argument shows no bijection ℕ → ℝ exists
          </Text>
          <Text position={[0, -1, 0.1]} fontSize={0.12} color="white" anchorX="center">
            |ℕ| = ℵ₀ (countable), |ℝ| = 2^ℵ₀ (uncountable)
          </Text>
          
          <Text position={[0, -1.4, 0.1]} fontSize={0.2} color="#96ceb4" anchorX="center">
            Density of ℚ in ℝ
          </Text>
          <Text position={[0, -1.7, 0.1]} fontSize={0.12} color="white" anchorX="center">
            Between any two real numbers, there exists a rational number
          </Text>
        </group>
      )}

      {/* Historical Context */}
      <group position={[0, -10, 0]}>
        <Text fontSize={0.2} color="#96ceb4" anchorX="center">
          Historical Development
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -0.3, 0]}>
          • Ancient Greeks: Discovery of irrational numbers (√2)
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -0.6, 0]}>
          • 16th Century: Introduction of complex numbers
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -0.9, 0]}>
          • 19th Century: Rigorous construction of real numbers (Dedekind cuts, Cauchy sequences)
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -1.2, 0]}>
          • Modern Era: Set theory and foundations of mathematics
        </Text>
      </group>

      {/* Applications */}
      <group position={[0, -12, 0]}>
        <Text fontSize={0.2} color="#feca57" anchorX="center">
          Real-world Applications
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -0.3, 0]}>
          • Engineering: Precision measurements and tolerances
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -0.6, 0]}>
          • Physics: Fundamental constants (c, h, G)
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -0.9, 0]}>
          • Computer Science: Floating-point arithmetic
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -1.2, 0]}>
          • Finance: Compound interest calculations
        </Text>
      </group>
    </group>
  );
};

export default RealNumbers;