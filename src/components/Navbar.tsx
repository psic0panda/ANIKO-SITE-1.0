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

  const [isMenuClosing, setIsMenuClosing] = useState(false);

  const closeMenu = () => {
    setIsMenuClosing(true);
    setTimeout(() => {
      setIsMenuOpen(false);
      setIsMenuClosing(false);
    }, 250);
  };

  const toggleMenu = () => {
    if (isMenuOpen) {
      closeMenu();
    } else {
      setIsMenuOpen(true);
    }
  };

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
          width={44}
          height={44}
          className="rounded-xl shadow-md group-hover:scale-105 transition-transform"
        />
        <span className="text-2xl font-black tracking-tighter text-brand-primary dark:text-white uppercase">ANIKO</span>
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm font-bold transition-all hover:text-brand-accent ${
              pathname === link.href ? 'text-brand-accent font-black' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Right Side Actions */}
      <div className="hidden md:flex items-center gap-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:scale-110 active:scale-95 transition-all shadow-sm"
          title={isDarkMode ? "Modo Claro" : "Modo Escuro"}
        >
          {isDarkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-indigo-600" />}
        </button>

        {currentUser ? (
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:scale-105 active:scale-95 transition-all shadow-sm"
            >
              <div className="h-9 w-9 rounded-full bg-brand-primary/20 flex items-center justify-center overflow-hidden border border-brand-accent/40">
                {userProfile?.avatar_url ? (
                  <img src={`/assets/avatars/avatar_${userProfile.avatar_url}.png`} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm">🧒</span>
                )}
              </div>
              <span className="text-xs font-black text-slate-800 dark:text-white max-w-[100px] truncate">
                {userProfile?.child_name || userProfile?.parent_name || 'Minha Conta'}
              </span>
            </button>

            {/* Dropdown de Usuário */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#0F1F35] rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-2 space-y-1 z-50 animate-scale-up">
                <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-400">Logado como</p>
                  <p className="text-xs font-black text-brand-primary dark:text-white truncate">{currentUser.email}</p>
                </div>

                <Link
                  href="/dashboard"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
                >
                  <span>📊</span>
                  <span>Meu Painel / Vídeos</span>
                </Link>

                <Link
                  href="/assinatura"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
                >
                  <span>💳</span>
                  <span>Minha Assinatura</span>
                </Link>

                <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={async () => {
                      await supabase.auth.signOut();
                      window.location.reload();
                    }}
                    className="w-full flex items-center gap-2 p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-bold text-red-500 transition-colors text-left"
                  >
                    <span>🚪</span>
                    <span>Sair da Conta</span>
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
        onClick={toggleMenu}
        className="md:hidden p-2 text-brand-primary dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
      </button>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className={`fixed inset-0 z-[100] h-dvh max-h-dvh backdrop-blur-2xl bg-white/75 dark:bg-[#070E1B]/80 md:hidden flex flex-col p-6 overflow-y-auto overscroll-contain touch-pan-y shadow-2xl border-l border-white/30 dark:border-slate-800/80 ${isMenuClosing ? 'animate-drawer-out' : 'animate-drawer-in'}`}>
          {/* Header */}
          <div className="flex justify-between items-center pb-6 border-b border-slate-100 dark:border-slate-800 mb-6">
            <Link href="/" onClick={closeMenu} className="flex items-center gap-3">
              <Image src="/assets/logo.jpeg" alt="Logo" width={36} height={36} className="rounded-lg shadow-sm" />
              <span className="text-xl font-black tracking-tighter text-brand-primary dark:text-white uppercase">ANIKO</span>
            </Link>
            <button 
              onClick={closeMenu} 
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
                  onClick={closeMenu}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800"
                >
                  <span>📊</span>
                  <span>Meu Painel</span>
                </Link>
                <Link 
                  href="/assinatura" 
                  onClick={closeMenu}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800"
                >
                  <span>💳</span>
                  <span>Assinatura</span>
                </Link>
              </div>

              <Link 
                href="/dashboard#solicitar-video" 
                onClick={closeMenu}
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
                onClick={closeMenu}
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
