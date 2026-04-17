'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface SensoryContextType {
  isSensoryFriendly: boolean;
  setSensoryFriendly: (value: boolean) => void;
  toggleSensoryFriendly: () => void;
}

const SensoryContext = createContext<SensoryContextType | undefined>(undefined);

export function SensoryProvider({ children }: { children: React.ReactNode }) {
  const [isSensoryFriendly, setIsSensoryFriendly] = useState(false);

  // Load from local storage and check system preference
  useEffect(() => {
    const saved = localStorage.getItem('sensory-friendly');
    if (saved !== null) {
      setIsSensoryFriendly(saved === 'true');
    } else {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        setIsSensoryFriendly(true);
      }
    }
  }, []);

  const setSensoryFriendly = (value: boolean) => {
    setIsSensoryFriendly(value);
    localStorage.setItem('sensory-friendly', String(value));
    
    // Update data attribute for global CSS styling
    if (value) {
      document.documentElement.setAttribute('data-sensory', 'friendly');
    } else {
      document.documentElement.removeAttribute('data-sensory');
    }
  };

  const toggleSensoryFriendly = () => {
    setSensoryFriendly(!isSensoryFriendly);
  };

  useEffect(() => {
    if (isSensoryFriendly) {
      document.documentElement.setAttribute('data-sensory', 'friendly');
    } else {
      document.documentElement.removeAttribute('data-sensory');
    }
  }, [isSensoryFriendly]);

  return (
    <SensoryContext.Provider value={{ isSensoryFriendly, setSensoryFriendly, toggleSensoryFriendly }}>
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
