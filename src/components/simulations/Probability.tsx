import React, { useState, useMemo } from 'react';
import { Text, Box, Sphere } from '@react-three/drei';

interface ProbabilityProps {
  mode: 'guided' | 'free';
}

const Probability: React.FC<ProbabilityProps> = ({ mode }) => {
  const [experiment, setExperiment] = useState<'coin' | 'dice' | 'cards' | 'balls'>('coin');
  const [trials, setTrials] = useState(100);
  const [results, setResults] = useState<any[]>([]);
  const [showTheoretical, setShowTheoretical] = useState(true);

  // Simulate experiments
  const simulateExperiment = () => {
    const newResults = [];
    
    for (let i = 0; i < trials; i++) {
      switch (experiment) {
        case 'coin':
          newResults.push(Math.random() < 0.5 ? 'H' : 'T');
          break;
        case 'dice':
          newResults.push(Math.floor(Math.random() * 6) + 1);
          break;
        case 'cards':
          const suits = ['♠', '♥', '♦', '♣'];
          const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
          newResults.push({
            suit: suits[Math.floor(Math.random() * 4)],
            value: values[Math.floor(Math.random() * 13)]
          });
          break;
        case 'balls':
          const colors = ['Red', 'Blue', 'Green', 'Yellow'];
          newResults.push(colors[Math.floor(Math.random() * 4)]);
          break;
      }
    }
    
    setResults(newResults);
  };

  // Calculate probabilities
  const probabilities = useMemo(() => {
    if (results.length === 0) return {};
    
    const counts = {};
    results.forEach(result => {
      const key = typeof result === 'object' ? `${result.value}${result.suit}` : result;
      counts[key] = (counts[key] || 0) + 1;
    });
    
    const probs = {};
    Object.keys(counts).forEach(key => {
      probs[key] = counts[key] / results.length;
    });
    
    return { counts, probs };
  }, [results]);

  // Theoretical probabilities
  const theoretical = useMemo(() => {
    switch (experiment) {
      case 'coin':
        return { H: 0.5, T: 0.5 };
      case 'dice':
        return { 1: 1/6, 2: 1/6, 3: 1/6, 4: 1/6, 5: 1/6, 6: 1/6 };
      case 'cards':
        return { 'Any Card': 1/52 };
      case 'balls':
        return { Red: 0.25, Blue: 0.25, Green: 0.25, Yellow: 0.25 };
      default:
        return {};
    }
  }, [experiment]);

  return (
    <group>
      {/* Experiment Selection */}
      <group position={[0, 4, 0]}>
        <Text fontSize={0.3} color="#4ecdc4" anchorX="center">
          Probability Experiments
        </Text>
        
        <group position={[0, -0.8, 0]}>
          {['coin', 'dice', 'cards', 'balls'].map((exp, index) => (
            <Box
              key={exp}
              args={[1.5, 0.4, 0.2]}
              position={[index * 2 - 3, 0, 0]}
              onClick={() => {
                setExperiment(exp as any);
                setResults([]);
              }}
            >
              <meshStandardMaterial 
                color={experiment === exp ? "#ff6b6b" : "#333333"}
                emissive={experiment === exp ? "#ff6b6b" : "#000000"}
                emissiveIntensity={0.2}
              />
              <Text position={[0, 0, 0.15]} fontSize={0.1} color="white" anchorX="center">
                {exp.charAt(0).toUpperCase() + exp.slice(1)}
              </Text>
            </Box>
          ))}
        </group>
      </group>

      {/* Visualization Area */}
      <group position={[0, 1, 0]}>
        {experiment === 'coin' && (
          <group>
            <Text position={[0, 1, 0]} fontSize={0.25} color="#feca57" anchorX="center">
              Coin Flip Results
            </Text>
            
            {results.slice(0, 20).map((result, index) => (
              <group key={index} position={[index * 0.6 - 6, 0, 0]}>
                <Box args={[0.4, 0.4, 0.1]}>
                  <meshStandardMaterial color={result === 'H' ? "#ff6b6b" : "#4ecdc4"} />
                </Box>
                <Text position={[0, 0, 0.1]} fontSize={0.2} color="white" anchorX="center">
                  {result}
                </Text>
              </group>
            ))}
          </group>
        )}

        {experiment === 'dice' && (
          <group>
            <Text position={[0, 1, 0]} fontSize={0.25} color="#feca57" anchorX="center">
              Dice Roll Results
            </Text>
            
            {[1, 2, 3, 4, 5, 6].map((face, index) => {
              const count = probabilities.counts?.[face] || 0;
              return (
                <group key={face} position={[index * 1.2 - 3, 0, 0]}>
                  <Box args={[0.8, count * 0.1 + 0.2, 0.3]}>
                    <meshStandardMaterial color={`hsl(${index * 60}, 70%, 60%)`} />
                  </Box>
                  <Text position={[0, count * 0.1 + 0.5, 0.2]} fontSize={0.15} color="white" anchorX="center">
                    {count}
                  </Text>
                  <Text position={[0, -0.3, 0.2]} fontSize={0.2} color="white" anchorX="center">
                    {face}
                  </Text>
                </group>
              );
            })}
          </group>
        )}

        {experiment === 'balls' && (
          <group>
            <Text position={[0, 1, 0]} fontSize={0.25} color="#feca57" anchorX="center">
              Ball Drawing Results
            </Text>
            
            {['Red', 'Blue', 'Green', 'Yellow'].map((color, index) => {
              const count = probabilities.counts?.[color] || 0;
              const ballColor = color === 'Red' ? '#ff6b6b' : 
                               color === 'Blue' ? '#4ecdc4' : 
                               color === 'Green' ? '#96ceb4' : '#feca57';
              
              return (
                <group key={color} position={[index * 2 - 3, 0, 0]}>
                  <Sphere args={[0.3 + count * 0.01]}>
                    <meshStandardMaterial color={ballColor} />
                  </Sphere>
                  <Text position={[0, -0.8, 0]} fontSize={0.15} color="white" anchorX="center">
                    {color}: {count}
                  </Text>
                </group>
              );
            })}
          </group>
        )}
      </group>

      {/* Statistics Panel */}
      <group position={[8, 1, 0]}>
        <Box args={[4, 8, 0.1]}>
          <meshBasicMaterial color="#000000" transparent opacity={0.8} />
        </Box>
        
        <Text position={[0, 3.5, 0.1]} fontSize={0.25} color="#4ecdc4" anchorX="center">
          Probability Analysis
        </Text>
        
        <Text position={[0, 3, 0.1]} fontSize={0.2} color="#ff6b6b" anchorX="center">
          Experimental Results
        </Text>
        <Text position={[0, 2.7, 0.1]} fontSize={0.12} color="white" anchorX="center">
          Total Trials: {results.length}
        </Text>
        
        {Object.entries(probabilities.probs || {}).slice(0, 6).map(([outcome, prob], index) => (
          <Text key={outcome} position={[0, 2.4 - index * 0.2, 0.1]} fontSize={0.1} color="#feca57" anchorX="center">
            P({outcome}) = {(prob as number).toFixed(3)}
          </Text>
        ))}
        
        {showTheoretical && (
          <>
            <Text position={[0, 1, 0.1]} fontSize={0.2} color="#96ceb4" anchorX="center">
              Theoretical Probability
            </Text>
            {Object.entries(theoretical).slice(0, 6).map(([outcome, prob], index) => (
              <Text key={outcome} position={[0, 0.7 - index * 0.2, 0.1]} fontSize={0.1} color="#96ceb4" anchorX="center">
                P({outcome}) = {prob.toFixed(3)}
              </Text>
            ))}
          </>
        )}
        
        <Text position={[0, -0.5, 0.1]} fontSize={0.2} color="#45b7d1" anchorX="center">
          Probability Rules
        </Text>
        <Text position={[0, -0.8, 0.1]} fontSize={0.1} color="white" anchorX="center">
          • 0 ≤ P(E) ≤ 1
        </Text>
        <Text position={[0, -1, 0.1]} fontSize={0.1} color="white" anchorX="center">
          • P(certain event) = 1
        </Text>
        <Text position={[0, -1.2, 0.1]} fontSize={0.1} color="white" anchorX="center">
          • P(impossible event) = 0
        </Text>
        <Text position={[0, -1.4, 0.1]} fontSize={0.1} color="white" anchorX="center">
          • P(A) + P(A') = 1
        </Text>
        
        <Text position={[0, -1.8, 0.1]} fontSize={0.2} color="#ff9ff3" anchorX="center">
          Law of Large Numbers
        </Text>
        <Text position={[0, -2.1, 0.1]} fontSize={0.1} color="white" anchorX="center">
          As trials increase, experimental
        </Text>
        <Text position={[0, -2.3, 0.1]} fontSize={0.1} color="white" anchorX="center">
          probability approaches theoretical
        </Text>
      </group>

      {/* Interactive Controls */}
      {mode === 'free' && (
        <group position={[-8, 0, 0]}>
          <Box args={[3, 6, 0.1]}>
            <meshBasicMaterial color="#000000" transparent opacity={0.8} />
          </Box>
          
          <Text position={[0, 2.5, 0.1]} fontSize={0.2} color="white" anchorX="center">
            Experiment Controls
          </Text>
          
          <Text position={[0, 2, 0.1]} fontSize={0.15} color="#feca57" anchorX="center">
            Number of Trials
          </Text>
          <Box
            args={[0.3, 0.3, 0.1]}
            position={[0, 1.6, 0.1]}
            onClick={() => setTrials(prev => prev >= 1000 ? 10 : prev + 50)}
          >
            <meshStandardMaterial color="#feca57" />
          </Box>
          <Text position={[0.5, 1.6, 0.1]} fontSize={0.15} color="white">
            {trials}
          </Text>
          
          <Box
            args={[2.5, 0.4, 0.1]}
            position={[0, 1, 0.1]}
            onClick={simulateExperiment}
          >
            <meshStandardMaterial color="#4ecdc4" />
          </Box>
          <Text position={[0, 1, 0.15]} fontSize={0.12} color="white" anchorX="center">
            Run Experiment
          </Text>
          
          <Box
            args={[2.5, 0.3, 0.1]}
            position={[0, 0.5, 0.1]}
            onClick={() => setResults([])}
          >
            <meshStandardMaterial color="#ff6b6b" />
          </Box>
          <Text position={[0, 0.5, 0.15]} fontSize={0.12} color="white" anchorX="center">
            Clear Results
          </Text>
          
          <Box
            args={[2.5, 0.3, 0.1]}
            position={[0, 0, 0.1]}
            onClick={() => setShowTheoretical(!showTheoretical)}
          >
            <meshStandardMaterial color={showTheoretical ? "#96ceb4" : "#333333"} />
          </Box>
          <Text position={[0, 0, 0.15]} fontSize={0.12} color="white" anchorX="center">
            Toggle Theoretical
          </Text>
        </group>
      )}

      {/* Real-world Applications */}
      <group position={[0, -3, 0]}>
        <Text fontSize={0.2} color="#96ceb4" anchorX="center">
          Real-world Applications
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -0.3, 0]}>
          • Weather forecasting and risk assessment
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -0.6, 0]}>
          • Insurance and actuarial science
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -0.9, 0]}>
          • Quality control in manufacturing
        </Text>
        <Text fontSize={0.15} color="white" anchorX="center" position={[0, -1.2, 0]}>
          • Medical diagnosis and treatment outcomes
        </Text>
      </group>
    </group>
  );
};

export default Probability;