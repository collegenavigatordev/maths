import React, { useState, useMemo } from 'react';
import { Line, Text, Box } from '@react-three/drei';
import { Vector3 } from 'three';

interface TrigonometryApplicationsProps {
  mode: 'guided' | 'free';
}

const TrigonometryApplications: React.FC<TrigonometryApplicationsProps> = ({ mode }) => {
  const [application, setApplication] = useState<'height' | 'distance' | 'navigation' | 'waves'>('height');
  const [parameters, setParameters] = useState({
    angle: 30, // degrees
    distance: 50, // meters
    height: 20, // meters
    observerHeight: 1.5 // meters
  });

  // Calculate based on application
  const calculations = useMemo(() => {
    const { angle, distance, height, observerHeight } = parameters;
    const angleRad = (angle * Math.PI) / 180;
    
    switch (application) {
      case 'height':
        // Height of building using angle of elevation
        const buildingHeight = distance * Math.tan(angleRad) + observerHeight;
        return {
          result: buildingHeight,
          formula: 'h = d × tan(θ) + observer height',
          description: `Building height = ${distance}m × tan(${angle}°) + ${observerHeight}m = ${buildingHeight.toFixed(2)}m`
        };
        
      case 'distance':
        // Distance to object using angle of depression
        const horizontalDistance = height / Math.tan(angleRad);
        return {
          result: horizontalDistance,
          formula: 'd = h / tan(θ)',
          description: `Distance = ${height}m / tan(${angle}°) = ${horizontalDistance.toFixed(2)}m`
        };
        
      case 'navigation':
        // Navigation using bearing
        const northComponent = distance * Math.cos(angleRad);
        const eastComponent = distance * Math.sin(angleRad);
        return {
          result: { north: northComponent, east: eastComponent },
          formula: 'N = d × cos(θ), E = d × sin(θ)',
          description: `North: ${northComponent.toFixed(2)}m, East: ${eastComponent.toFixed(2)}m`
        };
        
      case 'waves':
        // Wave motion
        const amplitude = 2;
        const frequency = 0.5;
        const waveHeight = amplitude * Math.sin(angleRad * frequency);
        return {
          result: waveHeight,
          formula: 'y = A × sin(ωt)',
          description: `Wave height = ${amplitude} × sin(${(angleRad * frequency).toFixed(2)}) = ${waveHeight.toFixed(2)}`
        };
        
      default:
        return { result: 0, formula: '', description: '' };
    }
  }, [application, parameters]);

  // Generate visualization points
  const visualizationPoints = useMemo(() => {
    const { angle, distance, height } = parameters;
    const angleRad = (angle * Math.PI) / 180;
    
    switch (application) {
      case 'height':
        return {
          ground: [new Vector3(0, 0, 0), new Vector3(distance * 0.1, 0, 0)],
          building: [new Vector3(distance * 0.1, 0, 0), new Vector3(distance * 0.1, calculations.result * 0.1, 0)],
          sightLine: [new Vector3(0, parameters.observerHeight * 0.1, 0), new Vector3(distance * 0.1, calculations.result * 0.1, 0)]
        };
        
      case 'distance':
        return {
          vertical: [new Vector3(0, 0, 0), new Vector3(0, height * 0.1, 0)],
          horizontal: [new Vector3(0, 0, 0), new Vector3(calculations.result * 0.1, 0, 0)],
          sightLine: [new Vector3(0, height * 0.1, 0), new Vector3(calculations.result * 0.1, 0, 0)]
        };
        
      case 'navigation':
        const result = calculations.result as { north: number; east: number };
        return {
          path: [new Vector3(0, 0, 0), new Vector3(result.east * 0.1, result.north * 0.1, 0)],
          north: [new Vector3(0, 0, 0), new Vector3(0, result.north * 0.1, 0)],
          east: [new Vector3(0, 0, 0), new Vector3(result.east * 0.1, 0, 0)]
        };
        
      case 'waves':
        const wavePoints = [];
        for (let x = 0; x <= 10; x += 0.2) {
          const y = 2 * Math.sin(x * 0.5 + angle * Math.PI / 180);
          wavePoints.push(new Vector3(x - 5, y, 0));
        }
        return { wave: wavePoints };
        
      default:
        return {};
    }
  }, [application, parameters, calculations]);

  return (
    <group>
      {/* Application Selection */}
      <group position={[0, 4, 0]}>
        <Text fontSize={0.3} color="#4ecdc4" anchorX="center">
          Trigonometry Applications
        </Text>
        
        <group position={[0, -0.8, 0]}>
          {[
            { key: 'height', label: 'Height Measurement' },
            { key: 'distance', label: 'Distance Finding' },
            { key: 'navigation', label: 'Navigation' },
            { key: 'waves', label: 'Wave Motion' }
          ].map((app, index) => (
            <Box
              key={app.key}
              args={[2, 0.4, 0.2]}
              position={[index * 2.5 - 3.75, 0, 0]}
              onClick={() => setApplication(app.key as any)}
            >
              <meshStandardMaterial 
                color={application === app.key ? "#ff6b6b" : "#333333"}
                emissive={application === app.key ? "#ff6b6b" : "#000000"}
                emissiveIntensity={0.2}
              />
              <Text position={[0, 0, 0.15]} fontSize={0.1} color="white" anchorX="center">
                {app.label}
              </Text>
            </Box>
          ))}
        </group>
      </group>

      {/* Visualization Area */}
      <group position={[0, 1, 0]}>
        {application === 'height' && (
          <group>
            <Text position={[0, 2, 0]} fontSize={0.25} color="#feca57" anchorX="center">
              Measuring Building Height
            </Text>
            
            {/* Ground line */}
            <Line points={visualizationPoints.ground} color="#666666" lineWidth={3} />
            
            {/* Building */}
            <Line points={visualizationPoints.building} color="#4ecdc4" lineWidth={4} />
            
            {/* Sight line */}
            <Line points={visualizationPoints.sightLine} color="#ff6b6b" lineWidth={2} />
            
            {/* Observer */}
            <mesh position={[0, parameters.observerHeight * 0.1, 0]}>
              <sphereGeometry args={[0.1]} />
              <meshStandardMaterial color="#feca57" />
            </mesh>
            
            {/* Labels */}
            <Text position={[parameters.distance * 0.05, -0.3, 0]} fontSize={0.15} color="white" anchorX="center">
              Distance: {parameters.distance}m
            </Text>
            <Text position={[parameters.distance * 0.1 + 0.5, calculations.result * 0.05, 0]} fontSize={0.15} color="#4ecdc4">
              Height: {calculations.result.toFixed(1)}m
            </Text>
            <Text position={[0.5, 0.5, 0]} fontSize={0.15} color="#ff6b6b">
              {parameters.angle}°
            </Text>
          </group>
        )}

        {application === 'distance' && (
          <group>
            <Text position={[0, 2, 0]} fontSize={0.25} color="#feca57" anchorX="center">
              Finding Distance (Angle of Depression)
            </Text>
            
            {/* Vertical line */}
            <Line points={visualizationPoints.vertical} color="#4ecdc4" lineWidth={4} />
            
            {/* Horizontal line */}
            <Line points={visualizationPoints.horizontal} color="#666666" lineWidth={3} />
            
            {/* Sight line */}
            <Line points={visualizationPoints.sightLine} color="#ff6b6b" lineWidth={2} />
            
            {/* Observer at height */}
            <mesh position={[0, parameters.height * 0.1, 0]}>
              <sphereGeometry args={[0.1]} />
              <meshStandardMaterial color="#feca57" />
            </mesh>
            
            {/* Labels */}
            <Text position={[-0.5, parameters.height * 0.05, 0]} fontSize={0.15} color="#4ecdc4">
              Height: {parameters.height}m
            </Text>
            <Text position={[calculations.result * 0.05, -0.3, 0]} fontSize={0.15} color="white" anchorX="center">
              Distance: {calculations.result.toFixed(1)}m
            </Text>
            <Text position={[1, parameters.height * 0.08, 0]} fontSize={0.15} color="#ff6b6b">
              {parameters.angle}°
            </Text>
          </group>
        )}

        {application === 'navigation' && (
          <group>
            <Text position={[0, 2, 0]} fontSize={0.25} color="#feca57" anchorX="center">
              Navigation Using Bearings
            </Text>
            
            {/* Coordinate axes */}
            <Line points={[new Vector3(0, -3, 0), new Vector3(0, 3, 0)]} color="#666666" lineWidth={1} />
            <Line points={[new Vector3(-3, 0, 0), new Vector3(3, 0, 0)]} color="#666666" lineWidth={1} />
            
            {/* Path */}
            <Line points={visualizationPoints.path} color="#ff6b6b" lineWidth={4} />
            
            {/* Components */}
            <Line points={visualizationPoints.north} color="#4ecdc4" lineWidth={2} />
            <Line points={visualizationPoints.east} color="#96ceb4" lineWidth={2} />
            
            {/* Labels */}
            <Text position={[0, 2.5, 0]} fontSize={0.15} color="white">N</Text>
            <Text position={[2.5, 0, 0]} fontSize={0.15} color="white">E</Text>
            
            const result = calculations.result as { north: number; east: number };
            <Text position={[-0.5, result.north * 0.05, 0]} fontSize={0.12} color="#4ecdc4">
              N: {result.north.toFixed(1)}m
            </Text>
            <Text position={[result.east * 0.05, -0.3, 0]} fontSize={0.12} color="#96ceb4">
              E: {result.east.toFixed(1)}m
            </Text>
            <Text position={[0.5, 0.5, 0]} fontSize={0.15} color="#ff6b6b">
              {parameters.angle}°
            </Text>
          </group>
        )}

        {application === 'waves' && (
          <group>
            <Text position={[0, 2, 0]} fontSize={0.25} color="#feca57" anchorX="center">
              Wave Motion (Simple Harmonic)
            </Text>
            
            {/* Wave */}
            <Line points={visualizationPoints.wave} color="#4ecdc4" lineWidth={3} />
            
            {/* Axes */}
            <Line points={[new Vector3(-5, 0, 0), new Vector3(5, 0, 0)]} color="#666666" lineWidth={1} />
            <Line points={[new Vector3(0, -3, 0), new Vector3(0, 3, 0)]} color="#666666" lineWidth={1} />
            
            {/* Current point */}
            <mesh position={[parameters.angle * 0.1 - 2, calculations.result, 0]}>
              <sphereGeometry args={[0.1]} />
              <meshStandardMaterial color="#ff6b6b" />
            </mesh>
            
            {/* Labels */}
            <Text position={[0, -2.5, 0]} fontSize={0.15} color="white" anchorX="center">
              Time/Position
            </Text>
            <Text position={[-4.5, 0, 0]} fontSize={0.15} color="white">
              Amplitude
            </Text>
          </group>
        )}
      </group>

      {/* Calculations Panel */}
      <group position={[8, 1, 0]}>
        <Box args={[4, 8, 0.1]}>
          <meshBasicMaterial color="#000000" transparent opacity={0.8} />
        </Box>
        
        <Text position={[0, 3.5, 0.1]} fontSize={0.25} color="#4ecdc4" anchorX="center">
          Calculations
        </Text>
        
        <Text position={[0, 3, 0.1]} fontSize={0.2} color="#ff6b6b" anchorX="center">
          {application.charAt(0).toUpperCase() + application.slice(1)} Problem
        </Text>
        
        <Text position={[0, 2.6, 0.1]} fontSize={0.15} color="#feca57" anchorX="center">
          Formula
        </Text>
        <Text position={[0, 2.3, 0.1]} fontSize={0.12} color="white" anchorX="center">
          {calculations.formula}
        </Text>
        
        <Text position={[0, 1.9, 0.1]} fontSize={0.15} color="#96ceb4" anchorX="center">
          Given Values
        </Text>
        <Text position={[0, 1.6, 0.1]} fontSize={0.12} color="white" anchorX="center">
          Angle: {parameters.angle}°
        </Text>
        {application !== 'waves' && (
          <>
            <Text position={[0, 1.4, 0.1]} fontSize={0.12} color="white" anchorX="center">
              {application === 'height' ? `Distance: ${parameters.distance}m` : 
               application === 'distance' ? `Height: ${parameters.height}m` :
               `Distance: ${parameters.distance}m`}
            </Text>
          </>
        )}
        
        <Text position={[0, 1, 0.1]} fontSize={0.15} color="#45b7d1" anchorX="center">
          Solution
        </Text>
        <Text position={[0, 0.7, 0.1]} fontSize={0.12} color="white" anchorX="center">
          {calculations.description}
        </Text>
        
        <Text position={[0, 0.3, 0.1]} fontSize={0.2} color="#ff9ff3" anchorX="center">
          Applications
        </Text>
        
        {application === 'height' && (
          <>
            <Text position={[0, 0, 0.1]} fontSize={0.1} color="white" anchorX="center">
              • Surveying and construction
            </Text>
            <Text position={[0, -0.2, 0.1]} fontSize={0.1} color="white" anchorX="center">
              • Architecture and engineering
            </Text>
            <Text position={[0, -0.4, 0.1]} fontSize={0.1} color="white" anchorX="center">
              • Tree height measurement
            </Text>
          </>
        )}
        
        {application === 'distance' && (
          <>
            <Text position={[0, 0, 0.1]} fontSize={0.1} color="white" anchorX="center">
              • Aviation and flight planning
            </Text>
            <Text position={[0, -0.2, 0.1]} fontSize={0.1} color="white" anchorX="center">
              • Maritime navigation
            </Text>
            <Text position={[0, -0.4, 0.1]} fontSize={0.1} color="white" anchorX="center">
              • Rescue operations
            </Text>
          </>
        )}
        
        {application === 'navigation' && (
          <>
            <Text position={[0, 0, 0.1]} fontSize={0.1} color="white" anchorX="center">
              • GPS and mapping systems
            </Text>
            <Text position={[0, -0.2, 0.1]} fontSize={0.1} color="white" anchorX="center">
              • Ship and aircraft navigation
            </Text>
            <Text position={[0, -0.4, 0.1]} fontSize={0.1} color="white" anchorX="center">
              • Hiking and orienteering
            </Text>
          </>
        )}
        
        {application === 'waves' && (
          <>
            <Text position={[0, 0, 0.1]} fontSize={0.1} color="white" anchorX="center">
              • Sound and light waves
            </Text>
            <Text position={[0, -0.2, 0.1]} fontSize={0.1} color="white" anchorX="center">
              • Ocean wave analysis
            </Text>
            <Text position={[0, -0.4, 0.1]} fontSize={0.1} color="white" anchorX="center">
              • Signal processing
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
            Parameter Controls
          </Text>
          
          <Text position={[0, 2, 0.1]} fontSize={0.15} color="#feca57" anchorX="center">
            Angle (degrees)
          </Text>
          <Box
            args={[0.3, 0.3, 0.1]}
            position={[0, 1.6, 0.1]}
            onClick={() => setParameters(prev => ({ ...prev, angle: (prev.angle + 15) % 90 || 15 }))}
          >
            <meshStandardMaterial color="#feca57" />
          </Box>
          <Text position={[0.5, 1.6, 0.1]} fontSize={0.15} color="white">
            {parameters.angle}°
          </Text>
          
          {application !== 'waves' && (
            <>
              <Text position={[0, 1, 0.1]} fontSize={0.15} color="#ff6b6b" anchorX="center">
                {application === 'height' ? 'Distance (m)' : 
                 application === 'distance' ? 'Height (m)' : 'Distance (m)'}
              </Text>
              <Box
                args={[0.3, 0.3, 0.1]}
                position={[0, 0.6, 0.1]}
                onClick={() => {
                  const key = application === 'distance' ? 'height' : 'distance';
                  setParameters(prev => ({ 
                    ...prev, 
                    [key]: prev[key as keyof typeof prev] >= 100 ? 10 : (prev[key as keyof typeof prev] as number) + 10 
                  }));
                }}
              >
                <meshStandardMaterial color="#ff6b6b" />
              </Box>
              <Text position={[0.5, 0.6, 0.1]} fontSize={0.15} color="white">
                {application === 'distance' ? parameters.height : parameters.distance}
              </Text>
            </>
          )}
        </group>
      )}

      {/* Real-world Context */}
      <group position={[0, -3, 0]}>
        <Text fontSize={0.2} color="#96ceb4" anchorX="center">
          Professional Applications
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -0.3, 0]}>
          • Civil Engineering: Bridge and building design
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -0.6, 0]}>
          • Astronomy: Calculating distances to celestial objects
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -0.9, 0]}>
          • Physics: Wave mechanics and oscillations
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -1.2, 0]}>
          • Computer Graphics: 3D transformations and animations
        </Text>
      </group>
    </group>
  );
};

export default TrigonometryApplications;