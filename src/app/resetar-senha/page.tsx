"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import BackgroundDecor from "@/components/BackgroundDecor";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verificar se existe uma sessão (vinda do link do e-mail)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Se não houver sessão, talvez o link tenha expirado ou seja inválido
        // Mas permitimos tentar pois o erro virá do Supabase se falhar
      }
    };
    checkSession();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Feedback visual antes de redirecionar
      setLoading(false);
      alert("Senha atualizada com sucesso! Agora você pode entrar com sua nova senha.");
      router.push("/login");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Elementos Decorativos de Fundo */}
      <BackgroundDecor />
      
      <div className="w-full max-w-md relative z-10 transition-all duration-700 animate-in fade-in slide-in-from-bottom-5">
        <div className="flex justify-center mb-8">
          <div className="h-16 w-16 bg-brand-primary rounded-2xl flex items-center justify-center shadow-lg shadow-brand-primary/20 rotate-3">
             <Image src="/logo-white.png" alt="Aniko Logo" width={40} height={40} className="-rotate-3" />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] p-10 shadow-2xl border border-white/50 relative overflow-hidden">
          {/* Brilho decorativo interno */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-accent/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="mb-8">
              <h1 className="text-3xl font-black text-brand-primary mb-2">Criar Nova Senha</h1>
              <p className="text-slate-400 font-medium text-sm leading-relaxed">
                Quase lá! Escolha uma nova senha segura para sua conta.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-500 text-sm font-bold rounded-2xl border border-red-100 italic animate-shake">
                {error}
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="group">
                <label className="block text-sm font-bold text-brand-primary mb-2 ml-1 transition-colors group-focus-within:text-brand-accent">
                  Nova Senha
                </label>
                <div className="relative">
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50/50 border-2 border-transparent focus:border-brand-accent focus:bg-white transition-all outline-none text-brand-primary font-medium"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-bold text-brand-primary mb-2 ml-1 transition-colors group-focus-within:text-brand-accent">
                  Confirmar Nova Senha
                </label>
                <div className="relative">
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50/50 border-2 border-transparent focus:border-brand-accent focus:bg-white transition-all outline-none text-brand-primary font-medium"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 rounded-2xl bg-brand-primary text-white font-black text-xl shadow-xl shadow-brand-primary/20 hover:bg-brand-primary/90 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Atualizando...</span>
                  </div>
                ) : "Alterar Senha"}
              </button>
            </form>

            <div className="mt-8 text-center">
               <Link href="/login" className="text-slate-400 font-bold text-sm hover:text-brand-primary transition-colors">
                  Cancelar e voltar para o login
               </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
