"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff } from "lucide-react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [parentName, setParentName] = useState("");
  const [childName, setChildName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

    // 2. Atualizar/Criar perfil na tabela 'profiles' (usando upsert para evitar conflitos com triggers)
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert([
          { 
            id: authData.user.id, 
            parent_name: parentName, 
            child_name: childName,
            phone: phone,
            email: email
          }
        ]);

      if (profileError) {
        console.error("Erro ao criar perfil:", profileError);
      }
    }

    alert("Cadastro realizado com sucesso! Verifique seu e-mail para confirmar (se habilitado) ou faça login.");
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-accent/5 via-transparent to-transparent">
      <div className="w-full max-w-xl">
        <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
          <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all">
            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
          </div>
          <span className="font-bold text-brand-primary">Voltar para Home</span>
        </Link>

        <div className="bg-white rounded-[3.5rem] p-10 md:p-14 shadow-2xl border border-white">
          <div className="mb-10">
            <h1 className="text-4xl font-black text-brand-primary mb-3">Criar Conta</h1>
            <p className="text-slate-400 font-medium">Junte-se à jornada personalizada do seu filho.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-500 text-sm font-bold rounded-2xl border border-red-100 animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-brand-primary mb-2 ml-1">Seu Nome Completo</label>
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
                placeholder="Ex: Pedro"
                required
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-accent focus:bg-white transition-all outline-none text-brand-primary font-medium"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-bold text-brand-primary mb-2 ml-1">WhatsApp (com DDD)</label>
              <input 
                type="tel" 
                placeholder="Ex: 11999999999"
                required
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-accent focus:bg-white transition-all outline-none text-brand-primary font-medium"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
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
