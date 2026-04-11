"use client";

import Image from "next/image";
import AiChat from "@/components/AiChat";
import Navbar from "@/components/Navbar";

export default function Contato() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center">
      <Navbar />

      <section className="w-full max-w-5xl px-6 py-16 md:py-24">
        <div className="max-w-3xl mx-auto flex flex-col items-center space-y-12 text-center">
          
          {/* Foto Section */}
          <div className="relative w-48 h-48 md:w-64 md:h-64 group animate-fade-in">
            <div className="absolute inset-0 bg-brand-secondary/20 rounded-full rotate-3 -z-10 transition-transform group-hover:rotate-6 shadow-xl" />
            <div className="w-full h-full overflow-hidden rounded-full border-8 border-white shadow-2xl">
              <Image 
                src="/assets/foto/foto.png" 
                alt="Henrique Neto" 
                width={300} 
                height={300} 
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"; 
                }}
              />
            </div>
          </div>

          {/* Text Section */}
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl font-black text-brand-primary uppercase">Henrique Neto</h1>

            <div className="text-slate-600 space-y-6 leading-relaxed text-lg max-w-2xl mx-auto">
              <p>
                Sou Henrique Neto, editor de vídeo há mais de 7 anos, com experiência na criação de conteúdos que conectam, engajam e geram resultados. Ao longo da minha trajetória, me especializei no uso de inteligência artificial aplicada à produção audiovisual, trazendo mais agilidade, criatividade e inovação para cada projeto.
              </p>
              
              <p>
                Mas foi fora do ambiente profissional que surgiu o que hoje é o Aniko.
              </p>

              <p>
                Sou tio do Nikolas, uma criança atípica, e foi convivendo com ele que percebi, na prática, os desafios da comunicação, do aprendizado e da adaptação aos estímulos do dia a dia. Ao mesmo tempo, também vi o quanto o conteúdo certo — no formato certo — pode fazer diferença no desenvolvimento, na atenção e na conexão com o mundo.
              </p>

              <p>
                Foi o Nikolas quem me inspirou a criar o Aniko.
              </p>

              <p>
                A partir dessa vivência, uni minha experiência com vídeo e inteligência artificial para desenvolver uma solução que fosse além do entretenimento: algo realmente útil, sensível e adaptado à realidade de cada criança.
              </p>

              <p>
                Hoje, meu objetivo com o Aniko é transformar tecnologia em uma ferramenta acessível e personalizada, capaz de apoiar o desenvolvimento de crianças com TEA de forma leve, segura e envolvente.
              </p>
            </div>

            {/* Contact Details */}
            <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
              <a 
                href="mailto:henriquenetopsi@gmail.com" 
                className="flex items-center gap-4 p-5 rounded-3xl bg-slate-50 border-2 border-slate-100 hover:border-brand-accent transition-all group overflow-hidden flex-1 text-left"
              >
                <div className="text-2xl">✉️</div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">E-mail</p>
                  <p className="text-sm font-bold text-brand-primary truncate">henriquenetopsi@gmail.com</p>
                </div>
              </a>

              <a 
                href="https://wa.me/5581988420706" 
                target="_blank"
                className="flex items-center gap-4 p-5 rounded-3xl bg-green-50 border-2 border-green-100 hover:border-green-500 transition-all group flex-1 text-left"
              >
                <div className="text-2xl">📱</div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold text-green-600/60 uppercase tracking-widest">WhatsApp</p>
                  <p className="text-sm font-bold text-brand-primary truncate">81 98842-0706</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-slate-100 py-12 mt-auto">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-slate-500 font-medium">© 2026 Aniko - Feito com amor para o Nikolas e para todas as crianças.</p>
        </div>
      </footer>
      <AiChat />
    </main>
  );
}
