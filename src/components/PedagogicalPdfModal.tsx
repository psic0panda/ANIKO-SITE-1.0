"use client";

import React from "react";
import { X, Printer, Sparkles, CheckCircle2, HeartHandshake, Shield, FileText } from "lucide-react";

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
          <span>Imprimir / Salvar PDF</span>
        </button>
        <button
          onClick={onClose}
          className="p-2.5 bg-white/20 hover:bg-white/30 text-white rounded-2xl backdrop-blur-md transition-all"
        >
          <X size={20} />
        </button>
      </div>

      {/* Conteúdo do Documento Impresso */}
      <div className="bg-white w-full max-w-3xl rounded-3xl p-8 md:p-12 shadow-2xl space-y-8 my-8 print:shadow-none print:m-0 print:p-0 print:rounded-none text-slate-800">
        
        {/* Cabeçalho do Documento */}
        <div className="flex justify-between items-start border-b-2 border-slate-100 pb-6">
          <div>
            <div className="flex items-center gap-2 text-brand-primary font-black text-xl tracking-tighter uppercase">
              <span className="text-2xl">🐧</span>
              <span>ANIKO — Educação Adaptativa</span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Relatório de Orientação Pedagógica & Análise Comportamental (ABA)
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
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Plano Individualizado para:</p>
            <h1 className="text-2xl font-black text-brand-primary">{childName}</h1>
          </div>
          <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-100 text-xs font-bold text-slate-600">
            <span>Tema: <strong>{title}</strong></span>
          </div>
        </div>

        {/* Metas Pedagógicas e de Modelagem (ABA) */}
        <div className="space-y-4">
          <h2 className="text-lg font-black text-brand-primary flex items-center gap-2 border-b pb-2">
            <Sparkles className="text-brand-accent" size={18} />
            <span>1. Objetivos do Roteiro Adaptativo</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <p className="font-black text-slate-700 flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-500" />
                Desensibilização Sensorial
              </p>
              <p className="text-slate-500">Apresentação gradual do estímulo da rotina de forma previsível e sem surpresas sonoras.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <p className="font-black text-slate-700 flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-500" />
                Video Modeling Perspectivo
              </p>
              <p className="text-slate-500">Demonstração da ação passo a passo para imitação e reforçamento de autonomia.</p>
            </div>
          </div>
        </div>

        {/* Guia de Mediação para os Pais e Terapeutas */}
        <div className="space-y-4">
          <h2 className="text-lg font-black text-brand-primary flex items-center gap-2 border-b pb-2">
            <HeartHandshake className="text-brand-warmth" size={18} />
            <span>2. Como Aplicar Durante a Rotina</span>
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-xs font-medium text-slate-600">
            <li><strong>Assista junto nos primeiros dias:</strong> Sente-se ao lado da criança em um ambiente tranquilo sem ruídos externos.</li>
            <li><strong>Reforce as frases da animação:</strong> Quando a criança estiver vivenciando a rotina real (ex: lavar as mãos), repita as mesmas frases curtas ditas pelo personagem.</li>
            <li><strong>Use o Reforçador Positivo:</strong> Elogie ou dê um abraço logo em seguida a cada pequena etapa completada com sucesso.</li>
          </ol>
        </div>

        {/* Nota Técnica de Acessibilidade */}
        <div className="p-4 rounded-2xl bg-brand-primary/5 border border-brand-primary/10 flex items-center gap-3 text-xs text-slate-600">
          <Shield className="text-brand-primary flex-shrink-0" size={20} />
          <span>Roteiro gerado de acordo com as Diretrizes da Análise do Comportamento Aplicada (ABA) e Princípios da Integração Sensorial.</span>
        </div>

        {/* Rodapé do PDF */}
        <div className="pt-6 border-t border-slate-100 text-center text-[10px] text-slate-400 font-medium">
          <p>© 2026 ANIKO - Tecnologia Educacional e Sensorial Adaptativa | www.aniko.com.br</p>
        </div>
      </div>
    </div>
  );
}
