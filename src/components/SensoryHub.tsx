'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSensory } from '@/context/SensoryContext';
import { Settings, Eye, Volume2, VolumeX, Moon, Sun, X } from 'lucide-react';

export default function SensoryHub() {
  const { 
    isSensoryFriendly, toggleSensoryFriendly,
    isAudioEnabled, toggleAudio,
    isFocusMode, toggleFocus
  } = useSensory();
  
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-8 left-8 z-[100] flex flex-col items-start gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, x: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20, x: -20 }}
            className="glass-modern p-6 rounded-[2.5rem] shadow-2xl border-2 border-brand-primary/10 flex flex-col gap-6 min-w-[280px]"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-heading text-lg text-brand-primary">Santuário Aniko</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-brand-primary/5 rounded-full transition-colors"
              >
                <X size={20} className="text-brand-primary/40" />
              </button>
            </div>

            {/* Sensory Mode Toggle */}
            <div className="flex items-center justify-between gap-4 p-4 rounded-3xl bg-white/40 border border-white/60">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-brand-primary">Modo Sensorial</span>
                <span className="text-[10px] text-brand-primary/50">Ambiente calmo</span>
              </div>
              <button
                onClick={toggleSensoryFriendly}
                className={`relative w-14 h-8 rounded-full transition-colors duration-500 ${isSensoryFriendly ? 'bg-brand-accent' : 'bg-slate-200'}`}
              >
                <motion.div 
                  animate={{ x: isSensoryFriendly ? 28 : 4 }}
                  className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm flex items-center justify-center text-[10px]"
                >
                  {isSensoryFriendly ? '✨' : '☁️'}
                </motion.div>
              </button>
            </div>

            {/* Audio Toggle */}
            <div className="flex items-center justify-between gap-4 p-4 rounded-3xl bg-white/40 border border-white/60">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-brand-primary">Sons Relaxantes</span>
                <span className="text-[10px] text-brand-primary/50">Ondas e vento</span>
              </div>
              <button
                onClick={toggleAudio}
                className={`flex h-10 w-10 items-center justify-center rounded-2xl transition-all ${isAudioEnabled ? 'bg-brand-secondary text-brand-primary shadow-inner scale-95' : 'bg-white text-slate-400 border border-slate-100'}`}
              >
                {isAudioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>
            </div>

            {/* Focus Mode Toggle */}
            <div className="flex items-center justify-between gap-4 p-4 rounded-3xl bg-white/40 border border-white/60">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-brand-primary">Modo Foco</span>
                <span className="text-[10px] text-brand-primary/50">Reduz distrações</span>
              </div>
              <button
                onClick={toggleFocus}
                className={`flex h-10 w-10 items-center justify-center rounded-2xl transition-all ${isFocusMode ? 'bg-brand-primary text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100'}`}
              >
                {isFocusMode ? <Moon size={20} fill="white" /> : <Sun size={20} />}
              </button>
            </div>

            <div className="text-[10px] text-center text-brand-primary/30 font-medium">
              Feito com carinho para seu pequeno 🐧
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`h-16 w-16 rounded-full glass-modern flex items-center justify-center shadow-2xl border-2 transition-colors ${isOpen ? 'border-brand-primary bg-brand-primary text-white' : 'border-white/60 text-brand-primary hover:bg-brand-primary hover:text-white'}`}
      >
        {isOpen ? <Settings size={28} className="animate-spin-slow" /> : <Settings size={28} />}
        {!isOpen && (
           <motion.div 
             initial={{ opacity: 0, scale: 0.5 }}
             animate={{ opacity: 1, scale: 1 }}
             className="absolute -top-1 -right-1 w-5 h-5 bg-brand-accent rounded-full border-2 border-white flex items-center justify-center text-[8px] font-black"
           >
             AI
           </motion.div>
        )}
      </motion.button>
    </div>
  );
}
