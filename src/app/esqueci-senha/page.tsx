"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/resetar-senha`,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("E-mail de recuperação enviado! Verifique sua caixa de entrada.");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-brand-secondary/5 via-transparent to-transparent">
      <div className="w-full max-w-md">
        <Link href="/login" className="inline-flex items-center gap-2 mb-8 group">
          <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all">
            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
          </div>
          <span className="font-bold text-brand-primary">Voltar para Login</span>
        </Link>

        <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-white">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-brand-primary mb-2">Esqueceu a senha?</h1>
            <p className="text-slate-400 font-medium text-sm">Não se preocupe! Te enviaremos um link de recuperação.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-500 text-sm font-bold rounded-2xl border border-red-100 italic">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-6 p-4 bg-green-50 text-green-600 text-sm font-bold rounded-2xl border border-green-100">
              {message}
            </div>
          )}

          <form onSubmit={handleReset} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-brand-primary mb-2 ml-1">Seu E-mail</label>
              <input 
                type="email" 
                placeholder="seu@email.com"
                required
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-primary focus:bg-white transition-all outline-none text-brand-primary font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 rounded-2xl bg-brand-primary text-white font-black text-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? "Enviando..." : "Enviar Link"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
