import React, { useState, useMemo } from 'react';
import { Text, Box } from '@react-three/drei';

interface StatisticsProps {
  mode: 'guided' | 'free';
}

const Statistics: React.FC<StatisticsProps> = ({ mode }) => {
  const [dataset, setDataset] = useState([12, 15, 18, 20, 22, 25, 28, 30, 32, 35]);
  const [showMean, setShowMean] = useState(true);
  const [showMedian, setShowMedian] = useState(true);
  const [showMode, setShowMode] = useState(true);

  // Calculate statistical measures
  const stats = useMemo(() => {
    const sorted = [...dataset].sort((a, b) => a - b);
    const n = dataset.length;
    
    // Mean
    const mean = dataset.reduce((sum, val) => sum + val, 0) / n;
    
    // Median
    const median = n % 2 === 0 
      ? (sorted[n/2 - 1] + sorted[n/2]) / 2 
      : sorted[Math.floor(n/2)];
    
    // Mode
    const frequency = {};
    dataset.forEach(val => {
      frequency[val] = (frequency[val] || 0) + 1;
    });
    const maxFreq = Math.max(...Object.values(frequency));
    const modes = Object.keys(frequency).filter(key => frequency[key] === maxFreq).map(Number);
    
    // Range
    const range = Math.max(...dataset) - Math.min(...dataset);
    
    // Standard Deviation
    const variance = dataset.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);
    
    return { mean, median, modes, range, stdDev, sorted, frequency };
  }, [dataset]);

  // Create histogram bars
  const histogramBars = useMemo(() => {
    const bins = {};
    const binSize = 5;
    
    dataset.forEach(val => {
      const bin = Math.floor(val / binSize) * binSize;
      bins[bin] = (bins[bin] || 0) + 1;
    });
    
    return Object.entries(bins).map(([bin, count]) => ({
      bin: parseInt(bin),
      count: count as number,
      height: (count as number) * 0.5
    }));
  }, [dataset]);

  return (
    <group>
      {/* Data Points Visualization */}
      <group position={[0, 2, 0]}>
        <Text position={[0, 1, 0]} fontSize={0.3} color="#4ecdc4" anchorX="center">
          Dataset: {dataset.join(', ')}
        </Text>
        
        {dataset.map((value, index) => (
          <group key={index} position={[index * 1.2 - 5.4, 0, 0]}>
            <Box args={[0.8, value * 0.05, 0.3]}>
              <meshStandardMaterial 
                color={`hsl(${200 + index * 15}, 70%, 60%)`}
                emissive={`hsl(${200 + index * 15}, 70%, 20%)`}
                emissiveIntensity={0.2}
              />
            </Box>
            <Text 
              position={[0, value * 0.05 + 0.3, 0.2]} 
              fontSize={0.15} 
              color="white" 
              anchorX="center"
            >
              {value}
            </Text>
          </group>
        ))}
      </group>

      {/* Statistical Measures Visualization */}
      <group position={[0, -1, 0]}>
        {/* Mean line */}
        {showMean && (
          <group>
            <Box args={[12, 0.05, 0.05]} position={[0, stats.mean * 0.05, 0]}>
              <meshStandardMaterial color="#ff6b6b" />
            </Box>
            <Text 
              position={[6.5, stats.mean * 0.05, 0]} 
              fontSize={0.2} 
              color="#ff6b6b"
            >
              Mean = {stats.mean.toFixed(2)}
            </Text>
          </group>
        )}
        
        {/* Median line */}
        {showMedian && (
          <group>
            <Box args={[12, 0.05, 0.05]} position={[0, stats.median * 0.05 + 0.1, 0]}>
              <meshStandardMaterial color="#feca57" />
            </Box>
            <Text 
              position={[6.5, stats.median * 0.05 + 0.1, 0]} 
              fontSize={0.2} 
              color="#feca57"
            >
              Median = {stats.median}
            </Text>
          </group>
        )}
      </group>

      {/* Histogram */}
      <group position={[0, -3, 0]}>
        <Text position={[0, 2, 0]} fontSize={0.25} color="#96ceb4" anchorX="center">
          Frequency Distribution
        </Text>
        
        {histogramBars.map((bar, index) => (
          <group key={index} position={[index * 1.5 - 3, 0, 0]}>
            <Box args={[1.2, bar.height, 0.3]}>
              <meshStandardMaterial color="#45b7d1" />
            </Box>
            <Text 
              position={[0, bar.height + 0.3, 0.2]} 
              fontSize={0.15} 
              color="white" 
              anchorX="center"
            >
              {bar.count}
            </Text>
            <Text 
              position={[0, -0.3, 0.2]} 
              fontSize={0.12} 
              color="#888888" 
              anchorX="center"
            >
              {bar.bin}-{bar.bin + 4}
            </Text>
          </group>
        ))}
      </group>

      {/* Statistics Panel */}
      <group position={[8, 1, 0]}>
        <Box args={[4, 8, 0.1]}>
          <meshBasicMaterial color="#000000" transparent opacity={0.8} />
        </Box>
        
        <Text position={[0, 3.5, 0.1]} fontSize={0.25} color="#4ecdc4" anchorX="center">
          Statistical Measures
        </Text>
        
        <Text position={[0, 3, 0.1]} fontSize={0.2} color="#ff6b6b" anchorX="center">
          Central Tendency
        </Text>
        <Text position={[0, 2.7, 0.1]} fontSize={0.15} color="white" anchorX="center">
          Mean (x̄) = {stats.mean.toFixed(2)}
        </Text>
        <Text position={[0, 2.4, 0.1]} fontSize={0.15} color="white" anchorX="center">
          Median = {stats.median}
        </Text>
        <Text position={[0, 2.1, 0.1]} fontSize={0.15} color="white" anchorX="center">
          Mode = {stats.modes.join(', ')}
        </Text>
        
        <Text position={[0, 1.7, 0.1]} fontSize={0.2} color="#feca57" anchorX="center">
          Dispersion
        </Text>
        <Text position={[0, 1.4, 0.1]} fontSize={0.15} color="white" anchorX="center">
          Range = {stats.range}
        </Text>
        <Text position={[0, 1.1, 0.1]} fontSize={0.15} color="white" anchorX="center">
          Std Dev (σ) = {stats.stdDev.toFixed(2)}
        </Text>
        <Text position={[0, 0.8, 0.1]} fontSize={0.15} color="white" anchorX="center">
          Variance (σ²) = {(stats.stdDev * stats.stdDev).toFixed(2)}
        </Text>
        
        <Text position={[0, 0.4, 0.1]} fontSize={0.2} color="#96ceb4" anchorX="center">
          Formulas
        </Text>
        <Text position={[0, 0.1, 0.1]} fontSize={0.12} color="white" anchorX="center">
          Mean = Σx / n
        </Text>
        <Text position={[0, -0.1, 0.1]} fontSize={0.12} color="white" anchorX="center">
          Median = Middle value (sorted)
        </Text>
        <Text position={[0, -0.3, 0.1]} fontSize={0.12} color="white" anchorX="center">
          Mode = Most frequent value
        </Text>
        <Text position={[0, -0.5, 0.1]} fontSize={0.12} color="white" anchorX="center">
          Range = Max - Min
        </Text>
        <Text position={[0, -0.7, 0.1]} fontSize={0.12} color="white" anchorX="center">
          σ = √[Σ(x-x̄)² / n]
        </Text>
        
        <Text position={[0, -1.1, 0.1]} fontSize={0.2} color="#45b7d1" anchorX="center">
          Data Analysis
        </Text>
        <Text position={[0, -1.4, 0.1]} fontSize={0.12} color="white" anchorX="center">
          Sample Size (n) = {dataset.length}
        </Text>
        <Text position={[0, -1.6, 0.1]} fontSize={0.12} color="white" anchorX="center">
          Min Value = {Math.min(...dataset)}
        </Text>
        <Text position={[0, -1.8, 0.1]} fontSize={0.12} color="white" anchorX="center">
          Max Value = {Math.max(...dataset)}
        </Text>
        <Text position={[0, -2, 0.1]} fontSize={0.12} color="white" anchorX="center">
          Sum = {dataset.reduce((a, b) => a + b, 0)}
        </Text>
        
        <Text position={[0, -2.4, 0.1]} fontSize={0.2} color="#ff9ff3" anchorX="center">
          Distribution Shape
        </Text>
        <Text position={[0, -2.7, 0.1]} fontSize={0.12} color="white" anchorX="center">
          {stats.mean > stats.median ? 'Right Skewed' : 
           stats.mean < stats.median ? 'Left Skewed' : 'Symmetric'}
        </Text>
        <Text position={[0, -2.9, 0.1]} fontSize={0.12} color="white" anchorX="center">
          Coefficient of Variation:
        </Text>
        <Text position={[0, -3.1, 0.1]} fontSize={0.12} color="white" anchorX="center">
          {((stats.stdDev / stats.mean) * 100).toFixed(1)}%
        </Text>
      </group>

      {/* Interactive Controls */}
      {mode === 'free' && (
        <group position={[-8, 0, 0]}>
          <Box args={[3, 6, 0.1]}>
            <meshBasicMaterial color="#000000" transparent opacity={0.8} />
          </Box>
          
          <Text position={[0, 2.5, 0.1]} fontSize={0.2} color="white" anchorX="center">
            Data Controls
          </Text>
          
          <Box
            args={[2.5, 0.3, 0.1]}
            position={[0, 2, 0.1]}
            onClick={() => {
              const newData = Array.from({length: 10}, () => Math.floor(Math.random() * 40) + 10);
              setDataset(newData);
            }}
          >
            <meshStandardMaterial color="#4ecdc4" />
          </Box>
          <Text position={[0, 2, 0.15]} fontSize={0.12} color="white" anchorX="center">
            Generate Random Data
          </Text>
          
          <Box
            args={[2.5, 0.3, 0.1]}
            position={[0, 1.5, 0.1]}
            onClick={() => setShowMean(!showMean)}
          >
            <meshStandardMaterial color={showMean ? "#ff6b6b" : "#333333"} />
          </Box>
          <Text position={[0, 1.5, 0.15]} fontSize={0.12} color="white" anchorX="center">
            Toggle Mean
          </Text>
          
          <Box
            args={[2.5, 0.3, 0.1]}
            position={[0, 1, 0.1]}
            onClick={() => setShowMedian(!showMedian)}
          >
            <meshStandardMaterial color={showMedian ? "#feca57" : "#333333"} />
          </Box>
          <Text position={[0, 1, 0.15]} fontSize={0.12} color="white" anchorX="center">
            Toggle Median
          </Text>
          
          <Text position={[0, 0.5, 0.1]} fontSize={0.15} color="white" anchorX="center">
            Preset Datasets
          </Text>
          
          <Box
            args={[2.5, 0.25, 0.1]}
            position={[0, 0.1, 0.1]}
            onClick={() => setDataset([85, 90, 78, 92, 88, 76, 95, 89, 87, 91])}
          >
            <meshStandardMaterial color="#96ceb4" />
          </Box>
          <Text position={[0, 0.1, 0.15]} fontSize={0.1} color="white" anchorX="center">
            Test Scores
          </Text>
          
          <Box
            args={[2.5, 0.25, 0.1]}
            position={[0, -0.2, 0.1]}
            onClick={() => setDataset([25, 30, 35, 40, 45, 50, 55, 60, 65, 70])}
          >
            <meshStandardMaterial color="#45b7d1" />
          </Box>
          <Text position={[0, -0.2, 0.15]} fontSize={0.1} color="white" anchorX="center">
            Ages
          </Text>
          
          <Box
            args={[2.5, 0.25, 0.1]}
            position={[0, -0.5, 0.1]}
            onClick={() => setDataset([100, 150, 200, 180, 220, 190, 210, 170, 230, 160])}
          >
            <meshStandardMaterial color="#ff9ff3" />
          </Box>
          <Text position={[0, -0.5, 0.15]} fontSize={0.1} color="white" anchorX="center">
            Sales Data
          </Text>
        </group>
      )}

      {/* Real-world Applications */}
      <group position={[0, -6, 0]}>
        <Text fontSize={0.2} color="#96ceb4" anchorX="center">
          Real-world Applications
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -0.3, 0]}>
          • Quality control in manufacturing
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -0.6, 0]}>
          • Market research and consumer behavior
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -0.9, 0]}>
          • Medical research and clinical trials
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -1.2, 0]}>
          • Sports analytics and performance tracking
        </Text>
      </group>
    </group>
  );
};

export default Statistics;