"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AiChat from "@/components/AiChat";
import BackgroundDecor from "@/components/BackgroundDecor";
import { supabase } from "@/lib/supabase";
import { useSensory } from "@/context/SensoryContext";
import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { isSensoryFriendly, toggleSensoryFriendly } = useSensory();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [showVideo, setShowVideo] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleMainCtaClick = () => {
    if (currentUser) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  // Verificar se usuário está logado
  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser(user);
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (profile) setUserProfile(profile);
      }
    }
    checkUser();
  }, []);

  // Efeito de Glassmorphism na Navbar ao rolar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Galeria de Demos
  const demos = [
    { src: '/assets/demos/demo 1.mp4', title: 'Habilidades Sociais' },
    { src: '/assets/demos/demo 2.mp4', title: 'Rotina e Autocuidado' },
    { src: '/assets/demos/demo 3.mp4', title: 'Comunicação e PECS' },
    { src: '/assets/demos/demo 4.mp4', title: 'Interação Lúdica 1' },
    { src: '/assets/demos/demo 5.mp4', title: 'Interação Lúdica 2' },
    { src: '/assets/demos/demo 6.mp4', title: 'Interação Lúdica 3' },
    { src: '/assets/demos/dem7 .mp4', title: 'Demonstração Geral' },
  ];
  const [currentDemoIndex, setCurrentDemoIndex] = useState(0);

  const nextDemo = () => setCurrentDemoIndex((prev) => (prev + 1) % demos.length);
  const prevDemo = () => setCurrentDemoIndex((prev) => (prev - 1 + demos.length) % demos.length);

  // Estados para o drag (arraste) com mouse e auto-scroll
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isPenguinHovered, setIsPenguinHovered] = useState(false);
  const penguinVideoRef = useRef<HTMLVideoElement>(null);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    if (!scrollRef.current) return;
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftState(scrollRef.current.scrollLeft);
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsHovering(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // multiplicador de velocidade
    scrollRef.current.scrollLeft = scrollLeftState - walk;
  };

  // Lógica de Auto-Scroll
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isHovering && !isDragging && scrollRef.current) {
      interval = setInterval(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollLeft += 1;
          
          // Reset para o loop infinito visual
          const maxScroll = (scrollRef.current.scrollWidth * 2) / 3;
          if (scrollRef.current.scrollLeft >= maxScroll) {
             scrollRef.current.scrollLeft = scrollRef.current.scrollWidth / 3;
          }
        }
      }, 30); // Velocidade suave
    }
    return () => clearInterval(interval);
  }, [isHovering, isDragging]);

  // Controlar vídeo do pinguim no hover
  useEffect(() => {
    const video = penguinVideoRef.current;
    if (!video) return;

    const handleEnded = () => {
      video.pause();
    };

    if (isPenguinHovered) {
      video.play();
      video.addEventListener('ended', handleEnded);
    } else {
      video.addEventListener('ended', handleEnded);
    }

    return () => {
      video.removeEventListener('ended', handleEnded);
    };
  }, [isPenguinHovered]);

  const drawings = [
    { src: 'daniel.jpg', name: 'Daniel Tigre', videoIndex: 4 },
    { src: 'bluey.jpg', name: 'Bluey', videoIndex: 1 },
    { src: 'dragon ball.png', name: 'Dragon Ball', videoIndex: 0 },
    { src: 'bob sponja.jpg', name: 'Bob Sponja', videoIndex: 3 },
    { src: 'kratts.jpg', name: 'Irmãos Kratts', videoIndex: 6 },
  ];

  // Triplicar para o efeito infinito visual
  const infiniteDrawings = [...drawings, ...drawings, ...drawings];

  // Centralizar o scroll no início para permitir scroll para os dois lados
  useEffect(() => {
    if (scrollRef.current) {
      const scrollWidth = scrollRef.current.scrollWidth;
      scrollRef.current.scrollLeft = scrollWidth / 3;
    }
  }, []);

  return (
    <main className="relative flex flex-col items-center overflow-hidden bg-white">
      <BackgroundDecor />

      {/* Video Modal Overlay */}
      {showVideo && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-brand-primary/95 p-4 backdrop-blur-xl animate-fade-in">
          {/* Close Button */}
          <button 
            onClick={() => setShowVideo(false)}
            className="absolute top-8 left-8 text-white hover:text-brand-accent transition-colors z-50 p-2 bg-white/10 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>

          {/* Video Container & Navigation */}
          <div className="relative group w-full max-w-4xl flex items-center justify-center -mt-10 md:mt-0">
            
            {/* Prev Button */}
            <button 
              onClick={(e) => { e.stopPropagation(); prevDemo(); }}
              className="absolute left-[-4rem] hidden lg:flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all border border-white/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>

            <div className="relative aspect-[9/16] h-[75vh] md:h-[85vh] overflow-hidden rounded-[3rem] border-8 border-white/20 shadow-2xl animate-scale-up">
              <video 
                key={demos[currentDemoIndex].src}
                src={demos[currentDemoIndex].src} 
                controls 
                autoPlay 
                className="h-full w-full object-cover"
              />
              
              {/* Pagination Dots */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                {demos.map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setCurrentDemoIndex(i)}
                    className={`h-2.5 rounded-full transition-all ${i === currentDemoIndex ? 'bg-brand-accent w-8' : 'bg-white/40 w-2.5 hover:bg-white/60'}`}
                  />
                ))}
              </div>
            </div>

            {/* Next Button */}
            <button 
              onClick={(e) => { e.stopPropagation(); nextDemo(); }}
              className="absolute right-[-4rem] hidden lg:flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all border border-white/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>

          {/* Mobile Arrows */}
          <div className="absolute bottom-12 w-full px-8 flex justify-between lg:hidden pointer-events-none">
            <button 
              onClick={() => prevDemo()} 
              className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white pointer-events-auto active:scale-90 transition-transform"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button 
              onClick={() => nextDemo()} 
              className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white pointer-events-auto active:scale-90 transition-transform"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      )}

      {/* Welcome Video Modal (Standalone) */}
      {showWelcome && (
        <div 
          className="fixed inset-0 z-[70] flex items-center justify-center bg-brand-primary/95 p-4 backdrop-blur-xl animate-fade-in"
          onClick={() => setShowWelcome(false)}
        >
          <button 
            className="absolute top-8 right-8 text-white p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all z-20"
            onClick={() => setShowWelcome(false)}
          >
             <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
          
          <div 
            className="relative w-full max-w-2xl aspect-square rounded-[3rem] overflow-hidden border-8 border-white/20 shadow-2xl animate-scale-up bg-brand-primary/20"
            onClick={(e) => e.stopPropagation()}
          >
            <video 
              src="/assets/bem-vindo_ao_aniko.mp4" 
              controls 
              autoPlay 
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 flex w-full items-center justify-between px-6 py-4 md:px-12 z-50 transition-all duration-300 ${isScrolled ? 'glass-modern py-3 shadow-lg' : 'bg-transparent'}`}>
        <div className="flex items-center gap-3">
          <Image
            src="/assets/logo.jpeg"
            alt="Aniko Logo"
            width={40}
            height={40}
            className="rounded-xl shadow-lg border-2 border-brand-secondary/20"
          />
          <span className="text-xl font-heading font-black tracking-tighter text-brand-primary">ANIKO</span>
        </div>

        <div className="hidden md:flex items-center gap-8 font-medium text-brand-primary/80">
          <button 
            onClick={toggleSensoryFriendly}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${isSensoryFriendly ? 'bg-brand-accent/20 border-brand-accent text-brand-accent' : 'border-slate-200 hover:border-brand-secondary'}`}
            title={isSensoryFriendly ? "Desativar Modo Sensorial" : "Ativar Modo Sensorial"}
          >
            {isSensoryFriendly ? '✨ Sensorial On' : '🍃 Modo Sensorial'}
          </button>
          <Link href="/abordagem" className="hover:text-brand-accent transition-colors">Abordagem</Link>
          <Link href="/tecnologia" className="hover:text-brand-accent transition-colors">Tecnologia</Link>
          <Link href="/valores" className="hover:text-brand-accent transition-colors">Valores</Link>
          <Link href="/duvidas" className="hover:text-brand-accent transition-colors font-bold">Dúvidas</Link>
          <Link href="/contato" className="hover:text-brand-accent transition-colors">Contato</Link>
          {currentUser ? (
            <div className="relative">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-brand-primary text-white shadow-xl hover:bg-brand-primary/90 transition-all border border-brand-accent/30 hover:scale-105 active:scale-95"
              >
                <div className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border border-white/40">
                  {userProfile?.avatar_url ? (
                    <img src={`/assets/avatars/avatar_${userProfile.avatar_url}.png`} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm">🧒</span>
                  )}
                </div>
                <span className="text-xs font-black max-w-[120px] truncate">{userProfile?.child_name || userProfile?.parent_name || 'Minha Conta'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
              </button>

              {/* Dropdown Menu do Usuário */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 animate-scale-up text-left">
                  <div className="p-3 border-b border-slate-100 bg-slate-50/50 rounded-xl mb-1">
                    <p className="text-xs font-black text-brand-primary truncate">{userProfile?.child_name || 'Sua Conta'}</p>
                    <p className="text-[10px] text-brand-accent font-bold mt-0.5">{userProfile?.video_credits || 0} Créditos Restantes</p>
                  </div>
                  
                  <Link 
                    href="/dashboard" 
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-brand-primary rounded-xl transition-all"
                  >
                    <span className="text-base">📊</span>
                    <span>Meu Painel</span>
                  </Link>

                  <Link 
                    href="/assinatura" 
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-brand-primary rounded-xl transition-all"
                  >
                    <span className="text-base">💳</span>
                    <span>Minha Assinatura</span>
                  </Link>
                  
                  <Link 
                    href="/dashboard#solicitar-video" 
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-brand-accent rounded-xl transition-all"
                  >
                    <span className="text-base">✨</span>
                    <span>Solicitar Animação</span>
                  </Link>

                  <button 
                    onClick={async () => {
                      await supabase.auth.signOut();
                      window.location.reload();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all text-left mt-1 border-t border-slate-100"
                  >
                    <span className="text-base">🚪</span>
                    <span>Sair da Conta</span>
                  </button>

                  {/* Dark Mode Toggle */}
                  <div className="mt-1 pt-1 border-t border-slate-100">
                    <button
                      onClick={toggleDarkMode}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-all group"
                    >
                      <div className="flex items-center gap-2.5">
                        {isDarkMode ? (
                          <Moon size={15} className="text-indigo-400" />
                        ) : (
                          <Sun size={15} className="text-amber-400" />
                        )}
                        <span className="text-xs font-bold text-slate-700">
                          {isDarkMode ? 'Modo Escuro' : 'Modo Claro'}
                        </span>
                      </div>
                      {/* Switch pill */}
                      <div className={`relative w-9 h-5 rounded-full transition-colors duration-300 ${
                        isDarkMode ? 'bg-indigo-500' : 'bg-slate-200'
                      }`}>
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${
                          isDarkMode ? 'translate-x-4' : 'translate-x-0.5'
                        }`} />
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="rounded-full bg-brand-primary px-6 py-2.5 text-white shadow-xl hover:bg-brand-primary/90 transition-all hover:scale-105 active:scale-95 text-sm font-bold">
              Começar Agora
            </Link>
          )}
        </div>

        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-brand-primary hover:bg-slate-100 rounded-xl transition-all"
        >
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          )}
        </button>

        {isMenuOpen && (
          <div className="fixed inset-0 z-50 bg-white md:hidden animate-fade-in flex flex-col p-8">
            <div className="flex justify-between items-center mb-16">
              <div className="flex items-center gap-3">
                <Image src="/assets/logo.jpeg" alt="Logo" width={40} height={40} className="rounded-lg shadow-sm" />
                <span className="text-xl font-bold text-brand-primary">ANIKO</span>
              </div>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-slate-100 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <div className="flex flex-col gap-8 text-3xl font-black text-brand-primary uppercase tracking-tighter">
              <Link href="/abordagem" onClick={() => setIsMenuOpen(false)}>Abordagem</Link>
              <Link href="/tecnologia" onClick={() => setIsMenuOpen(false)}>Tecnologia</Link>
              <Link href="/valores" onClick={() => setIsMenuOpen(false)}>Valores</Link>
              <Link href="/duvidas" onClick={() => setIsMenuOpen(false)}>Dúvidas</Link>
              <Link href="/contato" onClick={() => setIsMenuOpen(false)}>Contato</Link>
              <Link 
                href="/login" 
                onClick={() => setIsMenuOpen(false)}
                className="mt-4 rounded-full bg-brand-primary px-8 py-5 text-xl text-white text-center shadow-2xl hover:bg-brand-primary/90 transition-all active:scale-95"
              >
                Começar Agora
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="abordagem" className="relative flex w-full max-w-7xl flex-col items-center gap-16 px-6 py-32 md:flex-row md:px-12 lg:py-48 scroll-mt-20 mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="hero-text-area flex flex-1 flex-col gap-8 text-center md:text-left z-10"
        >
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block self-center md:self-start rounded-full glass-modern px-5 py-2 text-xs font-black uppercase tracking-widest text-brand-primary"
          >
            ✨ Educação Adaptativa para TEA
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-heading font-black leading-[1.1] tracking-tighter text-brand-primary md:text-6xl lg:text-8xl"
          >
            Aniko, <br className="hidden md:block" /> tornando a tela <br className="hidden md:block" /> sua <span className="text-brand-accent italic">aliada</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-slate-500 font-bold text-xl md:text-2xl tracking-tight -mt-4 mb-2"
          >
            Animações que <span className="text-brand-accent italic">evoluem</span>.
          </motion.p>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-xl text-xl leading-relaxed text-slate-700/80 font-medium"
          >
            O Aniko utiliza inteligência artificial para criar roteiros e animações personalizadas para cada criança.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col gap-4 sm:flex-row justify-center md:justify-start"
          >
            <button 
              onClick={handleMainCtaClick}
              className="rounded-2xl bg-brand-warmth px-10 py-5 text-xl font-black text-white shadow-[0_20px_50px_rgba(255,166,70,0.3)] hover:scale-105 active:scale-95 transition-all text-glow-warmth"
            >
              {currentUser ? "Acessar Meu Painel 🚀" : "Conheça o Aniko (com a Bluey! 🐧)"}
            </button>
            <button onClick={() => setShowVideo(true)} className="rounded-2xl glass-modern px-10 py-5 text-xl font-black flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all text-brand-primary">
              Ver Demo
              <span className="bg-brand-primary/10 px-2 py-0.5 rounded-lg text-xs">x7</span>
            </button>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="penguin-area relative flex flex-1 items-center justify-center cursor-pointer group/hero z-10"
          onMouseEnter={() => setIsPenguinHovered(true)}
          onMouseLeave={() => setIsPenguinHovered(false)}
          onClick={handleMainCtaClick}
        >
          <div
            className="relative aspect-square w-full max-w-[480px] flex items-center justify-center transition-transform group-hover/hero:scale-105"
            style={{ maskImage: 'radial-gradient(circle, black 78%, transparent 84%)', WebkitMaskImage: 'radial-gradient(circle, black 78%, transparent 84%)' }}
          >
            <video 
              ref={penguinVideoRef}
              src="/assets/ANIKO ANIMAÇÃO HOME.mp4" 
              muted 
              playsInline
              loop
              disablePictureInPicture
              disableRemotePlayback
              className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-lighten transition-transform group-hover/hero:scale-105"
            />
          </div>
          {/* Invisible overlay to block browser video controls on hover & handle click */}
          <div className="absolute inset-0 z-10 cursor-pointer" onClick={handleMainCtaClick} />
        </motion.div>
      </section>

      {/* Cartoon Showcase (Interativo, Infinito e Automático) */}
      <section className="w-full py-16 bg-white border-y border-brand-secondary/5 relative overflow-hidden">
        <div className="mb-12 px-6 text-center">
          <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-brand-primary/30">
            Aqui a imaginação cria vida
          </h2>
        </div>
        
        <div 
          className="relative w-full max-w-[2000px] mx-auto group"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Lados Suavizados (Fade Gradient) */}
          <div className="absolute top-0 left-0 z-20 h-full w-24 md:w-80 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 z-20 h-full w-24 md:w-80 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none" />

          {/* Draggable & Scrollable Container */}
          <div 
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className={`flex gap-12 overflow-x-auto no-scrollbar py-8 cursor-grab active:cursor-grabbing px-10 items-center ${isDragging ? 'scroll-auto select-none' : 'scroll-smooth'}`}
          >
            {infiniteDrawings.map((d, i) => (
              <div 
                key={i} 
                className="flex-shrink-0 cursor-pointer"
                onClick={() => {
                  setCurrentDemoIndex(d.videoIndex);
                  setShowVideo(true);
                }}
              >
                <div className="relative h-64 w-[28rem] md:w-[40rem] overflow-hidden rounded-[50px] border-[12px] border-white shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-all hover:scale-[1.02] group/card">
                  <Image 
                    src={`/assets/drawings/${d.src}`} 
                    alt={d.name}
                    width={700}
                    height={360}
                    className="h-full w-full object-cover pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover/card:bg-transparent transition-colors" />
                  <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity">
                    <p className="text-white font-black text-2xl tracking-tight">{d.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="w-full border-t border-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-6 text-center md:px-12">
          <p className="text-slate-500 font-medium">© 2026 Aniko - Transformando educação em animação.</p>
          <div className="mt-4 flex justify-center gap-6">
            <Link href="/contato" className="text-sm text-slate-400 hover:text-brand-accent transition-colors">Suporte</Link>
          </div>
        </div>
      </footer>

      {/* AiChat with Dynamic Position */}
      <AiChat isHigh={showVideo} />
    </main>
  );
}
