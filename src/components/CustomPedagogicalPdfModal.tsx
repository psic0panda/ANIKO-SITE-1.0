"use client";

import React from "react";
import { X, Printer, Sparkles, HeartHandshake, ShieldCheck } from "lucide-react";

interface CustomPedagogicalPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  childName: string;
  guideContent: string;
}

export default function CustomPedagogicalPdfModal({
  isOpen,
  onClose,
  childName,
  guideContent,
}: CustomPedagogicalPdfModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const todayStr = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto print:p-0 print:bg-white">
      {/* Botões de Ação Superiores (Escondidos na Impressão) */}
      <div className="fixed top-6 right-6 flex items-center gap-3 z-[110] print:hidden">
        <button
          onClick={handlePrint}
          className="px-5 py-2.5 bg-brand-accent hover:bg-brand-accent/90 text-white font-black rounded-2xl shadow-2xl flex items-center gap-2 text-sm transition-all hover:scale-105"
        >
          <Printer size={18} />
          <span>Imprimir / Salvar em PDF</span>
        </button>
        <button
          onClick={onClose}
          className="p-2.5 bg-white/20 hover:bg-white/30 text-white rounded-2xl backdrop-blur-md transition-all"
        >
          <X size={20} />
        </button>
      </div>

      {/* Conteúdo do Documento */}
      <div
        id="printable-pdf-guide"
        className="bg-white w-full max-w-3xl rounded-3xl p-8 md:p-12 shadow-2xl space-y-8 my-8 print:shadow-none print:m-0 print:p-0 print:rounded-none text-slate-800 border border-slate-100"
      >
        {/* Cabeçalho Oficial */}
        <div className="flex justify-between items-start border-b-2 border-slate-100 pb-6">
          <div>
            <div className="flex items-center gap-2 text-brand-primary font-black text-2xl tracking-tighter uppercase">
              <span className="text-3xl">🐧</span>
              <span>ANIKO — Plano Especial de Suporte</span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Guia Pedagógico Personalizado & Estratégia de Desenvolvimento
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-slate-400 block uppercase">Emissão</span>
            <span className="text-sm font-black text-brand-primary">{todayStr}</span>
          </div>
        </div>

        {/* Banner do Aluno */}
        <div className="bg-gradient-to-r from-brand-primary/10 via-brand-accent/15 to-brand-primary/10 p-6 rounded-2xl border border-brand-accent/30 flex justify-between items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Plano Elaborado para:</p>
            <h1 className="text-3xl font-black text-brand-primary mt-0.5">{childName || "Aluno(a)"}</h1>
          </div>
          <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-200 text-xs font-black text-brand-accent flex items-center gap-1.5">
            <ShieldCheck size={16} />
            <span>Caso Especial & ABA</span>
          </div>
        </div>

        {/* Corpo do Guia */}
        <div className="prose prose-slate max-w-none text-xs md:text-sm leading-relaxed space-y-4 whitespace-pre-wrap font-medium">
          {guideContent}
        </div>

        {/* Rodapé Oficial */}
        <div className="border-t-2 border-slate-100 pt-6 flex justify-between items-center text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-brand-accent" />
            <span>ANIKO — Tecnologia Adaptativa para TEA</span>
          </div>
          <div className="flex items-center gap-1">
            <HeartHandshake size={14} className="text-pink-400" />
            <span>Suporte Pedagógico Especializado</span>
          </div>
        </div>
      </div>
    </div>
  );
}
