"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("E-mail ou senha incorretos. Verifique seus dados.");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-slate-50 p-6 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-brand-secondary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-brand-accent/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md animate-fade-up">
        <div className="bg-white rounded-[3rem] p-12 shadow-2xl border border-white relative overflow-hidden">
          {/* Logo Top */}
          <div className="flex flex-col items-center mb-10">
            <Link href="/">
              <Image 
                src="/assets/logo.jpeg" 
                alt="Aniko Logo" 
                width={80} 
                height={80} 
                className="rounded-2xl shadow-lg mb-4 hover:scale-110 transition-transform"
              />
            </Link>
            <h1 className="text-3xl font-black text-brand-primary">Área dos Pais</h1>
            <p className="text-slate-400 font-medium">Bem-vindo à jornada de seu filho.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-500 text-sm font-bold rounded-2xl border border-red-100 animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-brand-primary mb-2 ml-1">E-mail</label>
              <input 
                type="email" 
                placeholder="seu@email.com"
                required
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-secondary focus:bg-white transition-all outline-none text-brand-primary font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-brand-primary mb-2 ml-1">Senha</label>
              <input 
                type="password" 
                placeholder="••••••••"
                required
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-secondary focus:bg-white transition-all outline-none text-brand-primary font-medium"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="flex justify-end mt-2 mr-1">
                <Link href="/esqueci-senha" font-medium className="text-xs text-slate-400 hover:text-brand-primary font-bold">
                  Esqueceu sua senha?
                </Link>
              </div>
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 rounded-2xl bg-brand-primary text-white font-black text-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? "Acessando..." : "Acessar Painel"}
            </button>
          </form>

          <div className="mt-10 text-center space-y-4">
            <p className="text-slate-400 font-medium">
              Não tem uma conta?{" "}
              <Link href="/cadastro" className="text-brand-primary font-bold hover:underline decoration-brand-secondary decoration-2 underline-offset-4">
                Cadastre-se grátis
              </Link>
            </p>
            <Link href="/" className="block text-sm text-slate-400 font-bold hover:text-brand-primary transition-colors">
              Voltar para o site
            </Link>
          </div>
        </div>
        
        <p className="mt-8 text-center text-slate-400 text-sm font-medium">
          Ainda não tem acesso? <span className="text-brand-secondary cursor-pointer">Solicite um convite.</span>
        </p>
      </div>
    </main>
  );
}
