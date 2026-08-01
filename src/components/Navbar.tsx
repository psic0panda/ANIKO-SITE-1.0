"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import SensoryHub from "./SensoryHub";
import { Sparkles, X, Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSensoryOpen, setIsSensoryOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isDarkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const navLinks = [
    { name: "Abordagem", href: "/abordagem" },
    { name: "Tecnologia", href: "/tecnologia" },
    { name: "Valores", href: "/valores" },
    { name: "Dúvidas", href: "/duvidas" },
    { name: "Contato", href: "/contato" },
  ];

  const isHome = pathname === "/";

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 flex w-full items-center justify-between px-6 py-4 md:px-12 z-50 transition-all duration-300 ${
        isScrolled || !isHome ? 'glass-modern py-3 shadow-lg' : 'bg-transparent'
      }`}
    >
      <Link href="/" className="flex items-center gap-3 group">
        <Image
          src="/assets/logo.jpeg"
          alt="Aniko Logo"
          width={40}
          height={40}
          className="rounded-xl shadow-lg border-2 border-brand-secondary/20 transition-transform group-hover:scale-110"
        />
        <span className="text-xl font-black tracking-tighter text-brand-primary uppercase">ANIKO</span>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-8 font-medium text-brand-primary/80">
        <div className="flex items-center gap-6">
          <Link 
            href="/abordagem" 
            className={`hover:text-brand-accent transition-colors ${pathname === '/abordagem' ? 'text-brand-accent font-bold' : ''}`}
          >
            Abordagem
          </Link>

          {/* Sensory Trigger */}
          <div className="relative">
            <button 
              onClick={() => setIsSensoryOpen(!isSensoryOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${isSensoryOpen ? 'bg-brand-accent/20 text-brand-primary font-bold shadow-inner' : 'hover:bg-brand-primary/5 hover:text-brand-accent'}`}
            >
              <Sparkles size={16} className={isSensoryOpen ? 'text-brand-accent' : ''} />
              Modo Sensorial
            </button>
            <SensoryHub isOpen={isSensoryOpen} onClose={() => setIsSensoryOpen(false)} />
          </div>

          {navLinks.slice(1).map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className={`hover:text-brand-accent transition-colors ${pathname === link.href ? 'text-brand-accent font-bold' : ''}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

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
          <Link 
            href="/login" 
            className="rounded-full bg-brand-primary px-6 py-2.5 text-white shadow-xl hover:bg-brand-primary/90 transition-all hover:scale-105 active:scale-95 text-sm font-bold"
          >
            Começar Agora
          </Link>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <button 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden p-2 text-brand-primary hover:bg-slate-100 rounded-xl transition-all"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
      </button>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white md:hidden animate-fade-in flex flex-col p-8">
          <div className="flex justify-between items-center mb-16">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3">
              <Image src="/assets/logo.jpeg" alt="Logo" width={40} height={40} className="rounded-lg shadow-sm" />
              <span className="text-xl font-bold text-brand-primary">ANIKO</span>
            </Link>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-slate-100 rounded-full">
              <X size={28} />
            </button>
          </div>
          <div className="flex flex-col gap-8 text-3xl font-black text-brand-primary uppercase tracking-tighter">
            <Link href="/abordagem" onClick={() => setIsMenuOpen(false)}>Abordagem</Link>
            
            <button 
              onClick={() => setIsSensoryOpen(!isSensoryOpen)}
              className="flex items-center gap-4 text-left border-l-4 border-brand-accent pl-4 text-brand-accent"
            >
              <Sparkles size={28} />
              Modo Sensorial
            </button>
            {isSensoryOpen && (
              <div className="ml-4 mb-4">
                 <SensoryHub isOpen={isSensoryOpen} onClose={() => setIsSensoryOpen(false)} />
              </div>
            )}

            {navLinks.slice(1).map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                onClick={() => setIsMenuOpen(false)}
                className={pathname === link.href ? 'text-brand-accent' : ''}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
