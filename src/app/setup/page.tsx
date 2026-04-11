"use client";

import { useState } from "react";

export default function SetupPage() {
  const [copied, setCopied] = useState(false);

  const sql = "ALTER TABLE profiles ADD COLUMN historico text;";

  const copySql = () => {
    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-lg w-full space-y-8">
        <div className="text-center">
          <div className="text-5xl mb-4">🛠️</div>
          <h1 className="text-2xl font-black text-brand-primary">
            Configurar Banco de Dados
          </h1>
        </div>
        
        <div className="space-y-4">
          <p className="text-slate-600">
            Para adicionar o campo "Histórico da Criança", você precisa executar um comando SQL no Supabase:
          </p>

          <div className="relative">
            <pre className="bg-slate-800 text-green-400 p-4 rounded-xl text-sm font-mono overflow-x-auto">
              {sql}
            </pre>
            <button 
              onClick={copySql}
              className="absolute top-2 right-2 px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs rounded-lg transition-colors"
            >
              {copied ? '✓ Copiado!' : '📋 Copiar'}
            </button>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
            <p className="text-yellow-800 text-sm">
              <strong>Como fazer:</strong><br/>
              1. Acesse seu projeto no Supabase<br/>
              2. Vá em SQL Editor<br/>
              3. Cole e execute o comando acima<br/>
              4. Pronto!
            </p>
          </div>
        </div>

        <a 
          href="/admin" 
          className="block text-center text-slate-400 hover:text-brand-primary font-bold"
        >
          ← Voltar ao Admin
        </a>
      </div>
    </main>
  );
}
