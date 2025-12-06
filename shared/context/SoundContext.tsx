import React, { createContext, useContext, useState, useEffect } from 'react';
import { playSound, SoundType } from '../utils/audio';

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  play: (type: SoundType) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('structviz_muted');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('structviz_muted', JSON.stringify(isMuted));
  }, [isMuted]);

  const toggleMute = () => setIsMuted((prev: boolean) => !prev);

  const play = (type: SoundType) => {
    if (!isMuted) {
      playSound(type);
    }
  };

  return (
    <SoundContext.Provider value={{ isMuted, toggleMute, play }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};
