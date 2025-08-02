import React, { useState, useMemo } from 'react';
import { Text, Box, Sphere, Cylinder } from '@react-three/drei';

interface SurfaceAreasVolumesProps {
  mode: 'guided' | 'free';
}

const SurfaceAreasVolumes: React.FC<SurfaceAreasVolumesProps> = ({ mode }) => {
  const [shape, setShape] = useState<'cube' | 'sphere' | 'cylinder' | 'cone'>('cube');
  const [dimensions, setDimensions] = useState({ length: 2, width: 2, height: 2, radius: 1 });

  // Calculate surface area and volume based on shape
  const calculations = useMemo(() => {
    const { length, width, height, radius } = dimensions;
    
    switch (shape) {
      case 'cube':
        const cubeSA = 6 * length * length;
        const cubeVol = length * length * length;
        return {
          surfaceArea: cubeSA,
          volume: cubeVol,
          formula: `SA = 6a², V = a³`,
          details: `SA = 6 × ${length}² = ${cubeSA}, V = ${length}³ = ${cubeVol}`
        };
        
      case 'sphere':
        const sphereSA = 4 * Math.PI * radius * radius;
        const sphereVol = (4/3) * Math.PI * radius * radius * radius;
        return {
          surfaceArea: sphereSA,
          volume: sphereVol,
          formula: `SA = 4πr², V = (4/3)πr³`,
          details: `SA = 4π × ${radius}² = ${sphereSA.toFixed(2)}, V = (4/3)π × ${radius}³ = ${sphereVol.toFixed(2)}`
        };
        
      case 'cylinder':
        const cylSA = 2 * Math.PI * radius * (radius + height);
        const cylVol = Math.PI * radius * radius * height;
        return {
          surfaceArea: cylSA,
          volume: cylVol,
          formula: `SA = 2πr(r+h), V = πr²h`,
          details: `SA = 2π × ${radius} × (${radius}+${height}) = ${cylSA.toFixed(2)}, V = π × ${radius}² × ${height} = ${cylVol.toFixed(2)}`
        };
        
      case 'cone':
        const slantHeight = Math.sqrt(radius * radius + height * height);
        const coneSA = Math.PI * radius * (radius + slantHeight);
        const coneVol = (1/3) * Math.PI * radius * radius * height;
        return {
          surfaceArea: coneSA,
          volume: coneVol,
          formula: `SA = πr(r+l), V = (1/3)πr²h`,
          details: `l = ${slantHeight.toFixed(2)}, SA = π × ${radius} × (${radius}+${slantHeight.toFixed(2)}) = ${coneSA.toFixed(2)}, V = (1/3)π × ${radius}² × ${height} = ${coneVol.toFixed(2)}`
        };
        
      default:
        return { surfaceArea: 0, volume: 0, formula: '', details: '' };
    }
  }, [shape, dimensions]);

  return (
    <group>
      {/* 3D Shape Display */}
      <group position={[0, 2, 0]}>
        {shape === 'cube' && (
          <Box args={[dimensions.length, dimensions.length, dimensions.length]}>
            <meshStandardMaterial 
              color="#4ecdc4" 
              transparent 
              opacity={0.7}
              wireframe={false}
            />
          </Box>
        )}
        
        {shape === 'sphere' && (
          <Sphere args={[dimensions.radius, 32, 32]}>
            <meshStandardMaterial 
              color="#ff6b6b" 
              transparent 
              opacity={0.7}
            />
          </Sphere>
        )}
        
        {shape === 'cylinder' && (
          <Cylinder args={[dimensions.radius, dimensions.radius, dimensions.height, 32]}>
            <meshStandardMaterial 
              color="#feca57" 
              transparent 
              opacity={0.7}
            />
          </Cylinder>
        )}
        
        {shape === 'cone' && (
          <Cylinder args={[0, dimensions.radius, dimensions.height, 32]}>
            <meshStandardMaterial 
              color="#96ceb4" 
              transparent 
              opacity={0.7}
            />
          </Cylinder>
        )}
        
        {/* Dimension labels */}
        {shape === 'cube' && (
          <>
            <Text position={[dimensions.length/2 + 0.5, 0, 0]} fontSize={0.2} color="white">
              a = {dimensions.length}
            </Text>
          </>
        )}
        
        {(shape === 'sphere') && (
          <Text position={[dimensions.radius + 0.5, 0, 0]} fontSize={0.2} color="white">
            r = {dimensions.radius}
          </Text>
        )}
        
        {(shape === 'cylinder' || shape === 'cone') && (
          <>
            <Text position={[dimensions.radius + 0.5, 0, 0]} fontSize={0.2} color="white">
              r = {dimensions.radius}
            </Text>
            <Text position={[0, dimensions.height/2 + 0.5, 0]} fontSize={0.2} color="white">
              h = {dimensions.height}
            </Text>
          </>
        )}
      </group>

      {/* Shape Selection */}
      <group position={[0, 4, 0]}>
        <Text fontSize={0.3} color="#4ecdc4" anchorX="center">
          3D Shapes: Surface Areas & Volumes
        </Text>
        
        <group position={[0, -0.8, 0]}>
          {['cube', 'sphere', 'cylinder', 'cone'].map((shapeType, index) => (
            <Box
              key={shapeType}
              args={[1.5, 0.4, 0.2]}
              position={[index * 2 - 3, 0, 0]}
              onClick={() => setShape(shapeType as any)}
            >
              <meshStandardMaterial 
                color={shape === shapeType ? "#ff6b6b" : "#333333"}
                emissive={shape === shapeType ? "#ff6b6b" : "#000000"}
                emissiveIntensity={0.2}
              />
              <Text position={[0, 0, 0.15]} fontSize={0.12} color="white" anchorX="center">
                {shapeType.charAt(0).toUpperCase() + shapeType.slice(1)}
              </Text>
            </Box>
          ))}
        </group>
      </group>

      {/* Calculations Panel */}
      <group position={[7, 1, 0]}>
        <Box args={[4, 8, 0.1]}>
          <meshBasicMaterial color="#000000" transparent opacity={0.8} />
        </Box>
        
        <Text position={[0, 3.5, 0.1]} fontSize={0.25} color="#4ecdc4" anchorX="center">
          Calculations
        </Text>
        
        <Text position={[0, 3, 0.1]} fontSize={0.2} color="#ff6b6b" anchorX="center">
          {shape.charAt(0).toUpperCase() + shape.slice(1)}
        </Text>
        
        <Text position={[0, 2.6, 0.1]} fontSize={0.15} color="#feca57" anchorX="center">
          Formulas
        </Text>
        <Text position={[0, 2.3, 0.1]} fontSize={0.12} color="white" anchorX="center">
          {calculations.formula}
        </Text>
        
        <Text position={[0, 1.9, 0.1]} fontSize={0.15} color="#96ceb4" anchorX="center">
          Surface Area
        </Text>
        <Text position={[0, 1.6, 0.1]} fontSize={0.12} color="white" anchorX="center">
          {calculations.surfaceArea.toFixed(2)} units²
        </Text>
        
        <Text position={[0, 1.2, 0.1]} fontSize={0.15} color="#45b7d1" anchorX="center">
          Volume
        </Text>
        <Text position={[0, 0.9, 0.1]} fontSize={0.12} color="white" anchorX="center">
          {calculations.volume.toFixed(2)} units³
        </Text>
        
        <Text position={[0, 0.5, 0.1]} fontSize={0.15} color="white" anchorX="center">
          Step-by-step
        </Text>
        <Text position={[0, 0.2, 0.1]} fontSize={0.1} color="#888888" anchorX="center">
          {calculations.details}
        </Text>
        
        {/* Shape-specific properties */}
        {shape === 'cube' && (
          <>
            <Text position={[0, -0.2, 0.1]} fontSize={0.15} color="#ff9ff3" anchorX="center">
              Cube Properties
            </Text>
            <Text position={[0, -0.5, 0.1]} fontSize={0.1} color="white" anchorX="center">
              • All edges equal: a = {dimensions.length}
            </Text>
            <Text position={[0, -0.7, 0.1]} fontSize={0.1} color="white" anchorX="center">
              • 6 square faces
            </Text>
            <Text position={[0, -0.9, 0.1]} fontSize={0.1} color="white" anchorX="center">
              • 12 edges, 8 vertices
            </Text>
            <Text position={[0, -1.1, 0.1]} fontSize={0.1} color="white" anchorX="center">
              • Face diagonal = a√2
            </Text>
            <Text position={[0, -1.3, 0.1]} fontSize={0.1} color="white" anchorX="center">
              • Space diagonal = a√3
            </Text>
          </>
        )}
        
        {shape === 'sphere' && (
          <>
            <Text position={[0, -0.2, 0.1]} fontSize={0.15} color="#ff9ff3" anchorX="center">
              Sphere Properties
            </Text>
            <Text position={[0, -0.5, 0.1]} fontSize={0.1} color="white" anchorX="center">
              • Radius: r = {dimensions.radius}
            </Text>
            <Text position={[0, -0.7, 0.1]} fontSize={0.1} color="white" anchorX="center">
              • Diameter: d = 2r = {2 * dimensions.radius}
            </Text>
            <Text position={[0, -0.9, 0.1]} fontSize={0.1} color="white" anchorX="center">
              • Great circle area = πr²
            </Text>
            <Text position={[0, -1.1, 0.1]} fontSize={0.1} color="white" anchorX="center">
              • Circumference = 2πr
            </Text>
          </>
        )}
        
        {shape === 'cylinder' && (
          <>
            <Text position={[0, -0.2, 0.1]} fontSize={0.15} color="#ff9ff3" anchorX="center">
              Cylinder Properties
            </Text>
            <Text position={[0, -0.5, 0.1]} fontSize={0.1} color="white" anchorX="center">
              • Base radius: r = {dimensions.radius}
            </Text>
            <Text position={[0, -0.7, 0.1]} fontSize={0.1} color="white" anchorX="center">
              • Height: h = {dimensions.height}
            </Text>
            <Text position={[0, -0.9, 0.1]} fontSize={0.1} color="white" anchorX="center">
              • Base area = πr² = {(Math.PI * dimensions.radius * dimensions.radius).toFixed(2)}
            </Text>
            <Text position={[0, -1.1, 0.1]} fontSize={0.1} color="white" anchorX="center">
              • Curved surface = 2πrh
            </Text>
          </>
        )}
        
        {shape === 'cone' && (
          <>
            <Text position={[0, -0.2, 0.1]} fontSize={0.15} color="#ff9ff3" anchorX="center">
              Cone Properties
            </Text>
            <Text position={[0, -0.5, 0.1]} fontSize={0.1} color="white" anchorX="center">
              • Base radius: r = {dimensions.radius}
            </Text>
            <Text position={[0, -0.7, 0.1]} fontSize={0.1} color="white" anchorX="center">
              • Height: h = {dimensions.height}
            </Text>
            <Text position={[0, -0.9, 0.1]} fontSize={0.1} color="white" anchorX="center">
              • Slant height: l = {Math.sqrt(dimensions.radius * dimensions.radius + dimensions.height * dimensions.height).toFixed(2)}
            </Text>
            <Text position={[0, -1.1, 0.1]} fontSize={0.1} color="white" anchorX="center">
              • Base area = πr²
            </Text>
            <Text position={[0, -1.3, 0.1]} fontSize={0.1} color="white" anchorX="center">
              • Curved surface = πrl
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
            Dimension Controls
          </Text>
          
          {shape === 'cube' && (
            <group>
              <Text position={[0, 2, 0.1]} fontSize={0.15} color="#feca57" anchorX="center">
                Side Length (a)
              </Text>
              <Box
                args={[0.3, 0.3, 0.1]}
                position={[0, 1.6, 0.1]}
                onClick={() => setDimensions(prev => ({ ...prev, length: prev.length >= 4 ? 1 : prev.length + 0.5 }))}
              >
                <meshStandardMaterial color="#feca57" />
              </Box>
              <Text position={[0.5, 1.6, 0.1]} fontSize={0.15} color="white">
                {dimensions.length}
              </Text>
            </group>
          )}
          
          {(shape === 'sphere') && (
            <group>
              <Text position={[0, 2, 0.1]} fontSize={0.15} color="#ff6b6b" anchorX="center">
                Radius (r)
              </Text>
              <Box
                args={[0.3, 0.3, 0.1]}
                position={[0, 1.6, 0.1]}
                onClick={() => setDimensions(prev => ({ ...prev, radius: prev.radius >= 3 ? 0.5 : prev.radius + 0.5 }))}
              >
                <meshStandardMaterial color="#ff6b6b" />
              </Box>
              <Text position={[0.5, 1.6, 0.1]} fontSize={0.15} color="white">
                {dimensions.radius}
              </Text>
            </group>
          )}
          
          {(shape === 'cylinder' || shape === 'cone') && (
            <group>
              <Text position={[0, 2, 0.1]} fontSize={0.15} color="#ff6b6b" anchorX="center">
                Radius (r)
              </Text>
              <Box
                args={[0.3, 0.3, 0.1]}
                position={[0, 1.6, 0.1]}
                onClick={() => setDimensions(prev => ({ ...prev, radius: prev.radius >= 3 ? 0.5 : prev.radius + 0.5 }))}
              >
                <meshStandardMaterial color="#ff6b6b" />
              </Box>
              <Text position={[0.5, 1.6, 0.1]} fontSize={0.15} color="white">
                {dimensions.radius}
              </Text>
              
              <Text position={[0, 1, 0.1]} fontSize={0.15} color="#96ceb4" anchorX="center">
                Height (h)
              </Text>
              <Box
                args={[0.3, 0.3, 0.1]}
                position={[0, 0.6, 0.1]}
                onClick={() => setDimensions(prev => ({ ...prev, height: prev.height >= 4 ? 1 : prev.height + 0.5 }))}
              >
                <meshStandardMaterial color="#96ceb4" />
              </Box>
              <Text position={[0.5, 0.6, 0.1]} fontSize={0.15} color="white">
                {dimensions.height}
              </Text>
            </group>
          )}
        </group>
      )}

      {/* Real-world Applications */}
      <group position={[0, -3, 0]}>
        <Text fontSize={0.2} color="#96ceb4" anchorX="center">
          Real-world Applications
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -0.3, 0]}>
          • Architecture: Building design and material calculation
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -0.6, 0]}>
          • Manufacturing: Packaging and container design
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -0.9, 0]}>
          • Engineering: Tank capacity and structural analysis
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -1.2, 0]}>
          • Medicine: Dosage calculations and organ volume
        </Text>
      </group>
    </group>
  );
};

export default SurfaceAreasVolumes;