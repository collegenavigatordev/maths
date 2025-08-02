import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls, Text, Sphere } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CustomCursor from './CustomCursor';
import ChapterPlanet from './ChapterPlanet';
import VoiceGuide from './VoiceGuide';
import { Play, Volume2, VolumeX } from 'lucide-react';

const chapters = [
  { id: 1, title: "Real Numbers", color: "#ff6b6b", position: [3, 2, 0] },
  { id: 2, title: "Polynomials", color: "#4ecdc4", position: [-2, 3, 1] },
  { id: 3, title: "Linear Equations", color: "#45b7d1", position: [4, -1, -2] },
  { id: 4, title: "Quadratic Equations", color: "#96ceb4", position: [-3, -2, 2] },
  { id: 5, title: "Arithmetic Progressions", color: "#feca57", position: [1, 4, -1] },
  { id: 6, title: "Triangles", color: "#ff9ff3", position: [-4, 1, 3] },
  { id: 7, title: "Coordinate Geometry", color: "#54a0ff", position: [2, -3, 1] },
  { id: 8, title: "Trigonometry", color: "#5f27cd", position: [-1, 2, -3] },
  { id: 9, title: "Applications of Trigonometry", color: "#00d2d3", position: [3, 1, 2] },
  { id: 10, title: "Circles", color: "#ff6348", position: [-2, -1, -2] },
  { id: 11, title: "Constructions", color: "#2ed573", position: [1, -4, 0] },
  { id: 12, title: "Areas Related to Circles", color: "#ffa502", position: [-3, 3, -1] },
  { id: 13, title: "Surface Areas and Volumes", color: "#3742fa", position: [4, 2, 3] },
  { id: 14, title: "Statistics", color: "#2f3542", position: [-1, -3, 2] },
  { id: 15, title: "Probability", color: "#f1c40f", position: [2, 3, -2] }
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleChapterSelect = (chapterId: number) => {
    setSelectedChapter(chapterId);
    setTimeout(() => {
      navigate(`/chapter/${chapterId}`);
    }, 1000);
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <CustomCursor />
      
      {/* Background Canvas */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade />
          
          {chapters.map((chapter) => (
            <ChapterPlanet
              key={chapter.id}
              chapter={chapter}
              onSelect={handleChapterSelect}
              isSelected={selectedChapter === chapter.id}
            />
          ))}
          
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            zoomSpeed={0.5}
            rotateSpeed={0.3}
            maxDistance={20}
            minDistance={5}
          />
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="relative z-10 pointer-events-none">
        <AnimatePresence>
          {isLoaded && (
            <>
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute top-0 left-0 right-0 p-8"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                      MathVerse X
                    </h1>
                    <p className="text-xl text-gray-300 mt-2">
                      Experience, Don't Just Learn
                    </p>
                  </div>
                  
                  <button
                    onClick={toggleAudio}
                    className="pointer-events-auto p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all"
                  >
                    {audioEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
                  </button>
                </div>
              </motion.div>

              {/* Instructions */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.5 }}
                className="absolute bottom-8 left-8 right-8 text-center"
              >
                <p className="text-lg text-gray-400 mb-4">
                  Navigate through space and click on any planet to explore that chapter
                </p>
                <div className="flex justify-center items-center space-x-4 text-sm text-gray-500">
                  <span>🖱️ Drag to rotate</span>
                  <span>🔍 Scroll to zoom</span>
                  <span>🪐 Click planets to enter</span>
                </div>
              </motion.div>

              {/* Chapter Info Panel */}
              <AnimatePresence>
                {selectedChapter && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                  >
                    <div className="bg-black/60 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20">
                      <div className="flex items-center justify-center mb-4">
                        <Play className="text-blue-400 mr-2" size={24} />
                        <span className="text-2xl">Entering Chapter {selectedChapter}</span>
                      </div>
                      <h3 className="text-xl text-gray-300">
                        {chapters.find(c => c.id === selectedChapter)?.title}
                      </h3>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Voice Guide */}
      <VoiceGuide 
        text="Welcome to MathVerse X. Navigate through space to explore different chapters of Class 10 Mathematics. Each planet represents a different mathematical concept waiting to be discovered."
        enabled={audioEnabled}
      />
    </div>
  );
};

export default HomePage;