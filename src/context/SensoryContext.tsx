'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface SensoryContextType {
  isSensoryFriendly: boolean;
  isAudioEnabled: boolean;
  setSensoryFriendly: (value: boolean) => void;
  toggleSensoryFriendly: () => void;
  setAudioEnabled: (value: boolean) => void;
  toggleAudio: () => void;
}

const SensoryContext = createContext<SensoryContextType | undefined>(undefined);

export function SensoryProvider({ children }: { children: React.ReactNode }) {
  const [isSensoryFriendly, setIsSensoryFriendly] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);

  // Load from local storage and check system preference
  useEffect(() => {
    const savedSensory = localStorage.getItem('sensory-friendly');
    const savedAudio = localStorage.getItem('audio-enabled');

    if (savedSensory !== null) setIsSensoryFriendly(savedSensory === 'true');
    if (savedAudio !== null) setIsAudioEnabled(savedAudio === 'true');

    if (savedSensory === null) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) setIsSensoryFriendly(true);
    }
  }, []);

  const setSensoryFriendly = (value: boolean) => {
    setIsSensoryFriendly(value);
    localStorage.setItem('sensory-friendly', String(value));
  };

  const setAudioEnabled = (value: boolean) => {
    setIsAudioEnabled(value);
    localStorage.setItem('audio-enabled', String(value));
  };

  const toggleSensoryFriendly = () => setSensoryFriendly(!isSensoryFriendly);
  const toggleAudio = () => setAudioEnabled(!isAudioEnabled);

  useEffect(() => {
    if (isSensoryFriendly) {
      document.documentElement.setAttribute('data-sensory', 'friendly');
    } else {
      document.documentElement.removeAttribute('data-sensory');
    }
  }, [isSensoryFriendly]);

  return (
    <SensoryContext.Provider value={{ 
      isSensoryFriendly, setSensoryFriendly, toggleSensoryFriendly,
      isAudioEnabled, setAudioEnabled, toggleAudio
    }}>
      {children}
    </SensoryContext.Provider>
  );
}

export function useSensory() {
  const context = useContext(SensoryContext);
  if (context === undefined) {
    throw new Error('useSensory must be used within a SensoryProvider');
  }
  return context;
}
