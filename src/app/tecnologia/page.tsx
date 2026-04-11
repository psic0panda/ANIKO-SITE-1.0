"use client";

import Image from "next/image";
import Link from "next/link";

export default function Tecnologia() {
  return (
    <main className="relative min-h-screen flex flex-col items-center overflow-hidden bg-slate-50">
      {/* Background Decorative Element */}
      <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] bg-brand-secondary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-brand-accent/5 rounded-full blur-3xl -z-10" />

      {/* Navigation (Consistent) */}
      <nav className="flex w-full max-w-7xl items-center justify-between px-6 py-8 md:px-12">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-md border border-slate-100 group-hover:bg-brand-primary group-hover:text-white transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </div>
          <span className="font-bold text-brand-primary">Voltar para Home</span>
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

      {/* Header Section */}
      <header className="w-full max-w-7xl px-6 py-20 md:px-12 text-center animate-fade-up">
        <h1 className="text-4xl font-black text-brand-primary md:text-6xl lg:text-7xl mb-8 leading-tight">
          Nossa <span className="text-brand-accent text-glow-accent">Tecnologia Adaptativa</span>
        </h1>
        <p className="mx-auto max-w-2xl text-xl text-slate-500 leading-relaxed md:text-2xl">
          Desenvolvemos um sistema que une inteligência artificial e neurociência para criar um ambiente digital seguro e acolhedor.
        </p>
      </header>

      {/* Simplified Features Section */}
      <section className="w-full pb-32">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="grid gap-8 lg:grid-cols-3">
            {[
              {
                title: "Personalização Sensorial",
                desc: "Ajuste dinâmico de cores, sons e ritmo para evitar sobrecarga auditiva ou visual.",
                details: "O sistema suaviza picos de áudio e contrastes automaticamente.",
                icon: "🎨"
              },
              {
                title: "Roteirização Inteligente",
                desc: "Histórias criadas com base nos personagens favoritos e objetivos de desenvolvimento da família.",
                details: "Conteúdo lúdico focado no aprendizado e reforço positivo.",
                icon: "🧠"
              },
              {
                title: "Dados para Responsáveis",
                desc: "Dashboards detalhados com o progresso de interação e áreas de interesse.",
                details: "Insights valiosos para acompanhar a evolução da criança.",
                icon: "📊"
              }
            ].map((f, i) => (
              <div key={i} className="relative p-10 rounded-[3rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 animate-fade-up" style={{ animationDelay: `${i * 150}ms` }}>
                <div className="mb-8 text-4xl">{f.icon}</div>
                <h3 className="text-2xl font-bold text-brand-primary mb-4">{f.title}</h3>
                <p className="text-slate-600 leading-relaxed text-lg mb-6">
                  {f.desc}
                </p>
                <div className="pt-6 border-t border-slate-50 text-brand-primary/50 text-sm italic">
                  {f.details}
                </div>
              </div>
            ))}
          </div>

          {/* Simple CTA */}
          <div className="mt-20 text-center animate-fade-up delay-500">
             <Link 
              href="/"
              className="rounded-2xl bg-brand-primary px-8 py-4 text-lg font-bold text-white shadow-xl hover:scale-105 transition-all inline-block"
            >
              Voltar para a Home
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full mt-auto py-12 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-slate-400 font-medium">© 2026 Aniko - Transformando educação em animação.</p>
        </div>
      </footer>
    </main>
  );
}
