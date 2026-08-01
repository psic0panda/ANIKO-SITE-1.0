"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff } from "lucide-react";

function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [parentName, setParentName] = useState("");
  const [childName, setChildName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const refCode = searchParams.get("ref");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 1. Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          parent_name: parentName,
          child_name: childName,
          phone: phone,
        }
      }
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // 2. Atualizar/Criar perfil na tabela 'profiles'
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert([
          { 
            id: authData.user.id, 
            parent_name: parentName, 
            child_name: childName,
            phone: phone,
            email: email,
            referred_by: refCode || null
          }
        ]);

      if (profileError) {
        console.error("Erro ao criar perfil:", profileError);
      }
    }

    router.push("/dashboard");
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center p-6 bg-slate-50 overflow-hidden">
      <div className="w-full max-w-xl z-10">
        <div className="bg-white rounded-[3rem] p-10 md:p-14 shadow-2xl border border-slate-100 animate-scale-up">
          <div className="text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-3 mb-6">
              <Image src="/assets/logo.jpeg" alt="Logo" width={50} height={50} className="rounded-2xl shadow-md" />
              <span className="text-2xl font-black text-brand-primary tracking-tighter uppercase">ANIKO</span>
            </Link>
            <h1 className="text-3xl font-black text-brand-primary tracking-tight">Criar Conta</h1>
            <p className="text-slate-400 font-medium mt-2">Comece a personalizar as animações do seu filho(a)</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 text-red-500 text-sm font-bold border border-red-100 text-center animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-1">
              <label className="block text-sm font-bold text-brand-primary mb-2 ml-1">Seu Nome (Responsável)</label>
              <input 
                type="text" 
                placeholder="Ex: Maria Silva"
                required
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-accent focus:bg-white transition-all outline-none text-brand-primary font-medium"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-bold text-brand-primary mb-2 ml-1">Nome da Criança</label>
              <input 
                type="text" 
                placeholder="Ex: João"
                required
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-accent focus:bg-white transition-all outline-none text-brand-primary font-medium"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-bold text-brand-primary mb-2 ml-1">Telefone / WhatsApp</label>
              <input 
                type="text" 
                placeholder="(00) 90000-0000"
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-accent focus:bg-white transition-all outline-none text-brand-primary font-medium"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-bold text-brand-primary mb-2 ml-1">E-mail</label>
              <input 
                type="email" 
                placeholder="seu@email.com"
                required
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-accent focus:bg-white transition-all outline-none text-brand-primary font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="md:col-span-2 relative">
              <label className="block text-sm font-bold text-brand-primary mb-2 ml-1">Senha (mín. 6 caracteres)</label>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-accent focus:bg-white transition-all outline-none text-brand-primary font-medium pr-14"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[42px] p-2 text-slate-400 hover:text-brand-primary transition-colors"
                aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className="md:col-span-2 w-full py-5 rounded-3xl bg-brand-accent text-white font-black text-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? "Criando..." : "Criar Minha Conta"}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-400 font-medium">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-brand-primary font-bold hover:underline decoration-brand-accent decoration-2 underline-offset-4">
                Entrar agora
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function Signup() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400">Carregando...</div>}>
      <SignupForm />
    </Suspense>
  );
}
