"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Abordagem", href: "/abordagem" },
    { name: "Tecnologia", href: "/tecnologia" },
    { name: "Valores", href: "/valores" },
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
        <span className="text-xl font-black tracking-tighter text-brand-primary">ANIKO</span>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-8 font-medium text-brand-primary/80">
        {navLinks.map((link) => (
          <Link 
            key={link.href} 
            href={link.href} 
            className={`hover:text-brand-accent transition-colors ${
              pathname === link.href ? 'text-brand-accent font-bold' : ''
            }`}
          >
            {link.name}
          </Link>
        ))}
        <Link 
          href="/login" 
          className="rounded-full bg-brand-primary px-6 py-2.5 text-white shadow-xl hover:bg-brand-primary/90 transition-all hover:scale-105 active:scale-95"
        >
          Começar Agora
        </Link>
      </div>

      {/* Mobile Menu Toggle */}
      <button 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden p-2 text-brand-primary hover:bg-slate-100 rounded-xl transition-all"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        )}
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
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <div className="flex flex-col gap-8 text-3xl font-black text-brand-primary uppercase tracking-tighter">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                onClick={() => setIsMenuOpen(false)}
                className={pathname === link.href ? 'text-brand-accent' : ''}
              >
                {link.name}
              </Link>
            ))}
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
  );
}
