import React, { useEffect, useState } from 'react';

interface VoiceGuideProps {
  text: string;
  enabled: boolean;
}

const VoiceGuide: React.FC<VoiceGuideProps> = ({ text, enabled }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (enabled && text && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.7;
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      
      // Small delay to ensure the component is mounted
      setTimeout(() => {
        speechSynthesis.speak(utterance);
      }, 1000);

      return () => {
        speechSynthesis.cancel();
        setIsPlaying(false);
      };
    }
  }, [text, enabled]);

  if (!enabled || !isPlaying) return null;

  return (
    <div className="fixed bottom-20 right-8 z-20 bg-blue-500/20 backdrop-blur-sm rounded-lg p-3 border border-blue-400/30">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
        <span className="text-sm text-blue-300">Voice Guide Active</span>
      </div>
    </div>
  );
};

export default VoiceGuide;