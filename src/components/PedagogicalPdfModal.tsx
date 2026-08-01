"use client";

import React from "react";
import { X, Printer, Sparkles, CheckCircle2, HeartHandshake, Shield, Star, BookOpen } from "lucide-react";

interface PedagogicalPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: {
    title: string;
    description?: string;
    routine_type?: string;
    child_name?: string;
    created_at?: string;
  } | null;
}

export default function PedagogicalPdfModal({ isOpen, onClose, video }: PedagogicalPdfModalProps) {
  if (!isOpen || !video) return null;

  const handlePrint = () => {
    window.print();
  };

  const childName = video.child_name || "Criança";
  const title = video.title || "Animação Adaptativa";
  const dateStr = video.created_at ? new Date(video.created_at).toLocaleDateString("pt-BR") : new Date().toLocaleDateString("pt-BR");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 overflow-y-auto print:p-0 print:bg-white">
      {/* Botões de Ação Superiores (Escondidos ao Imprimir) */}
      <div className="fixed top-6 right-6 flex items-center gap-3 z-[110] print:hidden">
        <button
          onClick={handlePrint}
          className="px-5 py-2.5 bg-brand-accent hover:bg-brand-accent/90 text-white font-black rounded-2xl shadow-xl flex items-center gap-2 text-sm transition-all"
        >
          <Printer size={16} />
          <span>Imprimir / Salvar Guia (PDF)</span>
        </button>
        <button
          onClick={onClose}
          className="p-2.5 bg-white/20 hover:bg-white/30 text-white rounded-2xl backdrop-blur-md transition-all"
        >
          <X size={20} />
        </button>
      </div>

      {/* Conteúdo do Documento Impresso */}
      <div className="bg-white w-full max-w-3xl rounded-3xl p-8 md:p-12 shadow-2xl space-y-8 my-8 print:shadow-none print:m-0 print:p-0 print:rounded-none text-slate-800 border border-slate-100">
        
        {/* Cabeçalho do Documento */}
        <div className="flex justify-between items-start border-b-2 border-slate-100 pb-6">
          <div>
            <div className="flex items-center gap-2 text-brand-primary font-black text-xl tracking-tighter uppercase">
              <span className="text-2xl">🐧</span>
              <span>ANIKO — Guia Prático de Uso</span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Orientação de Aplicação na Rotina & Apoio à Autonomia Infantil
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-slate-400 block">Data da Emissão</span>
            <span className="text-sm font-black text-brand-primary">{dateStr}</span>
          </div>
        </div>

        {/* Banner do Aluno */}
        <div className="bg-gradient-to-r from-brand-primary/5 via-brand-accent/10 to-brand-primary/5 p-6 rounded-2xl border border-brand-accent/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Guia de Uso Preparado para:</p>
            <h1 className="text-2xl font-black text-brand-primary">{childName}</h1>
          </div>
          <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-100 text-xs font-bold text-slate-600">
            <span>Tema da Animação: <strong>{title}</strong></span>
          </div>
        </div>

        {/* 1. Objetivos do Guia */}
        <div className="space-y-4">
          <h2 className="text-lg font-black text-brand-primary flex items-center gap-2 border-b pb-2">
            <Sparkles className="text-brand-accent" size={18} />
            <span>1. Objetivo Prático desta Animação</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <p className="font-black text-slate-700 flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-500" />
                Previsibilidade de Rotina
              </p>
              <p className="text-slate-500 leading-relaxed">
                Prepara a criança visualmente para o momento da atividade, diminuindo a ansiedade e facilitando a transição de tarefas.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <p className="font-black text-slate-700 flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-500" />
                Aprendizado por Imitação
              </p>
              <p className="text-slate-500 leading-relaxed">
                Demonstra cada passo da ação com o personagem favorito de forma leve, estimulando a reprodução natural na rotina.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Como Usar na Prática */}
        <div className="space-y-4">
          <h2 className="text-lg font-black text-brand-primary flex items-center gap-2 border-b pb-2">
            <HeartHandshake className="text-brand-warmth" size={18} />
            <span>2. Como Usar na Prática com a Criança</span>
          </h2>
          <div className="space-y-3 text-xs font-medium text-slate-600">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
              <span className="px-2.5 py-1 bg-brand-primary text-white rounded-lg font-black text-xs shrink-0">Passo 1</span>
              <div>
                <strong className="text-slate-800 text-sm block mb-0.5">Momento de Assistir:</strong>
                <p className="text-slate-500 leading-relaxed">Assista ao vídeo junto com a criança em um momento calmo, preferencialmente alguns minutos antes de realizar a rotina real.</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
              <span className="px-2.5 py-1 bg-brand-accent text-white rounded-lg font-black text-xs shrink-0">Passo 2</span>
              <div>
                <strong className="text-slate-800 text-sm block mb-0.5">Frases-Chave do Personagem:</strong>
                <p className="text-slate-500 leading-relaxed">Durante o momento da atividade (ex: escovar os dentes, tomar banho, guardar brinquedos), repita suavemente as mesmas frases curtas usadas no vídeo.</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
              <span className="px-2.5 py-1 bg-brand-warmth text-white rounded-lg font-black text-xs shrink-0">Passo 3</span>
              <div>
                <strong className="text-slate-800 text-sm block mb-0.5">Comemoração e Incentivo:</strong>
                <p className="text-slate-500 leading-relaxed">Elogie com alegria cada etapa que a criança concluir. O reforço positivo constante gera confiança e estimula a independência.</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Dica Prática para a Família */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-amber-500/10 border border-amber-500/20 space-y-2">
          <p className="text-xs font-black text-amber-800 flex items-center gap-2">
            <Star size={16} className="text-amber-500 fill-amber-500" />
            <span>Dica Especial Aniko para a Família</span>
          </p>
          <p className="text-xs text-amber-900/80 leading-relaxed font-medium">
            Respeite sempre o tempo da criança. A repetição diária com carinho e previsibilidade é a chave para transformar novos hábitos em conquistas duradouras.
          </p>
        </div>

        {/* Nota Rodapé */}
        <div className="p-4 rounded-2xl bg-brand-primary/5 border border-brand-primary/10 flex items-center gap-3 text-xs text-slate-600">
          <Shield className="text-brand-primary flex-shrink-0" size={18} />
          <span>Guia prático desenvolvido para apoiar pais e responsáveis no dia a dia da criança.</span>
        </div>

        {/* Rodapé do PDF */}
        <div className="pt-4 border-t border-slate-100 text-center text-[10px] text-slate-400 font-medium">
          <p>© 2026 ANIKO - Tecnologia e Animações Adaptativas | www.aniko.com.br</p>
        </div>
      </div>
    </div>
  );
}
