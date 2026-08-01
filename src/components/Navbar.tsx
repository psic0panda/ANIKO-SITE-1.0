"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sparkles, X, Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

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
        <span className="text-xl font-black tracking-tighter text-brand-primary dark:text-white uppercase">ANIKO</span>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-8 font-medium text-brand-primary/80 dark:text-slate-200">
        <div className="flex items-center gap-6">
          {navLinks.map((link) => (
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
              <div className="absolute right-0 mt-3 w-60 bg-white dark:bg-[#0F1F35] rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-2 z-50 animate-scale-up text-left">
                <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl mb-1">
                  <p className="text-xs font-black text-brand-primary dark:text-white truncate">{userProfile?.child_name || 'Sua Conta'}</p>
                  <p className="text-[10px] text-brand-accent font-bold mt-0.5">{userProfile?.video_credits || 0} Créditos Restantes</p>
                </div>
                
                <Link 
                  href="/dashboard" 
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-brand-primary rounded-xl transition-all"
                >
                  <span className="text-base">📊</span>
                  <span>Meu Painel</span>
                </Link>

                <Link 
                  href="/assinatura" 
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-brand-primary rounded-xl transition-all"
                >
                  <span className="text-base">💳</span>
                  <span>Minha Assinatura</span>
                </Link>
                
                <Link 
                  href="/dashboard#solicitar-video" 
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-brand-accent rounded-xl transition-all"
                >
                  <span className="text-base">✨</span>
                  <span>Solicitar Animação</span>
                </Link>

                <button 
                  onClick={async () => {
                    await supabase.auth.signOut();
                    window.location.reload();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all text-left mt-1 border-t border-slate-100 dark:border-slate-800"
                >
                  <span className="text-base">🚪</span>
                  <span>Sair da Conta</span>
                </button>

                {/* Dark Mode Toggle */}
                <div className="mt-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={toggleDarkMode}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      {isDarkMode ? (
                        <Moon size={15} className="text-indigo-400" />
                      ) : (
                        <Sun size={15} className="text-amber-400" />
                      )}
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
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
        <div className="fixed inset-0 z-[100] h-dvh max-h-dvh backdrop-blur-2xl bg-white/75 dark:bg-[#070E1B]/80 md:hidden animate-fade-in flex flex-col p-6 overflow-y-auto overscroll-contain touch-pan-y shadow-2xl border-l border-white/30 dark:border-slate-800/80">
          {/* Header */}
          <div className="flex justify-between items-center pb-6 border-b border-slate-100 dark:border-slate-800 mb-6">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3">
              <Image src="/assets/logo.jpeg" alt="Logo" width={36} height={36} className="rounded-lg shadow-sm" />
              <span className="text-xl font-black tracking-tighter text-brand-primary dark:text-white uppercase">ANIKO</span>
            </Link>
            <button 
              onClick={() => setIsMenuOpen(false)} 
              className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-full"
              aria-label="Fechar menu"
            >
              <X size={22} />
            </button>
          </div>

          {/* User Profile Card no Mobile com Glassmorphism */}
          {currentUser && (
            <div className="mb-6 p-4 rounded-2xl backdrop-blur-md bg-white/60 dark:bg-[#0F1F35]/70 border border-white/40 dark:border-slate-700/60 shadow-xl space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-brand-primary/20 flex items-center justify-center overflow-hidden border border-brand-accent/40">
                  {userProfile?.avatar_url ? (
                    <img src={`/assets/avatars/avatar_${userProfile.avatar_url}.png`} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-base">🧒</span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-black text-brand-primary dark:text-white truncate">{userProfile?.child_name || userProfile?.parent_name || 'Minha Conta'}</p>
                  <p className="text-xs text-brand-accent font-bold">{userProfile?.video_credits || 0} Créditos Restantes</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <Link 
                  href="/dashboard" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800"
                >
                  <span>📊</span>
                  <span>Meu Painel</span>
                </Link>
                <Link 
                  href="/assinatura" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800"
                >
                  <span>💳</span>
                  <span>Assinatura</span>
                </Link>
              </div>

              <Link 
                href="/dashboard#solicitar-video" 
                onClick={() => setIsMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-brand-accent text-white text-xs font-black shadow-md"
              >
                <span>✨</span>
                <span>Solicitar Animação</span>
              </Link>
            </div>
          )}

          {/* Dark Mode Switch no Mobile */}
          <div className="mb-6">
            <button
              onClick={toggleDarkMode}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0F1F35] border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center gap-3">
                {isDarkMode ? <Moon size={18} className="text-indigo-400" /> : <Sun size={18} className="text-amber-500" />}
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  {isDarkMode ? 'Modo Escuro Ativo' : 'Modo Claro Ativo'}
                </span>
              </div>
              <div className={`relative w-10 h-5 rounded-full transition-colors ${isDarkMode ? 'bg-indigo-500' : 'bg-slate-300'}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${isDarkMode ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
            </button>
          </div>

          {/* Links de Navegação */}
          <div className="flex flex-col gap-4 text-lg font-black text-brand-primary dark:text-white uppercase tracking-tight mb-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                onClick={() => setIsMenuOpen(false)}
                className={`py-1 border-b border-slate-100 dark:border-slate-800/60 hover:text-brand-accent ${pathname === link.href ? 'text-brand-accent' : ''}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Rodapé do Menu */}
          <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
            {currentUser ? (
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.reload();
                }}
                className="w-full py-4 bg-red-500/10 text-red-500 font-black rounded-2xl border border-red-500/20 text-sm flex items-center justify-center gap-2"
              >
                <span>🚪</span>
                <span>Sair da Conta</span>
              </button>
            ) : (
              <Link 
                href="/login" 
                onClick={() => setIsMenuOpen(false)}
                className="w-full block rounded-2xl bg-brand-primary px-8 py-4 text-base text-white text-center font-black shadow-xl hover:bg-brand-primary/90 transition-all active:scale-95"
              >
                Começar Agora
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
