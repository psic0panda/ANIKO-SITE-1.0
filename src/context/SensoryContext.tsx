'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface SensoryContextType {
  isSensoryFriendly: boolean;
  isAudioEnabled: boolean;
  isFocusMode: boolean;
  setSensoryFriendly: (value: boolean) => void;
  toggleSensoryFriendly: () => void;
  setAudioEnabled: (value: boolean) => void;
  toggleAudio: () => void;
  setFocusMode: (value: boolean) => void;
  toggleFocus: () => void;
}

const SensoryContext = createContext<SensoryContextType | undefined>(undefined);

export function SensoryProvider({ children }: { children: React.ReactNode }) {
  const [isSensoryFriendly, setIsSensoryFriendly] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Load from local storage and check system preference
  useEffect(() => {
    const savedSensory = localStorage.getItem('sensory-friendly');
    const savedAudio = localStorage.getItem('audio-enabled');
    const savedFocus = localStorage.getItem('focus-mode');

    if (savedSensory !== null) setIsSensoryFriendly(savedSensory === 'true');
    if (savedAudio !== null) setIsAudioEnabled(savedAudio === 'true');
    if (savedFocus !== null) setIsFocusMode(savedFocus === 'true');

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

  const setFocusMode = (value: boolean) => {
    setIsFocusMode(value);
    localStorage.setItem('focus-mode', String(value));
    if (value) document.documentElement.setAttribute('data-focus', 'active');
    else document.documentElement.removeAttribute('data-focus');
  };

  const toggleSensoryFriendly = () => setSensoryFriendly(!isSensoryFriendly);
  const toggleAudio = () => setAudioEnabled(!isAudioEnabled);
  const toggleFocus = () => setFocusMode(!isFocusMode);

  useEffect(() => {
    if (isSensoryFriendly) {
      document.documentElement.setAttribute('data-sensory', 'friendly');
    } else {
      document.documentElement.removeAttribute('data-sensory');
    }
  }, [isSensoryFriendly]);

  useEffect(() => {
    if (isFocusMode) {
      document.documentElement.setAttribute('data-focus', 'active');
    } else {
      document.documentElement.removeAttribute('data-focus');
    }
  }, [isFocusMode]);

  return (
    <SensoryContext.Provider value={{ 
      isSensoryFriendly, setSensoryFriendly, toggleSensoryFriendly,
      isAudioEnabled, setAudioEnabled, toggleAudio,
      isFocusMode, setFocusMode, toggleFocus
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
