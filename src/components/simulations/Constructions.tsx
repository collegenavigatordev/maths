import React, { useState, useMemo } from 'react';
import { Line, Text, Box } from '@react-three/drei';
import { Vector3 } from 'three';

interface ConstructionsProps {
  mode: 'guided' | 'free';
}

const Constructions: React.FC<ConstructionsProps> = ({ mode }) => {
  const [construction, setConstruction] = useState<'perpendicular' | 'angle_bisector' | 'parallel' | 'triangle'>('perpendicular');
  const [step, setStep] = useState(0);
  const [showConstruction, setShowConstruction] = useState(true);

  // Construction steps and points
  const constructionData = useMemo(() => {
    switch (construction) {
      case 'perpendicular':
        return {
          title: "Perpendicular Bisector",
          steps: [
            "Draw line segment AB",
            "Set compass to more than half of AB",
            "Draw arcs from A above and below AB",
            "Draw arcs from B above and below AB",
            "Connect intersection points"
          ],
          points: {
            A: new Vector3(-2, 0, 0),
            B: new Vector3(2, 0, 0),
            P1: new Vector3(0, 1.5, 0),
            P2: new Vector3(0, -1.5, 0),
            M: new Vector3(0, 0, 0)
          }
        };
        
      case 'angle_bisector':
        return {
          title: "Angle Bisector",
          steps: [
            "Draw angle ABC",
            "Place compass at B, draw arc cutting both rays",
            "From intersection points, draw equal arcs",
            "Connect B to arc intersection",
            "BD bisects angle ABC"
          ],
          points: {
            A: new Vector3(-2, 1, 0),
            B: new Vector3(0, 0, 0),
            C: new Vector3(2, 1, 0),
            D: new Vector3(0, 2, 0),
            P1: new Vector3(-1, 0.5, 0),
            P2: new Vector3(1, 0.5, 0)
          }
        };
        
      case 'parallel':
        return {
          title: "Parallel Lines",
          steps: [
            "Draw line AB",
            "Mark point P not on AB",
            "Draw line through P intersecting AB at Q",
            "Copy angle AQP at P",
            "Draw line through P parallel to AB"
          ],
          points: {
            A: new Vector3(-3, -1, 0),
            B: new Vector3(3, -1, 0),
            P: new Vector3(-1, 1, 0),
            Q: new Vector3(-1, -1, 0),
            R: new Vector3(2, 1, 0)
          }
        };
        
      case 'triangle':
        return {
          title: "Triangle Construction",
          steps: [
            "Draw base BC of given length",
            "Set compass to length AB",
            "Draw arc from B",
            "Set compass to length AC",
            "Draw arc from C intersecting first arc",
            "Connect A to B and C"
          ],
          points: {
            A: new Vector3(0, 2, 0),
            B: new Vector3(-2, 0, 0),
            C: new Vector3(2, 0, 0)
          }
        };
        
      default:
        return { title: "", steps: [], points: {} };
    }
  }, [construction]);

  return (
    <group>
      {/* Construction Selection */}
      <group position={[0, 4, 0]}>
        <Text fontSize={0.3} color="#4ecdc4" anchorX="center">
          Geometric Constructions
        </Text>
        
        <group position={[0, -0.8, 0]}>
          {[
            { key: 'perpendicular', label: 'Perpendicular' },
            { key: 'angle_bisector', label: 'Angle Bisector' },
            { key: 'parallel', label: 'Parallel Lines' },
            { key: 'triangle', label: 'Triangle' }
          ].map((item, index) => (
            <Box
              key={item.key}
              args={[2, 0.4, 0.2]}
              position={[index * 2.5 - 3.75, 0, 0]}
              onClick={() => {
                setConstruction(item.key as any);
                setStep(0);
              }}
            >
              <meshStandardMaterial 
                color={construction === item.key ? "#ff6b6b" : "#333333"}
                emissive={construction === item.key ? "#ff6b6b" : "#000000"}
                emissiveIntensity={0.2}
              />
              <Text position={[0, 0, 0.15]} fontSize={0.1} color="white" anchorX="center">
                {item.label}
              </Text>
            </Box>
          ))}
        </group>
      </group>

      {/* Main Construction Area */}
      <group position={[0, 1, 0]}>
        <Text fontSize={0.25} color="#feca57" anchorX="center" position={[0, 2, 0]}>
          {constructionData.title}
        </Text>
        
        {/* Construction Lines and Points */}
        {construction === 'perpendicular' && (
          <group>
            {/* Original line AB */}
            <Line 
              points={[constructionData.points.A, constructionData.points.B]} 
              color="#4ecdc4" 
              lineWidth={3}
            />
            
            {/* Construction arcs (shown as partial circles) */}
            {showConstruction && step >= 2 && (
              <>
                {/* Arc from A */}
                {Array.from({ length: 20 }, (_, i) => {
                  const angle = (i * Math.PI) / 10;
                  const radius = 1.8;
                  return (
                    <Line
                      key={`arcA${i}`}
                      points={[
                        new Vector3(constructionData.points.A.x + radius * Math.cos(angle), 
                                  constructionData.points.A.y + radius * Math.sin(angle), 0),
                        new Vector3(constructionData.points.A.x + radius * Math.cos(angle + 0.1), 
                                  constructionData.points.A.y + radius * Math.sin(angle + 0.1), 0)
                      ]}
                      color="#96ceb4"
                      lineWidth={1}
                    />
                  );
                })}
                
                {/* Arc from B */}
                {Array.from({ length: 20 }, (_, i) => {
                  const angle = (i * Math.PI) / 10;
                  const radius = 1.8;
                  return (
                    <Line
                      key={`arcB${i}`}
                      points={[
                        new Vector3(constructionData.points.B.x + radius * Math.cos(angle), 
                                  constructionData.points.B.y + radius * Math.sin(angle), 0),
                        new Vector3(constructionData.points.B.x + radius * Math.cos(angle + 0.1), 
                                  constructionData.points.B.y + radius * Math.sin(angle + 0.1), 0)
                      ]}
                      color="#96ceb4"
                      lineWidth={1}
                    />
                  );
                })}
              </>
            )}
            
            {/* Perpendicular bisector */}
            {step >= 4 && (
              <Line 
                points={[constructionData.points.P1, constructionData.points.P2]} 
                color="#ff6b6b" 
                lineWidth={3}
              />
            )}
            
            {/* Points */}
            <mesh position={constructionData.points.A}>
              <sphereGeometry args={[0.08]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <Text position={[constructionData.points.A.x - 0.3, constructionData.points.A.y - 0.3, 0]} 
                  fontSize={0.2} color="white">A</Text>
            
            <mesh position={constructionData.points.B}>
              <sphereGeometry args={[0.08]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <Text position={[constructionData.points.B.x + 0.3, constructionData.points.B.y - 0.3, 0]} 
                  fontSize={0.2} color="white">B</Text>
            
            {step >= 4 && (
              <>
                <mesh position={constructionData.points.M}>
                  <sphereGeometry args={[0.08]} />
                  <meshStandardMaterial color="#ff6b6b" />
                </mesh>
                <Text position={[constructionData.points.M.x + 0.3, constructionData.points.M.y, 0]} 
                      fontSize={0.2} color="#ff6b6b">M</Text>
              </>
            )}
          </group>
        )}

        {construction === 'angle_bisector' && (
          <group>
            {/* Angle rays */}
            <Line 
              points={[constructionData.points.B, constructionData.points.A]} 
              color="#4ecdc4" 
              lineWidth={3}
            />
            <Line 
              points={[constructionData.points.B, constructionData.points.C]} 
              color="#4ecdc4" 
              lineWidth={3}
            />
            
            {/* Angle bisector */}
            {step >= 4 && (
              <Line 
                points={[constructionData.points.B, constructionData.points.D]} 
                color="#ff6b6b" 
                lineWidth={3}
              />
            )}
            
            {/* Construction arcs */}
            {showConstruction && step >= 2 && (
              <>
                {/* Arc from B */}
                {Array.from({ length: 15 }, (_, i) => {
                  const angle = (i * Math.PI) / 30;
                  const radius = 1.2;
                  return (
                    <Line
                      key={`arc${i}`}
                      points={[
                        new Vector3(constructionData.points.B.x + radius * Math.cos(angle), 
                                  constructionData.points.B.y + radius * Math.sin(angle), 0),
                        new Vector3(constructionData.points.B.x + radius * Math.cos(angle + 0.1), 
                                  constructionData.points.B.y + radius * Math.sin(angle + 0.1), 0)
                      ]}
                      color="#96ceb4"
                      lineWidth={1}
                    />
                  );
                })}
              </>
            )}
            
            {/* Points */}
            <mesh position={constructionData.points.A}>
              <sphereGeometry args={[0.08]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <Text position={[constructionData.points.A.x - 0.3, constructionData.points.A.y, 0]} 
                  fontSize={0.2} color="white">A</Text>
            
            <mesh position={constructionData.points.B}>
              <sphereGeometry args={[0.08]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <Text position={[constructionData.points.B.x - 0.3, constructionData.points.B.y - 0.3, 0]} 
                  fontSize={0.2} color="white">B</Text>
            
            <mesh position={constructionData.points.C}>
              <sphereGeometry args={[0.08]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <Text position={[constructionData.points.C.x + 0.3, constructionData.points.C.y, 0]} 
                  fontSize={0.2} color="white">C</Text>
          </group>
        )}

        {construction === 'parallel' && (
          <group>
            {/* Original line AB */}
            <Line 
              points={[constructionData.points.A, constructionData.points.B]} 
              color="#4ecdc4" 
              lineWidth={3}
            />
            
            {/* Parallel line */}
            {step >= 4 && (
              <Line 
                points={[constructionData.points.P, constructionData.points.R]} 
                color="#ff6b6b" 
                lineWidth={3}
              />
            )}
            
            {/* Transversal */}
            {step >= 2 && (
              <Line 
                points={[constructionData.points.P, constructionData.points.Q]} 
                color="#feca57" 
                lineWidth={2}
              />
            )}
            
            {/* Points */}
            <mesh position={constructionData.points.A}>
              <sphereGeometry args={[0.08]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <Text position={[constructionData.points.A.x - 0.3, constructionData.points.A.y - 0.3, 0]} 
                  fontSize={0.2} color="white">A</Text>
            
            <mesh position={constructionData.points.B}>
              <sphereGeometry args={[0.08]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <Text position={[constructionData.points.B.x + 0.3, constructionData.points.B.y - 0.3, 0]} 
                  fontSize={0.2} color="white">B</Text>
            
            <mesh position={constructionData.points.P}>
              <sphereGeometry args={[0.08]} />
              <meshStandardMaterial color="#ff6b6b" />
            </mesh>
            <Text position={[constructionData.points.P.x - 0.3, constructionData.points.P.y + 0.3, 0]} 
                  fontSize={0.2} color="#ff6b6b">P</Text>
          </group>
        )}

        {construction === 'triangle' && (
          <group>
            {/* Triangle sides */}
            <Line 
              points={[constructionData.points.B, constructionData.points.C]} 
              color="#4ecdc4" 
              lineWidth={3}
            />
            
            {step >= 5 && (
              <>
                <Line 
                  points={[constructionData.points.A, constructionData.points.B]} 
                  color="#ff6b6b" 
                  lineWidth={3}
                />
                <Line 
                  points={[constructionData.points.A, constructionData.points.C]} 
                  color="#ff6b6b" 
                  lineWidth={3}
                />
              </>
            )}
            
            {/* Construction arcs */}
            {showConstruction && step >= 2 && (
              <>
                {/* Arc from B */}
                {Array.from({ length: 20 }, (_, i) => {
                  const angle = (i * Math.PI) / 20;
                  const radius = 2.8;
                  return (
                    <Line
                      key={`arcB${i}`}
                      points={[
                        new Vector3(constructionData.points.B.x + radius * Math.cos(angle), 
                                  constructionData.points.B.y + radius * Math.sin(angle), 0),
                        new Vector3(constructionData.points.B.x + radius * Math.cos(angle + 0.1), 
                                  constructionData.points.B.y + radius * Math.sin(angle + 0.1), 0)
                      ]}
                      color="#96ceb4"
                      lineWidth={1}
                    />
                  );
                })}
                
                {/* Arc from C */}
                {step >= 4 && Array.from({ length: 20 }, (_, i) => {
                  const angle = (i * Math.PI) / 20;
                  const radius = 2.8;
                  return (
                    <Line
                      key={`arcC${i}`}
                      points={[
                        new Vector3(constructionData.points.C.x + radius * Math.cos(angle), 
                                  constructionData.points.C.y + radius * Math.sin(angle), 0),
                        new Vector3(constructionData.points.C.x + radius * Math.cos(angle + 0.1), 
                                  constructionData.points.C.y + radius * Math.sin(angle + 0.1), 0)
                      ]}
                      color="#96ceb4"
                      lineWidth={1}
                    />
                  );
                })}
              </>
            )}
            
            {/* Points */}
            <mesh position={constructionData.points.B}>
              <sphereGeometry args={[0.08]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <Text position={[constructionData.points.B.x - 0.3, constructionData.points.B.y - 0.3, 0]} 
                  fontSize={0.2} color="white">B</Text>
            
            <mesh position={constructionData.points.C}>
              <sphereGeometry args={[0.08]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <Text position={[constructionData.points.C.x + 0.3, constructionData.points.C.y - 0.3, 0]} 
                  fontSize={0.2} color="white">C</Text>
            
            {step >= 5 && (
              <>
                <mesh position={constructionData.points.A}>
                  <sphereGeometry args={[0.08]} />
                  <meshStandardMaterial color="#ff6b6b" />
                </mesh>
                <Text position={[constructionData.points.A.x, constructionData.points.A.y + 0.3, 0]} 
                      fontSize={0.2} color="#ff6b6b">A</Text>
              </>
            )}
          </group>
        )}
      </group>

      {/* Steps Panel */}
      <group position={[7, 1, 0]}>
        <Box args={[4, 8, 0.1]}>
          <meshBasicMaterial color="#000000" transparent opacity={0.8} />
        </Box>
        
        <Text position={[0, 3.5, 0.1]} fontSize={0.25} color="#4ecdc4" anchorX="center">
          Construction Steps
        </Text>
        
        <Text position={[0, 3, 0.1]} fontSize={0.2} color="#ff6b6b" anchorX="center">
          {constructionData.title}
        </Text>
        
        {constructionData.steps.map((stepText, index) => (
          <Text 
            key={index}
            position={[0, 2.5 - index * 0.4, 0.1]} 
            fontSize={0.12} 
            color={index <= step ? "#feca57" : "#666666"} 
            anchorX="center"
          >
            {index + 1}. {stepText}
          </Text>
        ))}
        
        <Text position={[0, -0.5, 0.1]} fontSize={0.2} color="#96ceb4" anchorX="center">
          Tools Required
        </Text>
        <Text position={[0, -0.8, 0.1]} fontSize={0.12} color="white" anchorX="center">
          • Compass
        </Text>
        <Text position={[0, -1, 0.1]} fontSize={0.12} color="white" anchorX="center">
          • Straightedge (ruler)
        </Text>
        <Text position={[0, -1.2, 0.1]} fontSize={0.12} color="white" anchorX="center">
          • Pencil
        </Text>
        
        <Text position={[0, -1.6, 0.1]} fontSize={0.2} color="#45b7d1" anchorX="center">
          Properties
        </Text>
        
        {construction === 'perpendicular' && (
          <>
            <Text position={[0, -1.9, 0.1]} fontSize={0.1} color="white" anchorX="center">
              • Perpendicular bisector passes through midpoint
            </Text>
            <Text position={[0, -2.1, 0.1]} fontSize={0.1} color="white" anchorX="center">
              • Makes 90° angle with original line
            </Text>
            <Text position={[0, -2.3, 0.1]} fontSize={0.1} color="white" anchorX="center">
              • Every point on bisector is equidistant from A and B
            </Text>
          </>
        )}
        
        {construction === 'angle_bisector' && (
          <>
            <Text position={[0, -1.9, 0.1]} fontSize={0.1} color="white" anchorX="center">
              • Divides angle into two equal parts
            </Text>
            <Text position={[0, -2.1, 0.1]} fontSize={0.1} color="white" anchorX="center">
              • Every point on bisector is equidistant from both rays
            </Text>
            <Text position={[0, -2.3, 0.1]} fontSize={0.1} color="white" anchorX="center">
              • Used in triangle constructions
            </Text>
          </>
        )}
        
        {construction === 'parallel' && (
          <>
            <Text position={[0, -1.9, 0.1]} fontSize={0.1} color="white" anchorX="center">
              • Lines never intersect
            </Text>
            <Text position={[0, -2.1, 0.1]} fontSize={0.1} color="white" anchorX="center">
              • Corresponding angles are equal
            </Text>
            <Text position={[0, -2.3, 0.1]} fontSize={0.1} color="white" anchorX="center">
              • Alternate angles are equal
            </Text>
          </>
        )}
        
        {construction === 'triangle' && (
          <>
            <Text position={[0, -1.9, 0.1]} fontSize={0.1} color="white" anchorX="center">
              • SSS construction (three sides given)
            </Text>
            <Text position={[0, -2.1, 0.1]} fontSize={0.1} color="white" anchorX="center">
              • Unique triangle for given side lengths
            </Text>
            <Text position={[0, -2.3, 0.1]} fontSize={0.1} color="white" anchorX="center">
              • Triangle inequality must be satisfied
            </Text>
          </>
        )}
      </group>

      {/* Interactive Controls */}
      {mode === 'free' && (
        <group position={[-7, 0, 0]}>
          <Box args={[3, 6, 0.1]}>
            <meshBasicMaterial color="#000000" transparent opacity={0.8} />
          </Box>
          
          <Text position={[0, 2.5, 0.1]} fontSize={0.2} color="white" anchorX="center">
            Construction Controls
          </Text>
          
          <Text position={[0, 2, 0.1]} fontSize={0.15} color="#feca57" anchorX="center">
            Current Step: {step + 1}
          </Text>
          
          <Box
            args={[2, 0.3, 0.1]}
            position={[0, 1.5, 0.1]}
            onClick={() => setStep(prev => (prev + 1) % constructionData.steps.length)}
          >
            <meshStandardMaterial color="#4ecdc4" />
          </Box>
          <Text position={[0, 1.5, 0.15]} fontSize={0.12} color="white" anchorX="center">
            Next Step
          </Text>
          
          <Box
            args={[2, 0.3, 0.1]}
            position={[0, 1, 0.1]}
            onClick={() => setStep(0)}
          >
            <meshStandardMaterial color="#ff6b6b" />
          </Box>
          <Text position={[0, 1, 0.15]} fontSize={0.12} color="white" anchorX="center">
            Reset
          </Text>
          
          <Box
            args={[2, 0.3, 0.1]}
            position={[0, 0.5, 0.1]}
            onClick={() => setShowConstruction(!showConstruction)}
          >
            <meshStandardMaterial color={showConstruction ? "#96ceb4" : "#333333"} />
          </Box>
          <Text position={[0, 0.5, 0.15]} fontSize={0.12} color="white" anchorX="center">
            Toggle Construction Lines
          </Text>
          
          <Text position={[0, -0.2, 0.1]} fontSize={0.15} color="white" anchorX="center">
            Step Navigation
          </Text>
          
          {constructionData.steps.map((_, index) => (
            <Box
              key={index}
              args={[0.3, 0.25, 0.1]}
              position={[-1.2 + index * 0.6, -0.7, 0.1]}
              onClick={() => setStep(index)}
            >
              <meshStandardMaterial color={step === index ? "#feca57" : "#333333"} />
              <Text position={[0, 0, 0.1]} fontSize={0.1} color="white" anchorX="center">
                {index + 1}
              </Text>
            </Box>
          ))}
        </group>
      )}

      {/* Real-world Applications */}
      <group position={[0, -3, 0]}>
        <Text fontSize={0.2} color="#96ceb4" anchorX="center">
          Real-world Applications
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -0.3, 0]}>
          • Architecture: Building layouts, structural design
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -0.6, 0]}>
          • Engineering: Bridge construction, road planning
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -0.9, 0]}>
          • Art and Design: Geometric patterns, symmetry
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -1.2, 0]}>
          • Navigation: Map making, GPS systems
        </Text>
      </group>
    </group>
  );
};

export default Constructions;