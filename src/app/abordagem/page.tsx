"use client";

import Image from "next/image";
import Link from "next/link";

export default function Abordagem() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero */}
      <div className="relative w-full bg-gradient-to-br from-[#0a1628] via-[#0E3A5F] to-[#1e5a8a] pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-cyan-300/15 rounded-full blur-3xl"></div>
        </div>
        
        <nav className="relative z-10 flex w-full max-w-7xl items-center justify-between px-6 md:px-12">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/assets/logo.jpeg" alt="Aniko Logo" width={40} height={40} className="rounded-lg shadow-lg" />
            <span className="text-xl font-bold text-white uppercase tracking-wider">ANIKO</span>
          </Link>
          <Link href="/" className="text-white/70 hover:text-white font-medium text-sm">← Voltar</Link>
        </nav>

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center mt-16">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Nossa <span className="text-cyan-300">Abordagem</span>
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-prose mx-auto">
            Uma abordagem personalizada para crianças no espectro autista
          </p>
        </div>
      </div>

      {/* Seção principal */}
      <div className="max-w-3xl mx-auto px-6 pb-16 -mt-20 relative z-20">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-[#0E3A5F] mb-2">Como funciona</h2>
            <p className="text-cyan-600 font-semibold text-xs uppercase tracking-widest">Nossa metodologia</p>
          </div>

          <div className="space-y-5">
            <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border-l-4 border-cyan-500">
              <h3 className="text-lg font-black text-[#0E3A5F] mb-2">1. Entendemos sua criança</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Cada criança é única. Conhecemos as preferências, sensibilidades e formas de aprender antes de criar qualquer animação.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border-l-4 border-cyan-500">
              <h3 className="text-lg font-black text-[#0E3A5F] mb-2">2. Criamos com base científica</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Desenvolvemos animações usando Video Modeling - uma prática baseada em evidências aprovada pelo Texas Education Agency e integrada às diretrizes do NCAEP.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border-l-4 border-cyan-500">
              <h3 className="text-lg font-black text-[#0E3A5F] mb-2">3. Adaptamos para o conforto</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Cores, sons, ritmo e estímulos são ajustados para garantir o máximo de conforto e engajamento. A previsibilidade é essencial para crianças com TEA.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border-l-4 border-cyan-500">
              <h3 className="text-lg font-black text-[#0E3A5F] mb-2">4. Acompanhamos a evolução</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Avaliamos o progresso de cada vídeo e melhoramos continuamente com base no feedback dos pais e responsáveis.
              </p>
            </div>
          </div>

          <div className="mt-10 p-6 bg-gradient-to-r from-[#0E3A5F] to-[#1e5a8a] rounded-2xl">
            <p className="text-white text-center text-base leading-relaxed">
              &ldquo;Acreditamos que cada criança merece aprender de forma <span className="font-bold">divertida</span>, <span className="font-bold">segura</span> e <span className="text-cyan-300">no seu ritmo</span>.&rdquo;
            </p>
          </div>

        </div>
      </div>

      {/* Video Modeling */}
      <div className="py-16 px-6 bg-gradient-to-b from-white to-cyan-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-widest rounded-full mb-4">
              Baseado em Evidências
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[#0E3A5F] mb-4">
              O que é Video Modeling?
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Uma prática cientificamente comprovada para ensinar crianças com TEA
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-cyan-100 text-center">
              <div className="w-14 h-14 bg-cyan-100 rounded-2xl flex items-center justify-center text-3xl mb-4 mx-auto">
                🎬
              </div>
              <h3 className="text-lg font-black text-[#0E3A5F] mb-2">O que é?</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                A criança aprende assistindo vídeos de um modelo (personagem, irmão, terapeuta) realizando uma tarefa específica.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-lg border border-green-100 text-center">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-3xl mb-4 mx-auto">
                ✨
              </div>
              <h3 className="text-lg font-black text-[#0E3A5F] mb-2">Por que funciona?</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Crianças com TEA respondem muito bem a estímulos visuais. O vídeo oferece consistência, repetição infinita e modelos positivos.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-lg border border-purple-100 text-center">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-3xl mb-4 mx-auto">
                📊
              </div>
              <h3 className="text-lg font-black text-[#0E3A5F] mb-2">Eficácia</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Revisões científicas comprovam que Video Modeling é eficaz para ensinar comunicação e habilidades sociais.
              </p>
            </div>
          </div>

          {/* Habilidades */}
          <div className="bg-gradient-to-r from-[#0E3A5F] to-[#1e5a8a] p-8 rounded-3xl shadow-lg">
            <h3 className="text-lg font-black text-white mb-6 text-center">Habilidades que podemos trabalhar</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { icon: "💬", title: "Comunicação" },
                { icon: "😊", title: "Reconhecimento de emoções" },
                { icon: "🤝", title: "Habilidades sociais" },
                { icon: "🔄", title: "Rotinas diárias" },
                { icon: "🧹", title: "Autocuidado" },
                { icon: "🎮", title: "Brincar" },
                { icon: "🗣️", title: "Fala e linguagem" },
                { icon: "👀", title: "Contato visual" },
                { icon: "🎯", title: "Atenção" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-white/10 rounded-xl">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-white font-medium text-sm">{item.title}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-slate-400 text-xs mt-8">
            Prática validada pelo Texas Education Agency e NCAEP
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 px-6 text-center bg-slate-50">
        <p className="text-slate-500 mb-6 font-medium">Quer ver o ANIKO em ação?</p>
        <Link 
          href="/como-funciona"
          className="inline-flex items-center gap-2 px-10 py-5 bg-[#0E3A5F] text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
          Como funciona?
        </Link>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-slate-100 py-8 mt-auto bg-white">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-slate-400 font-medium">© 2026 Aniko — Feito com <span className="text-red-400">♥</span> para o Nikolas.</p>
        </div>
      </footer>
    </main>
  );
}
