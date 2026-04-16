"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const proactiveMessages = [
  "Olá! Posso te ajudar com dúvidas sobre animações ou TEA! 🐧💙",
  "Ei! Sabia que Video Modeling ajuda muito no desenvolvimento? 🎬",
  "Posso responder sobre comunicação, rotinas ou habilidades sociais!",
  "Você conhece o PECS? É um sistema de comunicação por figuras muito legal! 📋",
  "Quer saber quais habilidades podemos trabalhar nos vídeos? É só perguntar!",
  "Estou aqui caso quiser conversar sobre estratégias para crianças com TEA 🧸",
  "O Daniel Tigre ensina crianças a lidar com emoções! 😊",
  "Posso ajudar com qualquer dúvida sobre o desenvolvimento infantil!",
  "Você sabia que crianças com TEA aprendem muito bem com vídeos demonstrativos? 🎥",
  "Que tal criarmos uma história sobre um pinguim que aprende a fazer novos amigos? 🐧",
  "Emoções são como nuvens - cada uma tem seu formato! ☁️ Como você está se sentindo?",
  "Sabia que rotinas visuais ajudam muito no dia a dia? 📅",
  "Posso te contar como o PECS ajuda crianças a se comunicarem! 📋",
  "O que você acha de criarmos um vídeo sobre escovar os dentes? 🦷",
  "Você conhece algum criança que amaanimais? 🐶",
  "Crianças com TEA têm pontos fortes incríveis, como atenção aos detalhes! ⭐",
  "Quer saber como os vídeos personalizados podem ajudar no aprendizado? 📚",
  "A comunicação visual é muito poderosa! 🖼️",
  "Você sabia que o tempo de tela pode ser educativo com o conteúdo certo? 📱",
  "Posso te ajudar a criar uma história divertida para os vídeos! 📖",
  "Emoções são ensináveis! Falei com o Aniko sobre isso! 💭",
  "Você conhece a teoria da mente? É sobre entender o que os outros pensam! 🧠",
  "Quer ideas de atividades sensoriais para fazer em casa? 🎨",
  "O que você achou do último vídeo que assistiu? 🎞️",
  "Sabia que músicas e repetições ajudam na memorização? 🎵",
  "Posso te explicar como funciona o Video Modeling! 📹",
  "Você sabia que pinguins são animais muito sociáveis? 🐧",
  "Que tal um vídeo sobre organizar brinquedos? 🧸",
  "Quer saber mais sobre sinais de alerta do autismo? 🚩",
  "A previsibilidade ajuda muito crianças com TEA! ⏰",
  "Posso criar vídeos sobre qualquer habilidade que você quiser! ✨",
  "Você conhece o conceito de Interests Special? 🌟",
  "Emoji são ótimos para comunicar emoções! 😃",
  "Quer aprender sobre estratégias de modificação ambiental? 🏠",
  "Crianças com TEA podem ter habilidades extraordinárias! 🚀",
  "Que tal um vídeo sobre saying goodbye? 👋",
  "Posso te contar segredos sobre como fazer vídeos educativos! 🎓",
  "Você sabia que desenhar ajuda no desenvolvimento? ✏️",
  "Quer ideas de jogos sensoriais? 🎯",
  "O tempo de transição pode ser difícil para algumas crianças! ⏳",
  "Você conhece o método ABA? É uma abordagem bem conhecida! 📘",
  "Quer saber como tornar a escola mais inclusiva? 🏫",
  "Posso criar vídeos com personagens que sua criança ama! ⭐",
  "Você sabia que o brincar livre é muito importante? 🧩",
  "Quer aprender sobre recursos visuais para comunicação? 🗺️",
  "As crianças com TEA têm direito a accompaniment especializado! 👩‍⚕️",
  "Que tal um vídeo sobre taking turns? 🔄",
  "Posso te ajudar a criar um cronograma visual! 📆",
  "Você conhece o método TEACCH? É muito usado! 📚",
  "Quer saber como lidar com melt downs? 😤",
  "A família é super importante no tratamento! 👨‍👩‍👧‍👦",
  "Você sabia que animais de estimação podem ajudar no desenvolvimento? 🐕",
  "Quer ideas de livros infantis sobre emoções? 📕",
  "Posso criar vídeos sobre higiene pessoal! 🛁",
  "Você conhece o conceito de scaffolding? 🪜",
  "Quer aprender sobre integração sensorial? 🤲",
  "Vídeos com repeat são ótimos para aprender! 🔁",
  "Você sabia que pinguins vivem em colônias? São bem sociáveis! 🐧",
  "Quer saber mais sobre inclusion na escola? 🤝",
  "Posso te dar ideas de atividades para férias! ☀️",
  "Você conhece estratégias de antecipação? 📋",
  "Quer aprender sobre comunicação aumentativa? 📢",
  "O que sua criança mais gosta de assistir? 📺",
  "Posso criar vídeos sobre rotinas de manhã! 🌅",
  "Você sabia que o abraço profundo ajuda no regulation? 🤗",
  "Quer ideas de jogos cooperativos? 🎲",
  "A constância do objeto é algo que podemos trabalhar! 🎁",
  "Posso fazer um vídeo sobre colors e formas! 🎨",
  "Você conhece o闪卡 sistema de cartões? 🃏",
  "Quer aprender sobre estratégias visuais para transitions? 🪄",
  "Você sabia que música ajuda no desenvolvimento da linguagem? 🎶",
  "Posso criar vídeos sobre fazer escolhas! ✅",
  "Quer saber como trabalhar habilidades acadêmicas? 📖",
  "Você conhece o programa Floortime? É bem legal! 🏠",
  "Quer ideas de atividades outdoor? 🌳",
  "A paciência é uma habilidade que pode ser ensinada! 🧘",
  "Posso fazer um vídeo sobre waiting patiently! ⏰",
  "Você sabia que crianças com TEA podem ter boa memória? 🧮",
  "Quer aprender sobre sistemas de rewards? 🏆",
  "O que você mais gostaria de ver nos vídeos? 💡",
  "Posso criar vídeos sobre animals do mar! 🐠",
  "Você conhece estratégias de redirection? ➡️",
  "Quer saber como trabalhar a motricidade fina? ✋",
  "A comunicação gestual pode ajudar muito! 🙌",
  "Posso fazer um vídeo sobre say please e thank you! 🙏",
  "Você sabia que o pinguim Imperador toma conta dos ovos? 🥚",
  "Quer ideas de receitas educativas? 🍪",
  "O que делает sua criança feliz? 😊",
  "Posso criar vídeos sobre limpeza pessoal! 🧼",
  "Você conhece o conceito de neurodiversity? 🌈",
  "Quer aprender sobre self-care para os pais! 🫶",
  "A família toda pode participar do tratamento! 👨‍👩‍👧",
  "Posso fazer um vídeo sobre brush teeth! 🦷",
  "Você sabia que pinguins não voam, mas nadam muito bem? 🏊",
  "Quer ideas de projetos artísticos? 🎭",
  "O support correto faz toda a diferença! 💪",
  "Posso criar vídeos sobre any topic que você quiser! 🎯",
  "Você conhece occupational therapy? 👨‍⚕️",
  "Quer aprender sobre speech therapy? 🗣️",
  "A early intervention é muito importante! 🎯",
  "Posso fazer um vídeo sobre days of the week! 📅",
  "Você sabia que cada pinguim tem uma voz diferente? 🐧",
  "Quer ideas de livros para trabalhar emoções? 📚",
  "O love é o ingrediente mais importante! ❤️",
  "Posso criar vídeos sobre animals da fazenda! 🐄",
  "Você conhece o conceito de joint attention? 👀",
  "Quer aprender sobre estratégias de play therapy? 🧸",
  "Você sabia que pinguins se cumprimentam com beijos no bico? 💋",
  "Posso fazer um vídeo sobre números e contagem! 🔢",
  "Quer ideas de atividades de science? 🔬",
  "A consistency é chave no tratamento! 🔑",
  "Posso criar vídeos sobre formas geométricas! 🔷",
  "Você conhece o método Denver? É bem eficiente! 💯",
  "Quer aprender sobre como lidar com a ansiedade? 😟",
  "O que você gostaria de perguntar para o Aniko? 🐧",
  "Posso fazer um vídeo sobre seasons do ano! 🍂",
  "Você sabia que pinguins podem viver mais de 20 anos? 🐧",
  "Quer ideas de atividades sensoriais com água? 💧",
  "A love acceptance é fundamental! 💜",
  "Posso criar vídeos sobre letras do alfabeto! 🔤",
  "Você conhece recursos tecnológicos para comunicação? 📲",
  "Quer aprender sobre estratégias de calming? 🧘‍♀️",
  "O apoio da escola é muito importante! 🏫",
  "Posso fazer um vídeo sobre body parts! 🦴",
  "Você sabia que pinguins se abraçam para se aquecer? 🤗",
  "Quer ideas de atividades com música? 🎵",
  "A paciência e persistência são essenciais! 💪",
  "Posso criar vídeos sobre cores! 🌈",
  "Você conhece o concepto de inclusión social? 🤝",
  "Quer aprender sobre habilidades de vida diária? 🏠",
  "Você sabia que existem 18 espécies de pinguins? 🐧",
  "Posso fazer um vídeo sobre telling time! ⏰",
  "Quer ideas de jogos de tabuleiro educativos? 🎲",
  "A family involvement mejora muito os resultados! 👨‍👩‍👧‍👦",
  "Posso criar vídeos sobre profissões! 👷",
  "Você sabia que pinguins exchanges de parceiro? 💕",
  "Quer aprender sobre estratégias de comportamento? 📊",
  "O progresso pode ser pequeno, mas é válido! 🎉",
  "Posso fazer um vídeo sobre alimentos saudáveis! 🥦",
  "Você conhece o support de peers? 👯",
  "Quer ideas de crafts simples? ✂️",
  "A communication é um direito de todos! 📢",
  "Posso criar vídeos sobre natureza! 🌳",
  "Você sabia que pinguins se ajudam mutuamente? 🐧",
  "Quer aprender sobre self-advocacy? 🗣️",
  "O que mais te importa sobre o desenvolvimento? 💭",
  "Posso fazer um vídeo sobre good manners! 👋",
  "Você sabia que o Aniko adora fazer novos amigos? 🐧💖",
  "Quer ideas de atividades para o fim de semana? 🎊",
  "A celebration de pequenas conquistas é importante! 🥳",
  "Posso criar vídeos sobre países do mundo! 🌍",
  "Você conhece recursos de aprendizagem online? 💻",
  "Quer aprender sobre music therapy? 🎶",
  "O Aniko está aqui para ajudar! 🐧✨",
];

export default function AiChat({ isHigh = false }: { isHigh?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Olá! Sou o Aniko, seu amigo pinguim! 🐧 Como posso te ajudar hoje?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showProactiveBadge, setShowProactiveBadge] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastProactiveTime = useRef<number>(0);

  const playNotificationSound = useCallback(async () => {
    if (typeof window === 'undefined' || isMuted) return;
    
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
  }, [isMuted]);

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

  const performProactiveMessage = useCallback(() => {
    const now = Date.now();
    if (now - lastProactiveTime.current < 13000) return;
    if (messages.length === 0) return;
    if (isOpen) return;
    if (isLoading) return;
    
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'user' && !isLoading) return;
    
    lastProactiveTime.current = now;
    const randomIndex = Math.floor(Math.random() * proactiveMessages.length);
    const newMessage = proactiveMessages[randomIndex];
    
    setMessages(prev => [...prev, { role: "assistant", content: newMessage }]);
    setShowProactiveBadge(true);
    setPopupMessage(newMessage);
    setShowPopup(true);
    performNotificationBeep();
    
    setTimeout(() => setShowPopup(false), 4000);
    
    setTimeout(() => setShowProactiveBadge(false), 5000);
  }, [messages, isOpen, isLoading, performNotificationBeep]);

  useEffect(() => {
    const interval = setInterval(() => {
      performProactiveMessage();
    }, 15000);
    
    return () => clearInterval(interval);
  }, [performProactiveMessage]);

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
        console.error('TTS Error:', data.error, data.details);
        fallbackSpeak(text);
      }
    } catch (err) {
      console.error('TTS Error:', err);
      fallbackSpeak(text);
    }
  }, [isMuted]);

  const fallbackSpeak = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.5;
    utterance.pitch = 2.0;
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
        aiResponseParts.push("Para dúvidas de suporte ou falar com o criador, basta acessar a nossa página de **Contato** no menu superior! 📱✨");
      } 
      
      if (m.includes(" preço ") || m.includes(" valor ") || m.includes(" quanto ") || m.includes(" custo ") || m.includes(" pagar ") || m.includes(" pago ") || m.includes(" pagos ") || m.includes(" preços ") || m.includes(" valores ")) {
        aiResponseParts.push("Cada vídeo personalizado do Aniko custa R$ 80,00. É um investimento no desenvolvimento lúdico da sua criança! 💰🐧");
      }

      if (aiResponseParts.length > 0) {
        setMessages((prev) => [...prev, { role: "assistant", content: aiResponseParts.join(" Além disso, ") }]);
        playNotificationBeep();
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
        
        setIsLoading(false); // Parar o loading geral

        for (let i = 0; i < parts.length; i++) {
          // Pequeno atraso para parecer que está digitando a próxima mensagem
          if (i > 0) await new Promise(resolve => setTimeout(resolve, 800));
          
          setMessages((prev) => [...prev, { role: "assistant", content: parts[i] }]);
          playNotificationBeep();
        }
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: fullContent }]);
        playNotificationBeep();
        setIsLoading(false);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Ops! Minha conexão com a geleira travou! 🐧 Mas já estou voltando, só um momento..." }]);
      playNotificationBeep();
      setIsLoading(false);
    }
  };

  const handleOpenChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => {
        lastProactiveTime.current = Date.now();
      }, 1000);
    }
  };

  return (
    <div className={`fixed right-8 z-[100] font-sans transition-all duration-700 ease-in-out ${isHigh ? 'top-8' : 'bottom-8'}`}>
      {isOpen && (
        <div className="mb-4 w-[350px] md:w-[400px] h-[500px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-scale-up origin-bottom-right">
          <div className="bg-brand-primary p-6 text-white flex items-center justify-between">
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
                onClick={async () => {
                  const newMuted = !isMuted;
                  setIsMuted(newMuted);
                  if (!newMuted) {
                    const lastMsg = messages[messages.length - 1];
                    if (lastMsg && lastMsg.role === 'assistant') {
                      speak(lastMsg.content);
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

      {showPopup && !isOpen && (
        <div className="absolute bottom-4 -left-64 mb-2 mr-2 max-w-[250px] bg-white rounded-2xl shadow-2xl border border-cyan-100 p-3 animate-bounce-once">
          <div className="flex items-start gap-2">
            <img src="/assets/avatars/avatar_aniko.png" alt="Aniko" className="w-8 h-8 rounded-full flex-shrink-0" />
            <p className="text-xs text-slate-700 leading-tight">{popupMessage}</p>
          </div>
        </div>
      )}

      <button 
        onClick={handleOpenChat}
        className={`relative h-16 w-16 md:h-20 md:w-20 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-90 transition-all border-4 border-white ${isOpen ? 'rotate-90' : 'rotate-0'}`}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        ) : (
          <div className="relative h-full w-full rounded-full overflow-hidden border-2 border-white/20 bg-white">
             <img src="/assets/avatars/avatar_aniko.png" alt="Aniko" className="w-full h-full object-cover rounded-full" />
             {showProactiveBadge && (
               <div className="absolute top-2 right-2 h-4 w-4 bg-green-400 rounded-full border-2 border-white z-10 animate-pulse" />
             )}
             {!showProactiveBadge && (
               <div className="absolute top-2 right-2 h-4 w-4 bg-brand-accent rounded-full border-2 border-white z-10" />
             )}
          </div>
        )}
      </button>
    </div>
  );
}
