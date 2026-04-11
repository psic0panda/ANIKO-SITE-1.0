"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AiChat({ isHigh = false }: { isHigh?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Olá! Eu sou o assistente do Aniko. Como posso ajudar você hoje com dúvidas sobre animações, rotinas ou TEA? 😊" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Começa mudo por padrão (melhor UX sensorial)
  const scrollRef = useRef<HTMLDivElement>(null);

  const speak = (text: string) => {
    if (isMuted || typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.0; 
    utterance.pitch = 1.7; // Voz bem fininha e parecida com desenho animado
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Falar automaticamente quando a IA responder
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'assistant' && !isLoading && !isMuted) {
      speak(lastMessage.content);
    }
  }, [messages, isLoading, isMuted]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    const currentMessages = [...messages, { role: "user", content: userMessage }];
    
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // Normaliza para busca de palavra cheia e sem pontuação
      const m = ` ${userMessage.toLowerCase().replace(/[.,!?;]/g, " ")} `; 

      // 1. REGRAS FIXAS (Garantia de acerto para itens críticos)
      let aiResponseParts: string[] = [];
      
      if (m.includes(" contato ") || m.includes(" falar com ") || m.includes(" email ") || m.includes(" whatsapp ") || m.includes(" número ") || m.includes(" telefone ") || m.includes(" suporte ")) {
        aiResponseParts.push("Para dúvidas de suporte ou falar com o criador, basta acessar a nossa página de **Contato** no menu superior! 📱✨");
      } 
      
      if (m.includes(" preço ") || m.includes(" valor ") || m.includes(" quanto ") || m.includes(" custo ") || m.includes(" pagar ") || m.includes(" pago ") || m.includes(" pagos ") || m.includes(" preços ") || m.includes(" valores ")) {
        aiResponseParts.push("Cada vídeo personalizado do Aniko custa R$ 80,00. É um investimento no desenvolvimento lúdico da sua criança! 💰🐧");
      }

      if (aiResponseParts.length > 0) {
        setMessages((prev) => [...prev, { role: "assistant", content: aiResponseParts.join(" Além disso, ") }]);
        setIsLoading(false);
        return;
      }

      // 2. Cérebro de IA (Gemini)
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: currentMessages }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
      setIsLoading(false);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Minha conexão com a geleira falhou! ❄️ Mas já estou tentando de novo..." }]);
      setIsLoading(false);
    }
  };

  return (
    <div className={`fixed right-8 z-[100] font-sans transition-all duration-700 ease-in-out ${isHigh ? 'top-8' : 'bottom-8'}`}>
      {/* Balão de Chat */}
      {isOpen && (
        <div className="mb-4 w-[350px] md:w-[400px] h-[500px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-scale-up origin-bottom-right">
          {/* Header */}
          <div className="bg-brand-primary p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full border-2 border-white/20 overflow-hidden shadow-inner bg-white">
                 <img src="/assets/avatars/avatar_aniko.png" alt="Aniko" className="w-full h-full object-cover rounded-full" />
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
                  if (newMuted) window.speechSynthesis.cancel();
                  else {
                    const lastMsg = messages[messages.length - 1];
                    if (lastMsg && lastMsg.role === 'assistant') {
                      setTimeout(() => {
                        const utterance = new SpeechSynthesisUtterance(lastMsg.content);
                        utterance.lang = 'pt-BR';
                        utterance.rate = 1.0;
                        utterance.pitch = 1.7;
                        window.speechSynthesis.speak(utterance);
                      }, 100);
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
              <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`group relative max-w-[85%] px-4 py-3 rounded-2xl text-sm font-medium shadow-sm transition-all ${
                  m.role === 'user' 
                    ? 'bg-brand-accent text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                }`}>
                  {m.content}
                  {m.role === 'assistant' && (
                    <button 
                      onClick={() => speak(m.content)}
                      className="absolute -right-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 h-8 w-8 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center text-xs text-slate-400 hover:text-brand-accent transition-all animate-fade-in"
                      title="Ouvir novamente"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 4 12 11 19"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-white px-4 py-3 rounded-2xl border border-slate-100 rounded-tl-none flex gap-1">
                   <div className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" />
                   <div className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                   <div className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2">
            <input 
              type="text" 
              placeholder="Digite sua dúvida..."
              className="flex-1 bg-slate-50 px-4 py-3 rounded-xl text-sm border-2 border-transparent focus:border-brand-accent outline-none text-brand-primary font-medium"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button 
              type="submit"
              disabled={isLoading}
              className="h-11 w-11 bg-brand-primary text-white rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-50"
            >
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
            </button>
          </form>
        </div>
      )}

      {/* Botão para Abrir */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`h-16 w-16 md:h-20 md:w-20 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-90 transition-all border-4 border-white ${isOpen ? 'rotate-90' : 'rotate-0'}`}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        ) : (
          <div className="relative h-full w-full rounded-full overflow-hidden border-2 border-white/20 bg-white">
             <img src="/assets/avatars/avatar_aniko.png" alt="Aniko" className="w-full h-full object-cover rounded-full" />
             <div className="absolute top-2 right-2 h-4 w-4 bg-brand-accent rounded-full border-2 border-white z-10" />
          </div>
        )}
      </button>
    </div>
  );
}
