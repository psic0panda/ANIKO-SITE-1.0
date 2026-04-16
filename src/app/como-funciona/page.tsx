"use client";

import Image from "next/image";
import Link from "next/link";

export default function ComoFunciona() {
  return (
    <main className="relative min-h-screen flex flex-col items-center overflow-hidden bg-slate-50">
      {/* Background Decorative Element */}
      <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] bg-brand-secondary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-brand-accent/5 rounded-full blur-3xl -z-10" />

      {/* Navigation (Simple) */}
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

      {/* Process Section (O conteúdo principal agora em sua própria página) */}
      <section className="w-full py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="mb-20 text-center animate-fade-up">
            <h1 className="text-4xl font-black text-brand-primary md:text-6xl lg:text-7xl mb-8 leading-tight">
              Uma Jornada <br />
              <span className="text-brand-accent text-glow-accent">Pensada em Detalhes</span>
            </h1>
            <p className="mx-auto max-w-2xl text-xl md:text-2xl text-slate-500 leading-relaxed">
              O Aniko transforma o histórico e a rotina do seu filho em uma ferramenta poderosa de desenvolvimento através da tecnologia adaptativa.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {[
              {
                step: "01",
                title: "O Primeiro Contato",
                description: "Entendemos o nível de suporte de cada criança, o histórico de acompanhamento e o acesso a telas que a criança possui.",
                details: "Essa fase é essencial para calibrar os estímulos sensoriais da animação.",
                icon: (
                  <svg className="h-10 w-10 text-brand-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )
              },
              {
                step: "02",
                title: "Foco no Comportamento",
                description: "Você nos conta qual desenho a criança mais gosta e quais comportamentos positivos deseja reforçar ou estimular.",
                details: "Usamos os interesses específicos como 'hiperfoco' positivo para o aprendizado.",
                icon: (
                  <svg className="h-10 w-10 text-brand-warmth" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                )
              },
              {
                step: "03",
                title: "Magia Adaptativa",
                description: "Criamos um roteiro exclusivo e animamos o personagem favorito para transmitir a mensagem de forma lúdica e eficaz.",
                details: "O resultado é enviado diretamente para os pais, pronto para ser exibido.",
                icon: (
                  <svg className="h-10 w-10 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
                  </svg>
                )
              }
            ].map((s, i) => (
              <div key={i} className="relative p-10 rounded-[3rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 animate-fade-up" style={{ animationDelay: `${i * 150}ms` }}>
                <div className="absolute -top-6 left-10 h-14 w-14 rounded-2xl bg-brand-primary text-white flex items-center justify-center font-black text-2xl shadow-xl">
                  {s.step}
                </div>
                <div className="mb-8 mt-4">
                  {s.icon}
                </div>
                <h3 className="text-3xl font-bold text-brand-primary mb-4">{s.title}</h3>
                <p className="text-slate-600 leading-relaxed text-xl mb-6">
                  {s.description}
                </p>
                <div className="pt-6 border-t border-slate-50 text-brand-primary/50 font-medium">
                  {s.details}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Bottom */}
          <div className="mt-24 text-center animate-fade-up delay-500">
             <Link 
              href="/"
              className="rounded-2xl bg-brand-primary px-10 py-5 text-xl font-bold text-white shadow-2xl hover:scale-105 active:scale-95 transition-all"
            >
              Voltar e ver demonstração
            </Link>
          </div>
        </div>
      </section>

      {/* Footer (Simplified) */}
      <footer className="w-full mt-auto py-12 border-t border-slate-200 bg-white/50 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-slate-500 font-medium">© 2026 Aniko - Tecnologia a serviço do desenvolvimento.</p>
        </div>
      </footer>
    </main>
  );
}
