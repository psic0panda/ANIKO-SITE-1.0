'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useSensory } from '@/context/SensoryContext';
import { Volume2, VolumeX, X } from 'lucide-react';

interface SensoryHubProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SensoryHub({ isOpen, onClose }: SensoryHubProps) {
  const { 
    isSensoryFriendly, toggleSensoryFriendly,
    isAudioEnabled, toggleAudio
  } = useSensory();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="md:absolute md:top-full md:right-0 mt-4 z-[100] glass-modern p-6 rounded-[2rem] shadow-2xl border-2 border-brand-primary/10 flex flex-col gap-6 min-w-[280px] w-full md:w-auto"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg text-brand-primary">Configurações</h3>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-brand-primary/5 rounded-full transition-colors md:block hidden"
            >
              <X size={18} className="text-brand-primary/40" />
            </button>
          </div>

          {/* Sensory Mode Toggle */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/40 border border-white/60">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-brand-primary">Vibração e Motion</span>
              <span className="text-[10px] text-brand-primary/50">Reduzir estímulos</span>
            </div>
            <button
              onClick={toggleSensoryFriendly}
              className={`relative w-12 h-7 rounded-full transition-colors duration-500 ${isSensoryFriendly ? 'bg-brand-accent' : 'bg-slate-200'}`}
            >
              <motion.div 
                animate={{ x: isSensoryFriendly ? 24 : 4 }}
                className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm flex items-center justify-center text-[8px]"
              >
                {isSensoryFriendly ? '✨' : '☁️'}
              </motion.div>
            </button>
          </div>

          {/* Audio Toggle */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/40 border border-white/60">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-brand-primary">Sons Relaxantes</span>
              <span className="text-[10px] text-brand-primary/50">Ambiente calmo</span>
            </div>
            <button
              onClick={toggleAudio}
              className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${isAudioEnabled ? 'bg-brand-secondary text-brand-primary shadow-inner scale-95' : 'bg-white text-slate-400 border border-slate-100'}`}
            >
              {isAudioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
          </div>

          <div className="text-[10px] text-center text-brand-primary/20 font-medium">
            Personalize sua experiência Aniko 🐧
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
