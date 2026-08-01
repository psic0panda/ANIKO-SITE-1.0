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

      {/* Seção de Planos Mensais de Créditos para Clínicas & Terapeutas */}
      <section className="w-full max-w-7xl px-6 py-16 animate-fade-up stagger-4">
        <div className="text-center space-y-4 mb-16">
          <span className="inline-block rounded-full bg-brand-primary/10 px-5 py-2 text-xs font-black uppercase tracking-widest text-brand-primary">
            🏥 Soluções para Clínicas & Terapeutas
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-brand-primary tracking-tight">
            Planos Mensais de Créditos para Clínicas
          </h2>
          <p className="max-w-3xl mx-auto text-xl text-slate-600 font-medium">
            Economize na produção de vídeos adaptados e tenha um painel exclusivo para gerenciar os conteúdos dos seus pacientes.
          </p>
        </div>

        {/* Cards dos Planos Lado a Lado */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Plano Essencial */}
          <div className="relative group rounded-[2.5rem] bg-white p-8 md:p-12 border-2 border-slate-200 shadow-xl flex flex-col justify-between hover:border-brand-primary/40 transition-all duration-300">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Plano Essencial</span>
                  <h3 className="text-3xl font-black text-brand-primary mt-1">4 Créditos<span className="text-base text-slate-400 font-normal">/mês</span></h3>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">R$ 65/crédito</span>
              </div>

              <div className="flex items-baseline gap-2 py-2 border-y border-slate-100">
                <span className="text-3xl font-bold text-brand-primary">R$</span>
                <span className="text-6xl font-black text-brand-primary tracking-tighter">260</span>
                <span className="text-xl font-bold text-slate-400">/mês</span>
              </div>

              <ul className="space-y-4 text-slate-700 font-medium">
                <li className="flex items-center gap-3">
                  <span className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-black">✓</span>
                  <span>4 solicitações de vídeos por mês</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-black">✓</span>
                  <span>Painel de gestão de saldo e solicitações</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-black">✓</span>
                  <span>Suavização sensorial e animação adaptativa</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-black">✓</span>
                  <span>1 ajuste por solicitação incluso</span>
                </li>
                <li className="flex items-center gap-3 text-brand-primary font-bold">
                  <span className="h-6 w-6 rounded-full bg-brand-accent/20 text-brand-primary flex items-center justify-center text-sm font-black">✨</span>
                  <span>Créditos cumulativos por até 60 dias</span>
                </li>
              </ul>
            </div>

            <Link
              href="/login?plan=essencial"
              className="mt-8 w-full py-5 rounded-2xl bg-slate-900 text-white text-lg font-black shadow-lg hover:bg-brand-primary hover:scale-[1.02] active:scale-95 transition-all text-center block"
            >
              Assinar Plano Essencial
            </Link>
          </div>

          {/* Plano Pro (Destaque) */}
          <div className="relative group rounded-[2.5rem] bg-gradient-to-b from-brand-primary via-[#0A3D62] to-[#041F35] p-8 md:p-12 text-white shadow-2xl flex flex-col justify-between border-4 border-brand-warmth hover:scale-[1.02] transition-all duration-300">
            <span className="absolute -top-4 right-8 rounded-full bg-brand-warmth px-4 py-1.5 text-xs font-black uppercase text-white shadow-md">
              🔥 Mais Popular / Recomendado
            </span>

            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-sm font-bold text-slate-300 uppercase tracking-wider">Plano Pro</span>
                  <h3 className="text-3xl font-black text-white mt-1">8 Créditos<span className="text-base text-slate-300 font-normal">/mês</span></h3>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-brand-accent">R$ 55/crédito</span>
              </div>

              <div className="flex items-baseline gap-2 py-2 border-y border-white/10">
                <span className="text-3xl font-bold text-slate-200">R$</span>
                <span className="text-6xl font-black text-white tracking-tighter">440</span>
                <span className="text-xl font-bold text-slate-300">/mês</span>
              </div>

              <ul className="space-y-4 text-slate-100 font-medium">
                <li className="flex items-center gap-3">
                  <span className="h-6 w-6 rounded-full bg-brand-accent text-brand-primary flex items-center justify-center text-sm font-black">✓</span>
                  <span>8 solicitações de vídeos por mês</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-6 w-6 rounded-full bg-brand-accent text-brand-primary flex items-center justify-center text-sm font-black">✓</span>
                  <span>Painel de gestão de saldo e solicitações</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-6 w-6 rounded-full bg-brand-accent text-brand-primary flex items-center justify-center text-sm font-black">✓</span>
                  <span>Suavização sensorial e animação adaptativa</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-6 w-6 rounded-full bg-brand-accent text-brand-primary flex items-center justify-center text-sm font-black">✓</span>
                  <span>1 ajuste por solicitação incluso</span>
                </li>
                <li className="flex items-center gap-3 text-brand-accent font-bold">
                  <span className="h-6 w-6 rounded-full bg-brand-accent/20 text-brand-accent flex items-center justify-center text-sm font-black">⚡</span>
                  <span>Prioridade na fila de produção</span>
                </li>
                <li className="flex items-center gap-3 text-white font-bold">
                  <span className="h-6 w-6 rounded-full bg-white/20 text-white flex items-center justify-center text-sm font-black">✨</span>
                  <span>Créditos cumulativos por até 60 dias</span>
                </li>
              </ul>
            </div>

            <Link
              href="/login?plan=pro"
              className="mt-8 w-full py-5 rounded-2xl bg-brand-warmth text-white text-lg font-black shadow-xl hover:bg-brand-warmth/90 hover:scale-[1.02] active:scale-95 transition-all text-center block"
            >
              Assinar Plano Pro
            </Link>
          </div>
        </div>

        {/* Bloco Informativo do Painel de Assinante */}
        <div className="mt-20 max-w-5xl mx-auto rounded-[2.5rem] bg-slate-50 border border-slate-200 p-10 md:p-14 text-center space-y-10">
          <div className="space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-brand-primary">💡 Simplicidade Total</span>
            <h3 className="text-3xl md:text-4xl font-black text-brand-primary">Como funciona o Painel de Assinante?</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
              <div className="h-12 w-12 rounded-xl bg-brand-primary/10 text-brand-primary text-xl font-black flex items-center justify-center">1</div>
              <h4 className="text-lg font-bold text-brand-primary">Receba seus créditos</h4>
              <p className="text-sm text-slate-600 leading-relaxed">Todo mês seus créditos são recarregados automaticamente no painel da sua clínica.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
              <div className="h-12 w-12 rounded-xl bg-brand-accent/20 text-brand-primary text-xl font-black flex items-center justify-center">2</div>
              <h4 className="text-lg font-bold text-brand-primary">Faça solicitações</h4>
              <p className="text-sm text-slate-600 leading-relaxed">Use 1 crédito por vídeo personalizado informando a rotina e o nome do paciente.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-700 text-xl font-black flex items-center justify-center">3</div>
              <h4 className="text-lg font-bold text-brand-primary">Acompanhe o status</h4>
              <p className="text-sm text-slate-600 leading-relaxed">Veja em tempo real quando o vídeo estiver pronto para download e notifique a família.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partnerships Section */}
      <section className="w-full max-w-4xl px-6 py-16 animate-fade-up stagger-4">
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
