"use client";

import Image from "next/image";
import Link from "next/link";

export default function Contato() {
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
            Quem está por trás <span className="text-cyan-300">do Aniko</span>
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-prose mx-auto">
            Uma história de amor, tecnologia e propósito
          </p>
        </div>
      </div>

      {/* Seção principal */}
      <div className="max-w-2xl mx-auto px-6 pb-16">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          
          {/* Foto de perfil */}
          <div className="flex flex-col items-center -mt-28 mb-10">
            <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-white shadow-xl ring-4 ring-cyan-100">
              <Image 
                src="/assets/NOVO PERFIL.jpeg" 
                alt="Henrique Neto" 
                width={220} 
                height={280} 
                className="w-full h-full object-cover object-top"
                priority
              />
            </div>
          </div>

          {/* Nome e título */}
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-[#0E3A5F] mb-2">Henrique Neto</h2>
            <p className="text-cyan-600 font-semibold text-xs uppercase tracking-widest">Criador do Aniko</p>
          </div>

          {/* História */}
          <div className="space-y-6 text-slate-600 leading-relaxed text-center max-w-prose mx-auto">
            <p className="text-base">
              Editor de vídeo há mais de 7 anos, combinei minha experiência em produção audiovisual com inteligência artificial para criar algo que fosse além do entretenimento.
            </p>
            
            <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100">
              <p className="text-[#0E3A5F] font-medium">Mas o Aniko nasceu de outro lugar...</p>
            </div>

            <p>
              Sou tio do Nikolas, uma criança atípica. Conviver com ele me mostrou os desafios da comunicação, do aprendizado e da adaptação aos estímulos do dia a dia.
            </p>

            <blockquote className="text-lg text-[#0E3A5F] font-medium italic border-l-4 border-cyan-400 pl-4 py-1 text-left bg-blue-50/50 rounded-r-lg">
              &ldquo;Foi o Nikolas quem me inspirou a criar o Aniko.&rdquo;
            </blockquote>

            <p>
              Hoje, meu propósito é transformar tecnologia em uma ferramenta acessível e personalizada, capaz de apoiar o desenvolvimento de crianças com TEA de forma leve, segura e envolvente.
            </p>
          </div>

          {/* Contatos */}
          <div className="mt-12 space-y-4">
            <a 
              href="mailto:henriquenetopsi@gmail.com" 
              className="flex items-center gap-4 p-5 rounded-2xl bg-[#0E3A5F] hover:bg-[#0a2d4a] transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <p className="text-xs font-bold text-cyan-200 uppercase tracking-wider">E-mail</p>
                <p className="text-base font-bold text-white">Fale comigo</p>
              </div>
            </a>

            <a 
              href="https://wa.me/5581988420706" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-100 uppercase tracking-wider">WhatsApp</p>
                <p className="text-base font-bold text-white">Manda uma msg</p>
              </div>
            </a>
          </div>

        </div>
      </div>

      {/* CTA */}
      <div className="py-16 px-6 text-center bg-slate-50">
        <p className="text-slate-500 mb-6 font-medium">Pronto para conhecer o Aniko?</p>
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
