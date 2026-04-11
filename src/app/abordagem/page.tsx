"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Abordagem() {
  return (
    <main className="relative min-h-screen flex flex-col items-center overflow-hidden bg-white">
      {/* Background Decorative Element */}
      <div className="absolute top-[-5%] left-[-10%] w-[50%] h-[50%] bg-brand-secondary/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[-5%] right-[-10%] w-[40%] h-[40%] bg-brand-accent/5 rounded-full blur-[100px] -z-10" />

      <Navbar />

      {/* Content Section */}
      <article className="w-full max-w-4xl px-6 py-20 animate-fade-in">
        <div className="mb-12 flex justify-center">
            <span className="text-6xl">🧠</span>
        </div>
        
        <h1 className="text-4xl font-black text-brand-primary md:text-6xl text-center mb-16 leading-tight">
          Nossa <span className="text-brand-secondary">Abordagem</span>
        </h1>

        <div className="space-y-8 text-xl md:text-2xl text-slate-700 leading-relaxed font-medium">
          <p className="animate-fade-up">
            No Aniko, entendemos que cada criança no espectro autista é única — com suas próprias formas de aprender, sentir e interagir com o mundo. Por isso, nossa abordagem é totalmente centrada na <span className="text-brand-accent font-bold">individualidade</span>.
          </p>

          <p className="animate-fade-up delay-100">
            Utilizamos inteligência artificial para criar experiências personalizadas, adaptadas às preferências, sensibilidades e objetivos de desenvolvimento de cada criança. A partir das informações fornecidas pelos responsáveis, o sistema desenvolve animações que respeitam o ritmo e os estímulos ideais para o aprendizado.
          </p>

          <p className="p-8 rounded-[2.5rem] bg-brand-secondary/5 border-l-8 border-brand-secondary animate-fade-up delay-200 shadow-sm italic">
            "Mais do que apenas entreter, o Aniko busca ensinar de forma natural e acolhedora, utilizando narrativas envolventes, personagens familiares e estímulos cuidadosamente ajustados."
          </p>

          <p className="animate-fade-up delay-300">
            Cada animação é construída com propósito — seja para desenvolver habilidades sociais, melhorar a comunicação ou incentivar comportamentos positivos no dia a dia.
          </p>

          <p className="animate-fade-up delay-400">
            Nossa tecnologia também permite adaptação em tempo real, ajustando cores, sons, ritmo e interações conforme a resposta da criança, tornando a experiência mais confortável, eficiente e significativa.
          </p>

          <div className="mt-16 p-10 rounded-[3rem] bg-brand-primary text-white shadow-2xl animate-fade-up delay-500">
            <p className="text-center font-bold">
              Acreditamos que o aprendizado acontece melhor quando há conexão, segurança e engajamento. Por isso, o Aniko transforma tecnologia em uma ferramenta sensível, acessível e verdadeiramente transformadora.
            </p>
          </div>
        </div>

        {/* Back CTA */}
        <div className="mt-24 text-center">
            <Link 
              href="/"
              className="group inline-flex items-center gap-2 text-brand-primary font-bold hover:text-brand-accent transition-colors text-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-2"><path d="m15 18-6-6 6-6"/></svg>
              Explorar outras seções
            </Link>
        </div>
      </article>

      {/* Footer */}
      <footer className="w-full mt-auto py-12 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-slate-400 font-medium">© 2026 Aniko - Transformando educação em animação.</p>
        </div>
      </footer>
    </main>
  );
}
