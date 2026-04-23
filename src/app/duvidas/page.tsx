"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, 
  HelpCircle, 
  Video, 
  Clock, 
  Edit3, 
  Users, 
  Mail,
  MessageCircle,
  Sparkles
} from 'lucide-react';

export default function Duvidas() {
  const faqs = [
    {
      icon: <Video className="w-6 h-6 text-brand-accent" />,
      question: "Por que os personagens se movem pouco nos vídeos?",
      answer: "Nossa animação é focada no processamento visual simplificado. Manter o personagem mais estável ajuda a criança a se concentrar na mensagem e no aprendizado proposto, evitando distrações sensoriais desnecessárias, além de permitir uma entrega ágil e personalizada."
    },
    {
      icon: <Clock className="w-6 h-6 text-brand-accent" />,
      question: "Qual a duração ideal dos vídeos?",
      answer: "Nossos vídeos têm em média de 45 segundos a 1 minuto e 20 segundos. Esse formato é proposital: curto o suficiente para manter o engajamento total da criança e evitar a fadiga, garantindo que o objetivo pedagógico seja absorvido com entusiasmo."
    },
    {
      icon: <Edit3 className="w-6 h-6 text-brand-accent" />,
      question: "Posso solicitar alterações nos vídeos?",
      answer: "Sim! Você tem direito a 1 solicitação de ajuste por vídeo personalizado para garantir que ele esteja perfeito para o seu contexto, desde que a alteração respeite a proposta e roteiro iniciais."
    },
    {
      icon: <Users className="w-6 h-6 text-brand-accent" />,
      question: "O Aniko é exclusivo para crianças autistas?",
      answer: "Embora tenhamos nascido para apoiar o neurodesenvolvimento (TEA), criamos vídeos para qualquer criança! Acreditamos que a educação personalizada e visual beneficia a todos, independentemente do diagnóstico."
    },
    {
      icon: <Sparkles className="w-6 h-6 text-brand-accent" />,
      question: "E se eu precisar de algo muito complexo?",
      answer: "Para projetos com roteiros extensos ou múltiplas interações complexas, pedimos que entre em contato primeiro com nosso suporte. Vamos analisar a viabilidade técnica e criar algo incrível juntos!"
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-brand-primary">
      {/* Dynamic Header */}
      <div className="relative w-full bg-brand-primary pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-brand-accent/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-brand-secondary/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <nav className="relative z-10 mx-auto w-full max-w-7xl flex items-center justify-between px-6 md:px-12">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <Image src="/assets/logo.jpeg" alt="Aniko Logo" width={40} height={40} className="rounded-xl shadow-lg border-2 border-white/10 group-hover:scale-110 transition-transform" />
            <span className="text-xl font-black text-white uppercase tracking-tighter">ANIKO</span>
          </Link>
          <Link href="/dashboard" className="flex items-center gap-2 text-white/70 hover:text-brand-accent font-bold text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar ao Painel
          </Link>
        </nav>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center mt-16 md:mt-24">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 mb-6 animate-fade-in">
             <HelpCircle className="w-4 h-4 text-brand-accent" />
             <span className="text-xs font-bold text-white uppercase tracking-widest">Central de Ajuda</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
            Tire suas <span className="text-brand-accent">dúvidas</span> e <br className="hidden md:block" /> descubra o potencial do Aniko
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Entenda como funcionam nossas animações e como podemos ajudar no desenvolvimento do seu pequeno.
          </p>
        </div>
      </div>

      {/* FAQ Grid */}
      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20 pb-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-accent/10 transition-colors">
                {faq.icon}
              </div>
              <h3 className="text-xl font-black mb-4 leading-tight">{faq.question}</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                {faq.answer}
              </p>
            </div>
          ))}

          {/* Contact Card */}
          <div className="bg-brand-accent rounded-[2.5rem] p-10 text-white shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-black mb-2 leading-tight">Ainda tem perguntas?</h3>
              <p className="text-white/70 text-sm leading-relaxed font-medium mb-8">
                Estamos aqui para ajudar! Entre em contato diretamente com nosso suporte técnico.
              </p>
            </div>
            
            <div className="space-y-4">
              <a 
                href="mailto:aniko.suporte@gmail.com" 
                className="flex items-center justify-center gap-3 w-full py-4 bg-white text-brand-accent rounded-2xl font-black text-sm hover:bg-slate-50 transition-colors shadow-lg"
              >
                aniko.suporte@gmail.com
              </a>
              <p className="text-[10px] text-white/50 text-center font-bold uppercase tracking-widest">Atendimento em até 24h</p>
            </div>
          </div>
        </div>
      </div>



      {/* Footer */}
      <footer className="w-full border-t border-slate-200 py-12 bg-white">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 opacity-50 grayscale">
            <Image src="/assets/logo.jpeg" alt="Logo" width={30} height={30} className="rounded-lg" />
            <span className="text-sm font-black tracking-tighter">ANIKO FAQS</span>
          </div>
          <p className="text-slate-400 font-medium text-sm">© 2026 Aniko — Tecnologia a serviço da inclusão.</p>
          <div className="flex gap-6">
            <Link href="/contato" className="text-xs font-bold text-slate-400 hover:text-brand-primary transition-colors">História do Criador</Link>
            <Link href="/como-funciona" className="text-xs font-bold text-slate-400 hover:text-brand-primary transition-colors">Como Funciona</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
