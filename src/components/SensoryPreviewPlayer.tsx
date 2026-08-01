"use client";

import { useState } from "react";
import { Sparkles, Zap, ShieldCheck, Volume2, Eye, RefreshCw } from "lucide-react";

export default function SensoryPreviewPlayer() {
  const [isAdapted, setIsAdapted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [animKey, setAnimKey] = useState(0);

  return (
    <section className="w-full py-16 px-4 md:px-8 max-w-6xl mx-auto">
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
        <div 
          className={`relative w-full aspect-video rounded-2xl overflow-hidden transition-all duration-700 border-4 flex flex-col justify-between p-6 ${
            isAdapted 
              ? "bg-gradient-to-br from-[#0F2B48] via-[#163D63] to-[#0A1F33] border-brand-accent/40 shadow-inner" 
              : "bg-gradient-to-br from-yellow-400 via-red-500 to-purple-600 border-red-400 animate-pulse"
          }`}
        >
          {/* Badge Indicador de Modo */}
          <div className="flex justify-between items-center z-10">
            <div className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg ${
              isAdapted ? "bg-emerald-500 text-white" : "bg-red-600 text-white animate-bounce"
            }`}>
              {isAdapted ? <ShieldCheck size={14} /> : <Zap size={14} />}
              <span>{isAdapted ? "ANIKO: Estímulo Controlado" : "Alerta: Alto Risco Sensorial"}</span>
            </div>

            <button 
              onClick={() => { setAnimKey(k => k + 1); setIsPlaying(true); }} 
              className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-2 rounded-xl transition-all active:scale-90"
            >
              <RefreshCw size={16} className="animate-spin-slow" />
            </button>
          </div>

          {/* Personagens Simulado no Player */}
          <div className="relative z-10 text-center space-y-4 my-auto">
            <div key={animKey} className="flex justify-center items-center gap-6">
              <div className={`transition-all duration-700 ${isAdapted ? "scale-100 animate-gentle-wave" : "scale-125 animate-bounce"}`}>
                <span className="text-7xl md:text-8xl filter drop-shadow-xl inline-block">🐧</span>
              </div>
              <div className={`transition-all duration-700 ${isAdapted ? "scale-100 animate-pulse" : "scale-125 animate-spin"}`}>
                <span className="text-6xl md:text-7xl inline-block">⭐</span>
              </div>
            </div>

            <div className="bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl inline-block max-w-md mx-auto border border-white/10">
              <p className="text-white text-xs md:text-sm font-bold">
                {isAdapted 
                  ? "« Olá, João! Vamos juntos aprender a lavar as mãos bem calminho? »" 
                  : "« VAMOS LÁ!!! PULA PULA CORRE CORRE RÁPIDO VAMOS VER O QUE ACONTECE!!! »"
                }
              </p>
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
        </div>

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
