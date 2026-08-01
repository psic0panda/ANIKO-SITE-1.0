"use client";

import { useState } from "react";
import { Sparkles, Zap, ShieldCheck, Volume2, Eye, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SensoryPreviewPlayer() {
  const [isAdapted, setIsAdapted] = useState(true);
  const [animKey, setAnimKey] = useState(0);

  return (
    <section className="w-full py-16 px-4 md:px-8 max-w-6xl mx-auto sensory-demo">
      <div className="text-center space-y-4 mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-accent/15 text-brand-primary text-xs font-black uppercase tracking-wider">
          <Sparkles size={14} className="text-brand-accent" />
          <span>Demonstração Interativa</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-brand-primary tracking-tight">
          Sinta a Diferença do <span className="text-brand-accent">Estímulo Adaptativo</span>
        </h2>
        <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto font-medium">
          Compare como uma animação comum pode sobrecarregar os sentidos da criança com autismo versus como a tecnologia <strong>ANIKO</strong> suaviza o som, as cores e a velocidade.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-100 shadow-2xl space-y-6">
        {/* Toggle Switch Topo */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">Modo de Exibição:</span>
          </div>

          <div className="flex bg-slate-200/70 p-1 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setIsAdapted(false)}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                !isAdapted 
                  ? "bg-red-500 text-white shadow-md font-black" 
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Zap size={14} />
              <span>Animação Comum (Alto Estímulo)</span>
            </button>

            <button
              onClick={() => setIsAdapted(true)}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                isAdapted 
                  ? "bg-brand-accent text-white shadow-md font-black" 
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ShieldCheck size={14} />
              <span>Padronização ANIKO (Adaptada)</span>
            </button>
          </div>
        </div>

        {/* Player Simulado */}
        <motion.div 
          animate={{
            backgroundColor: isAdapted ? "#0F2B48" : "#EF4444",
            borderColor: isAdapted ? "rgba(52, 211, 153, 0.4)" : "#F59E0B"
          }}
          transition={{ duration: 0.5 }}
          className={`relative w-full aspect-video rounded-2xl overflow-hidden border-4 flex flex-col justify-between p-6 ${
            isAdapted 
              ? "bg-gradient-to-br from-[#0F2B48] via-[#163D63] to-[#0A1F33] shadow-inner" 
              : "bg-gradient-to-br from-yellow-400 via-red-500 to-purple-600"
          }`}
        >
          {/* Badge Indicador de Modo */}
          <div className="flex justify-between items-center z-10">
            <motion.div 
              animate={!isAdapted ? { scale: [1, 1.08, 1], y: [0, -4, 0] } : { scale: 1, y: 0 }}
              transition={{ repeat: Infinity, duration: 0.6 }}
              className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg ${
                isAdapted ? "bg-emerald-500 text-white" : "bg-red-600 text-white"
              }`}
            >
              {isAdapted ? <ShieldCheck size={14} /> : <Zap size={14} />}
              <span>{isAdapted ? "ANIKO: Estímulo Controlado" : "Alerta: Alto Risco Sensorial"}</span>
            </motion.div>

            <button 
              onClick={() => setAnimKey(k => k + 1)} 
              className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-2 rounded-xl transition-all active:scale-90"
              title="Reiniciar Animação"
            >
              <RefreshCw size={16} className="animate-spin-slow" />
            </button>
          </div>

          {/* Personagens Simulado no Player */}
          <div className="relative z-10 text-center space-y-4 my-auto">
            <div key={animKey} className="flex justify-center items-center gap-8 py-2">
              {/* Pinguim 🐧 */}
              <motion.div
                animate={isAdapted ? {
                  y: [0, -12, 0],
                  rotate: [0, 4, -4, 0],
                  scale: 1
                } : {
                  y: [0, -30, 0, -18, 0],
                  rotate: [-10, 10, -10, 10, 0],
                  scale: [1.25, 1.35, 1.25]
                }}
                transition={{
                  repeat: Infinity,
                  duration: isAdapted ? 3.5 : 0.6,
                  ease: "easeInOut"
                }}
                className="inline-block"
              >
                <span className="text-7xl md:text-8xl filter drop-shadow-xl inline-block select-none">🐧</span>
              </motion.div>

              {/* Estrela ⭐ */}
              <motion.div
                animate={isAdapted ? {
                  scale: [1, 1.1, 1],
                  opacity: [1, 0.85, 1]
                } : {
                  rotate: [0, 360],
                  scale: [1.2, 1.4, 1.2]
                }}
                transition={{
                  repeat: Infinity,
                  duration: isAdapted ? 2.5 : 0.8,
                  ease: isAdapted ? "easeInOut" : "linear"
                }}
                className="inline-block"
              >
                <span className="text-6xl md:text-7xl inline-block select-none">⭐</span>
              </motion.div>
            </div>

            <div className="bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl inline-block max-w-md mx-auto border border-white/10">
              <AnimatePresence mode="wait">
                <motion.p 
                  key={isAdapted ? "adapted" : "high"}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-white text-xs md:text-sm font-bold"
                >
                  {isAdapted 
                    ? "« Olá, João! Vamos juntos aprender a lavar as mãos bem calminho? »" 
                    : "« VAMOS LÁ!!! PULA PULA CORRE CORRE RÁPIDO VAMOS VER O QUE ACONTECE!!! »"
                  }
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* Rodapé do Player */}
          <div className="relative z-10 flex justify-between items-center text-xs text-white/80 border-t border-white/10 pt-3">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 font-mono">
                <Volume2 size={14} /> {isAdapted ? "Áudio Equalizado (Low-Peak)" : "Áudio Agudo e Irregular"}
              </span>
              <span className="hidden md:flex items-center gap-1 font-mono">
                <Eye size={14} /> {isAdapted ? "60 FPS Suave / Filtro Pastel" : "Cores Saturadas / Piscadas"}
              </span>
            </div>
            <span className="font-bold text-white uppercase">{isAdapted ? "Seguro para TEA" : "Estímulo Elevado"}</span>
          </div>
        </motion.div>

        {/* Quadro Comparativo de Recursos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <p className="text-xs font-black text-brand-primary flex items-center gap-1.5">
              <span>🎨</span> Cores Adaptadas
            </p>
            <p className="text-[11px] text-slate-500">Substituição de vermelhos agressivos e neons por tons pastéis acolhedores.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <p className="text-xs font-black text-brand-primary flex items-center gap-1.5">
              <span>🔊</span> Controle Sonoro
            </p>
            <p className="text-[11px] text-slate-500">Vozes locutadas com entonação previsível sem gritos ou efeitos estridentes.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <p className="text-xs font-black text-brand-primary flex items-center gap-1.5">
              <span>🧠</span> Validação ABA
            </p>
            <p className="text-[11px] text-slate-500">Roteiro baseado em Video Modeling com reforçamento positivo controlado.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
