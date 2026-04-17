"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import BackgroundDecor from "@/components/BackgroundDecor";

export default function Valores() {
  return (
    <main className="relative min-h-screen flex flex-col items-center overflow-hidden bg-white">
      <BackgroundDecor />
      <Navbar />

      {/* Hero / Header Section */}
      <section className="w-full max-w-7xl px-6 pt-32 pb-16 md:pt-48 md:pb-24">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="inline-block rounded-full bg-brand-warmth/10 px-5 py-2 text-xs font-black uppercase tracking-widest text-brand-warmth animate-fade-up">
            💰 Investimento no Futuro
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-brand-primary animate-fade-up stagger-1">
            Valores & <br /> <span className="text-brand-accent italic">Parcerias</span>.
          </h1>
          <p className="max-w-2xl text-xl text-slate-600/80 animate-fade-up stagger-2">
            Acreditamos que a educação adaptativa deve ser acessível e de alta qualidade. 
            Nossa tecnologia de IA transforma roteiros em experiências únicas para cada criança.
          </p>
        </div>
      </section>

      {/* Pricing Card Section */}
      <section className="w-full max-w-7xl px-6 py-12 flex justify-center">
        <div className="relative group w-full max-w-2xl animate-fade-up stagger-3">
          {/* Decorative Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-brand-secondary to-brand-accent rounded-[3.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          
          <div className="relative glass-modern p-12 md:p-16 rounded-[3rem] border-2 border-white flex flex-col items-center text-center space-y-10">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-brand-primary/60 uppercase tracking-widest">Vídeo Único</h2>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-4xl font-bold text-brand-primary">R$</span>
                <span className="text-8xl md:text-9xl font-black text-brand-primary tracking-tighter">80</span>
                <span className="text-2xl font-bold text-brand-primary/60">,00</span>
              </div>
            </div>

            <div className="w-full space-y-4 text-left border-y border-slate-100 py-8">
              <div className="flex items-start gap-3">
                <div className="mt-1 h-6 w-6 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <p className="text-lg text-slate-700 font-medium">Animação 100% personalizada</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 h-6 w-6 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <p className="text-lg text-slate-700 font-medium">Roteiro adaptado ao perfil da criança</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 h-6 w-6 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <p className="text-lg text-slate-700 font-medium">Estímulos visuais e sonoros controlados</p>
              </div>
            </div>

            <Link 
              href="/login" 
              className="w-full py-6 rounded-3xl bg-brand-primary text-white text-xl font-black shadow-2xl hover:scale-[1.02] active:scale-95 transition-all text-center"
            >
              Começar Agora
            </Link>
          </div>
        </div>
      </section>

      {/* Partnerships Section */}
      <section className="w-full max-w-4xl px-6 py-24 animate-fade-up stagger-4">
        <div className="rounded-[3rem] bg-brand-primary p-10 md:p-16 text-white text-center space-y-8 shadow-2xl relative overflow-hidden">
          {/* Subtle background circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-accent/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>

          <h3 className="text-3xl md:text-4xl font-black">Pacotes e Parcerias</h3>
          <p className="text-xl text-white/80 max-w-2xl mx-auto font-medium">
            Procura uma solução recorrente para sua família ou quer integrar o Aniko na sua clínica ou escola?
            Oferecemos condições especiais para pacotes mensais e parcerias institucionais.
          </p>
          <div className="pt-4">
            <Link 
              href="/contato" 
              className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-white text-brand-primary text-lg font-black hover:bg-brand-accent hover:text-white transition-all shadow-xl group"
            >
              Falar sobre Parcerias
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </section>

      <section className="w-full max-w-2xl px-6 py-16 text-center italic text-slate-400 font-medium">
        <p>&quot;Transformando tecnologia em uma ferramenta sensível, acessível e verdadeiramente transformadora.&quot;</p>
      </section>

      <footer className="w-full border-t border-slate-50 py-16 mt-auto">
        <div className="mx-auto max-w-7xl px-6 text-center md:px-12">
          <p className="text-slate-500 font-medium">© 2026 Aniko - Transformando educação em animação.</p>
        </div>
      </footer>
    </main>
  );
}
