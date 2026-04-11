"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import AiChat from "@/components/AiChat";
import BackgroundDecor from "@/components/BackgroundDecor";

export default function Home() {
  const [showVideo, setShowVideo] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const demos = [
    { src: '/assets/demo.mp4', title: 'Vídeo 1' },
    { src: '/assets/demo 2.mp4', title: 'Vídeo 2' },
    { src: '/assets/demo 3.mp4', title: 'Vídeo 3' },
  ];

  const [currentDemoIndex, setCurrentDemoIndex] = useState(0);

  const nextDemo = () => setCurrentDemoIndex((prev) => (prev + 1) % demos.length);
  const prevDemo = () => setCurrentDemoIndex((prev) => (prev - 1 + demos.length) % demos.length);

  return (
    <main className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100">
      <BackgroundDecor />
      
      {/* Navbar com Glassmorphism */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-gray-100 py-3 shadow-sm' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg overflow-hidden transition-transform group-hover:scale-105">
              <Image src="/assets/logo.jpeg" alt="Aniko" width={40} height={40} className="object-cover" />
            </div>
            <span className="text-xl font-bold tracking-tight text-blue-900">ANIKO</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/abordagem" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Abordagem</Link>
            <Link href="/tecnologia" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Tecnologia</Link>
            <Link href="/contato" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Contato</Link>
            <Link href="/login" className="px-5 py-2.5 bg-blue-600 text-white rounded-full text-sm font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg transition-all active:scale-95">Começar Agora</Link>
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="18" y2="18"/></svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 p-6 md:hidden shadow-xl animate-in slide-in-from-top duration-300">
            <div className="flex flex-col gap-4">
              <Link href="/abordagem" className="text-lg font-medium text-gray-700">Abordagem</Link>
              <Link href="/tecnologia" className="text-lg font-medium text-gray-700">Tecnologia</Link>
              <Link href="/contato" className="text-lg font-medium text-gray-700">Contato</Link>
              <Link href="/login" className="mt-2 w-full py-4 text-center bg-blue-600 text-white rounded-2xl font-bold">Começar Agora</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="mb-8 p-1 px-4 bg-blue-50 text-blue-600 rounded-full text-sm font-bold tracking-wide animate-fade-in">
          NOVIDADE: ANIMAÇÕES PARA TEA 🐧✨
        </div>
        <h1 className="text-5xl md:text-8xl font-black leading-[0.95] tracking-tighter text-blue-900 mb-8 max-w-4xl">
          Animações que <span className="text-blue-600 italic">evoluem</span> com seu filho.
        </h1>
        <p className="max-w-xl text-xl text-gray-500 leading-relaxed mb-12">
          O Aniko utiliza inteligência artificial para criar roteiros e animações personalizadas, auxiliando no desenvolvimento infantil de forma lúdica.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="px-8 py-5 bg-blue-600 text-white rounded-full text-lg font-bold shadow-2xl hover:bg-blue-700 hover:-translate-y-1 transition-all">
            Conheça o Sistema
          </button>
          <button onClick={() => setShowVideo(true)} className="px-8 py-5 bg-white text-blue-900 border-2 border-gray-100 rounded-full text-lg font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg> 
            Ver Demo
          </button>
        </div>

        <div className="mt-20 relative w-full aspect-video md:max-w-5xl group">
          <div className="absolute inset-0 bg-blue-600/10 blur-3xl -z-10 rounded-full opacity-50"></div>
          <Image 
            src="/assets/demo_site.png" 
            alt="Demo do Site" 
            fill 
            className="object-cover rounded-[2rem] shadow-2xl border-4 border-white"
          />
        </div>
      </section>

      {/* Galeria de Vídeos */}
      <section className="py-32 bg-gray-50/50">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-blue-900 mb-16">Demonstração das Animações</h2>
          <div className="relative aspect-video bg-white rounded-[2.5rem] shadow-2xl overflow-hidden group border-8 border-white">
            <video 
              key={demos[currentDemoIndex].src}
              src={demos[currentDemoIndex].src}
              controls
              autoPlay
              muted
              className="w-full h-full object-cover"
            />
            <button 
              onClick={prevDemo}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button 
              onClick={nextDemo}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
          <p className="mt-8 text-lg font-medium text-blue-600">{demos[currentDemoIndex].title}</p>
        </div>
      </section>

      <AiChat />
      
      {/* Footer Simples */}
      <footer className="py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold text-blue-900 mb-6 italic">ANIKO</h3>
          <p className="text-gray-400 text-sm">© 2024 Aniko - Tecnologia a favor do desenvolvimento infantil.</p>
        </div>
      </footer>
    </main>
  );
}
