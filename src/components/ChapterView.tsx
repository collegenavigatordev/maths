import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, BookOpen, Zap, Eye } from 'lucide-react';
import TriangleSimulation from './simulations/TriangleSimulation';
import CoordinateGeometry from './simulations/CoordinateGeometry';
import RealNumbers from './simulations/RealNumbers';
import Polynomials from './simulations/Polynomials';
import LinearEquations from './simulations/LinearEquations';
import QuadraticEquations from './simulations/QuadraticEquations';
import ArithmeticProgressions from './simulations/ArithmeticProgressions';
import Circles from './simulations/Circles';
import Trigonometry from './simulations/Trigonometry';
import Statistics from './simulations/Statistics';
import Probability from './simulations/Probability';
import SurfaceAreasVolumes from './simulations/SurfaceAreasVolumes';
import AreasRelatedCircles from './simulations/AreasRelatedCircles';
import TrigonometryApplications from './simulations/TrigonometryApplications';
import Constructions from './simulations/Constructions';
import VoiceGuide from './VoiceGuide';
import CustomCursor from './CustomCursor';

const chapters = [
  { id: 1, title: "Real Numbers", component: RealNumbers },
  { id: 2, title: "Polynomials", component: Polynomials },
  { id: 3, title: "Linear Equations", component: LinearEquations },
  { id: 4, title: "Quadratic Equations", component: QuadraticEquations },
  { id: 5, title: "Arithmetic Progressions", component: ArithmeticProgressions },
  { id: 6, title: "Triangles", component: TriangleSimulation },
  { id: 7, title: "Coordinate Geometry", component: CoordinateGeometry },
  { id: 8, title: "Trigonometry", component: Trigonometry },
  { id: 9, title: "Applications of Trigonometry", component: TrigonometryApplications },
  { id: 10, title: "Circles", component: Circles },
  { id: 11, title: "Constructions", component: Constructions },
  { id: 12, title: "Areas Related to Circles", component: AreasRelatedCircles },
  { id: 13, title: "Surface Areas and Volumes", component: SurfaceAreasVolumes },
  { id: 14, title: "Statistics", component: Statistics },
  { id: 15, title: "Probability", component: Probability }
];

const ChapterView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'guided' | 'free'>('guided');
  const [isLoaded, setIsLoaded] = useState(false);
  
  const chapterData = chapters.find(c => c.id === parseInt(id || '0'));

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!chapterData) {
    return <div>Chapter not found</div>;
  }

  const SimulationComponent = chapterData.component;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <CustomCursor />
      
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
          
          {SimulationComponent && <SimulationComponent mode={mode} />}
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="relative z-10">
        <AnimatePresence>
          {isLoaded && (
            <>
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute top-0 left-0 right-0 p-6"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => navigate('/')}
                      className="p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <div>
                      <h1 className="text-3xl font-bold text-white">
                        Chapter {chapterData.id}: {chapterData.title}
                      </h1>
                      <p className="text-gray-400">Interactive 3D Exploration</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setMode('guided')}
                      className={`px-4 py-2 rounded-full flex items-center space-x-2 transition-all ${
                        mode === 'guided' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      <BookOpen size={16} />
                      <span>Guided</span>
                    </button>
                    <button
                      onClick={() => setMode('free')}
                      className={`px-4 py-2 rounded-full flex items-center space-x-2 transition-all ${
                        mode === 'free' 
                          ? 'bg-purple-500 text-white' 
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      <Zap size={16} />
                      <span>Free Explore</span>
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Mode Description */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="absolute left-6 top-32"
              >
                <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 max-w-sm">
                  <div className="flex items-center space-x-2 mb-2">
                    {mode === 'guided' ? <BookOpen size={16} className="text-blue-400" /> : <Zap size={16} className="text-purple-400" />}
                    <span className="font-semibold">
                      {mode === 'guided' ? 'Guided Mode' : 'Free Exploration'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">
                    {mode === 'guided' 
                      ? 'Follow step-by-step lessons with interactive checkpoints and voice guidance.'
                      : 'Experiment freely with concepts, manipulate variables, and discover patterns.'}
                  </p>
                </div>
              </motion.div>

              {/* Controls Panel */}
              {SimulationComponent && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
                >
                  <div className="bg-black/60 backdrop-blur-lg rounded-2xl p-4 flex items-center space-x-4 border border-white/20">
                    <span className="text-gray-400">🖱️ Drag to rotate</span>
                    <span className="text-gray-400">🔍 Scroll to zoom</span>
                    <span className="text-gray-400">👆 Click objects to interact</span>
                  </div>
                </motion.div>
              )}

              {/* Coming Soon for chapters without simulations */}
              {!SimulationComponent && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="text-center bg-black/60 backdrop-blur-lg rounded-2xl p-12 border border-white/20">
                    <Eye size={48} className="mx-auto mb-4 text-blue-400" />
                    <h3 className="text-2xl font-bold mb-2">Coming Soon</h3>
                    <p className="text-gray-400 max-w-md">
                      This chapter's immersive 3D simulation is under development. 
                      Experience the future of mathematical learning.
                    </p>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Voice Guide */}
      <VoiceGuide 
        text={`Welcome to ${chapterData.title}. ${mode === 'guided' ? 'Follow the guided tour to understand each concept step by step.' : 'Explore freely and experiment with the mathematical concepts in 3D space.'}`}
        enabled={true}
      />
    </div>
  );
};

export default ChapterView;