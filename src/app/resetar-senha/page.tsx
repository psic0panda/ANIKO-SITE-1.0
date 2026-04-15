"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      alert("Senha atualizada com sucesso!");
      router.push("/login");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-white">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-brand-primary mb-2">Nova Senha</h1>
            <p className="text-slate-400 font-medium text-sm">Escolha uma senha segura e fácil de lembrar.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-500 text-sm font-bold rounded-2xl border border-red-100 italic">
              {error}
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="relative">
              <label className="block text-sm font-bold text-brand-primary mb-2 ml-1">Nova Senha</label>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-primary focus:bg-white transition-all outline-none text-brand-primary font-medium pr-14"
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
              className="w-full py-5 rounded-2xl bg-brand-primary text-white font-black text-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? "Atualizando..." : "Salvar Nova Senha"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
