"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AiChat({ isHigh = false }: { isHigh?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Olá! Sou o Aniko, seu amigo pinguim! 🐧 Como posso te ajudar hoje com suas dúvidas sobre nossos vídeos, planos ou desenvolvimento infantil?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const performNotificationBeep = useCallback(async () => {
    if (typeof window === 'undefined') return;
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
      console.log('Audio not supported');
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const performTTS = useCallback(async (text: string) => {
    if (isMuted) return;
    
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      
      const data = await res.json();
      
      if (data.audioContent) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
        audio.play();
      } else {
        fallbackSpeak(text);
      }
    } catch (err) {
      fallbackSpeak(text);
    }
  }, [isMuted]);

  const fallbackSpeak = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    utterance.pitch = 1.3;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'assistant' && !isLoading && !isMuted) {
      performTTS(lastMessage.content);
    }
  }, [messages, isLoading, isMuted, performTTS]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    const currentMessages = [...messages, { role: "user", content: userMessage }];
    
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const m = ` ${userMessage.toLowerCase().replace(/[.,!?;]/g, " ")} `; 
      const aiResponseParts: string[] = [];
      
      if (m.includes(" contato ") || m.includes(" falar com ") || m.includes(" email ") || m.includes(" whatsapp ") || m.includes(" número ") || m.includes(" telefone ") || m.includes(" suporte ")) {
        aiResponseParts.push("Para dúvidas de suporte direto com o criador Henrique, você pode clicar em 'Falar com Suporte (WhatsApp)' no menu do assistente ou mandar um WhatsApp para (81) 98842-0706! 📱✨");
      } 
      
      if (m.includes(" preço ") || m.includes(" valor ") || m.includes(" quanto ") || m.includes(" custo ") || m.includes(" pagar ") || m.includes(" plano ") || m.includes(" planos ") || m.includes(" pacotes ") || m.includes(" assinatura ")) {
        aiResponseParts.push("O Aniko tem planos flexíveis para o desenvolvimento do seu pequeno:\n\n• Vídeo Avulso: R$ 80,00 por vídeo personalizado.\n• Plano Mensal: R$ 80,00/mês (1 vídeo + Guia Pedagógico).\n• Plano Trimestral: R$ 210,00 (3 vídeos com R$ 30,00 de desconto!).\n• Plano Anual: R$ 720,00 (12 vídeos por apenas R$ 60,00/vídeo!).\n\n🎁 Programa Indique e Ganhe: A cada 2 amigos que assinarem com seu código, você ganha 1 Aniko bônus!");
      }

      if (aiResponseParts.length > 0) {
        setMessages((prev) => [...prev, { role: "assistant", content: aiResponseParts.join("\n\n") }]);
        performNotificationBeep();
        setIsLoading(false);
        return;
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: currentMessages }),
      });

      const data = await res.json();
      const fullContent = data.content;

      if (fullContent && fullContent.includes("---")) {
        const parts = fullContent.split("---").map((p: string) => p.trim()).filter(Boolean);
        
        setIsLoading(false);

        for (let i = 0; i < parts.length; i++) {
          if (i > 0) await new Promise(resolve => setTimeout(resolve, 800));
          
          setMessages((prev) => [...prev, { role: "assistant", content: parts[i] }]);
          performNotificationBeep();
        }
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: fullContent }]);
        performNotificationBeep();
        setIsLoading(false);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Ops! Tive um probleminha de conexão! 🐧 Pode tentar me perguntar novamente?" }]);
      performNotificationBeep();
      setIsLoading(false);
    }
  };

  const handleMascotClick = () => {
    if (isOpen) {
      setIsOpen(false);
      setShowOptionsMenu(false);
    } else if (showOptionsMenu) {
      setShowOptionsMenu(false);
    } else {
      setShowOptionsMenu(true);
    }
  };

  return (
    <div className={`fixed right-6 md:right-8 z-[100] font-sans transition-all duration-300 ${isHigh ? 'top-8' : 'bottom-6 md:bottom-8'}`}>
      
      {/* Menu de Opções Rápida (Falar com Suporte WhatsApp vs Tirar Dúvidas com o Aniko) */}
      {showOptionsMenu && !isOpen && (
        <div className="mb-4 w-[280px] sm:w-[320px] bg-white dark:bg-[#0F1F35] rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 animate-scale-up origin-bottom-right text-slate-800 dark:text-white">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="h-10 w-10 rounded-full border-2 border-brand-accent/40 overflow-hidden shadow-inner bg-white relative shrink-0">
              <Image src="/assets/avatars/avatar_aniko.png" alt="Aniko" fill className="object-cover" />
            </div>
            <div>
              <p className="font-black text-sm text-brand-primary dark:text-white">Assistente Aniko 🐧</p>
              <p className="text-[10px] text-slate-400 font-bold">Como posso te ajudar?</p>
            </div>
          </div>

          <div className="space-y-2">
            {/* Opção 1: Falar com Suporte (WhatsApp Direct) */}
            <a 
              href="https://wa.me/5581988420706?text=Ol%C3%A1!%20Vim%20pelo%20site%20ANIKO%20e%20gostaria%20de%20falar%20com%20o%20suporte."
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowOptionsMenu(false)}
              className="w-full p-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl flex items-center gap-3 transition-all font-black text-xs shadow-md group"
            >
              <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                💬
              </div>
              <div className="text-left flex-1">
                <span className="block text-white font-black">Falar com Suporte</span>
                <span className="text-[10px] text-emerald-100 font-bold block">WhatsApp direto (Henrique)</span>
              </div>
            </a>

            {/* Opção 2: Tirar Dúvida com o Aniko AI */}
            <button
              onClick={() => {
                setShowOptionsMenu(false);
                setIsOpen(true);
              }}
              className="w-full p-3.5 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-2xl flex items-center gap-3 transition-all font-black text-xs shadow-md group"
            >
              <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                🤖
              </div>
              <div className="text-left flex-1">
                <span className="block text-white font-black">Tirar Dúvida com Aniko</span>
                <span className="text-[10px] text-slate-200 font-bold block">Conversar sobre os vídeos e TEA</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Janela Principal de Chat da IA */}
      {isOpen && (
        <div className="mb-4 w-[340px] sm:w-[380px] md:w-[400px] h-[480px] sm:h-[520px] bg-white dark:bg-[#0F1F35] rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden animate-scale-up origin-bottom-right text-slate-800 dark:text-white">
          <div className="bg-brand-primary p-5 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full border-2 border-white/20 overflow-hidden shadow-inner bg-white relative">
                 <Image src="/assets/avatars/avatar_aniko.png" alt="Aniko" fill className="object-cover rounded-full" />
              </div>
              <div>
                <p className="font-black text-sm uppercase tracking-tight">Assistente Aniko</p>
                <div className="flex items-center gap-1.5">
                   <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                   <p className="text-[10px] font-bold text-white/70">Online agora</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  const newMuted = !isMuted;
                  setIsMuted(newMuted);
                  if (!newMuted) {
                    const lastMsg = messages[messages.length - 1];
                    if (lastMsg && lastMsg.role === 'assistant') {
                      performTTS(lastMsg.content);
                    }
                  }
                }}
                className="h-9 w-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-all text-white"
                title={isMuted ? "Ativar Voz" : "Desativar Voz"}
              >
                {isMuted ? (
                   <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m11 5-7 7 7 7"/><path d="M22 9 16 15"/><path d="M16 9 22 15"/></svg>
                ) : (
                   <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 4 12 11 19"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                )}
              </button>
              <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors p-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50 dark:bg-[#070E1B] custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`group relative max-w-[85%] px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium shadow-sm transition-all whitespace-pre-wrap ${
                  m.role === 'user' 
                    ? 'bg-brand-accent text-white rounded-tr-none' 
                    : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white border border-slate-100 dark:border-slate-800 rounded-tl-none'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-white dark:bg-slate-900 px-4 py-3 rounded-2xl border border-slate-100 dark:border-slate-800 rounded-tl-none flex gap-1">
                   <div className="h-1.5 w-1.5 bg-brand-accent rounded-full animate-bounce" />
                   <div className="h-1.5 w-1.5 bg-brand-accent rounded-full animate-bounce [animation-delay:0.2s]" />
                   <div className="h-1.5 w-1.5 bg-brand-accent rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="p-3 bg-white dark:bg-[#0F1F35] border-t border-slate-100 dark:border-slate-800 flex gap-2">
            <input 
              type="text" 
              placeholder="Digite sua dúvida..."
              className="flex-1 bg-slate-50 dark:bg-slate-900 px-4 py-3 rounded-xl text-xs sm:text-sm border-2 border-transparent focus:border-brand-accent outline-none text-slate-900 dark:text-white font-medium"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button 
              type="submit"
              disabled={isLoading}
              className="h-11 w-11 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-50 shrink-0"
            >
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
            </button>
          </form>
        </div>
      )}

      {/* Mascote Flutuante do Aniko */}
      <button 
        onClick={handleMascotClick}
        className={`relative h-16 w-16 md:h-20 md:w-20 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-90 transition-all border-4 border-white dark:border-slate-800 ${isOpen || showOptionsMenu ? 'rotate-90' : 'rotate-0'}`}
        title="Assistente Aniko"
      >
        {isOpen || showOptionsMenu ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        ) : (
          <div className="relative h-full w-full rounded-full overflow-hidden border-2 border-white/20 bg-white">
             <Image src="/assets/avatars/avatar_aniko.png" alt="Aniko" fill className="object-cover rounded-full" />
             <div className="absolute top-2 right-2 h-3.5 w-3.5 bg-emerald-400 rounded-full border-2 border-white z-10" />
          </div>
        )}
      </button>
    </div>
  );
}
