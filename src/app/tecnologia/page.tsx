"use client";

import Image from "next/image";
import Link from "next/link";

export default function Tecnologia() {
  return (
    <main className="relative min-h-screen flex flex-col items-center overflow-hidden bg-white">
      {/* Background clean */}
      <div className="absolute top-0 left-0 right-0 bottom-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-brand-secondary/5 rounded-full blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="flex w-full max-w-7xl items-center justify-between px-6 py-6 md:px-12">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-md border border-slate-100 group-hover:bg-brand-primary group-hover:text-white transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </div>
          <span className="font-bold text-brand-primary">Home</span>
        </Link>
        <div className="flex items-center gap-3">
          <Image
            src="/assets/logo.jpeg"
            alt="Aniko Logo"
            width={40}
            height={40}
            className="rounded-lg shadow-sm"
          />
          <span className="text-xl font-bold tracking-tight text-brand-primary">ANIKO</span>
        </div>
      </nav>

      {/* Header */}
      <header className="w-full max-w-4xl px-6 py-12 text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-brand-primary mb-6">
          Nossa <span className="text-brand-secondary">Tecnologia</span>
        </h1>
        <p className="text-base md:text-lg text-slate-600">
          Unimos inteligência artificial de ponta com ferramentas profissionais para criar animações únicas e personalizadas.
        </p>
      </header>

      {/* Seção: Como criamos os vídeos */}
      <section className="w-full max-w-4xl px-6 pb-12">
        <div className="bg-slate-50 rounded-[2rem] p-8 md:p-10 border border-slate-100">
          <h2 className="text-xl md:text-2xl font-black text-brand-primary mb-6 text-center">
            Como criamos nossos vídeos
          </h2>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-white font-bold">1</div>
              <div>
                <h3 className="font-bold text-brand-primary mb-1">Inteligências Artificiais Especializadas</h3>
                <p className="text-sm text-slate-600">
                  Utilizamos múltiplas IAs de última geração para geração de texto, roteiro, personagens e cenas animadas. Cada vídeo é único e criado especificamente para a criança.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-white font-bold">2</div>
              <div>
                <h3 className="font-bold text-brand-primary mb-1">Refinamento Profissional</h3>
                <p className="text-sm text-slate-600">
                  Após a geração inicial, nossos vídeos passam por um processo de refinamento utilizando ferramentas licenciadas da Adobe (Premiere Pro, After Effects, Adobe Express). Isso garante cores vibrantes, transições suaves e qualidade profissional.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-white font-bold">3</div>
              <div>
                <h3 className="font-bold text-brand-primary mb-1">Personalização Sensorial</h3>
                <p className="text-sm text-slate-600">
                  Ajustamos cores, sons e ritmo para evitar sobrecarga. O sistema suaviza picos de áudio e contrastes automaticamente, criando uma experiência confortável para cada criança.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="w-full max-w-4xl px-6 pb-16">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
            <div className="text-3xl mb-3">🎬</div>
            <h3 className="font-bold text-brand-primary mb-2">Vídeos Únicos</h3>
            <p className="text-sm text-slate-500">Cada criança recebe animações feitas especialmente para ela</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
            <div className="text-3xl mb-3">✨</div>
            <h3 className="font-bold text-brand-primary mb-2">Qualidade Profissional</h3>
            <p className="text-sm text-slate-500">Produção com ferramentas Adobe licensed</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
            <div className="text-3xl mb-3">🧠</div>
            <h3 className="font-bold text-brand-primary mb-2">Baseado em Neurociência</h3>
            <p className="text-sm text-slate-500">Conteúdo criado para atender necessidades específicas</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="pb-16 text-center">
        <Link 
          href="/como-funciona"
          className="inline-flex items-center gap-2 px-8 py-4 bg-brand-accent text-white font-bold rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all"
        >
          Como funciona?
        </Link>
      </div>

      {/* Footer */}
      <footer className="w-full py-8 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-slate-400 font-medium">© 2026 Aniko - Transformando educação em animação.</p>
        </div>
      </footer>
    </main>
  );
}
