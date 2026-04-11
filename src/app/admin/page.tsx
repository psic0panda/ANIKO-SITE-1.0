"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [requests, setRequests] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [selectedProfileId, setSelectedProfileId] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Verificar se já está logado (sessionStorage)
  useEffect(() => {
    const saved = sessionStorage.getItem("aniko_admin");
    if (saved === "true") setIsAuthenticated(true);
  }, []);

  // Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: loginUser, pass: loginPass }),
      });
      const data = await res.json();

      if (data.ok) {
        sessionStorage.setItem("aniko_admin", "true");
        setIsAuthenticated(true);
      } else {
        setLoginError("Usuário ou senha incorretos.");
      }
    } catch {
      setLoginError("Erro ao verificar credenciais.");
    } finally {
      setLoginLoading(false);
    }
  };

  // Carregar dados
  useEffect(() => {
    if (!isAuthenticated) return;
    async function fetchData() {
      setLoading(true);
      
      const { data: reqData } = await supabase
        .from('video_requests')
        .select(`id, description, status, created_at, profile_id, profiles(phone, child_name, parent_name, email)`)
        .order('created_at', { ascending: false });
      if (reqData) setRequests(reqData);

      // Carregar todos os perfis
      const { data: profData } = await supabase
        .from('profiles')
        .select('*')
        .order('child_name', { ascending: true });
      if (profData) setProfiles(profData);
      
      setLoading(false);
    }
    fetchData();
  }, [isAuthenticated]);

  // Enviar vídeo
  const handleSendVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl || !selectedProfileId) return;

    const { error } = await supabase
      .from('videos')
      .insert([
        {
          profile_id: selectedProfileId,
          title: videoTitle || "Sua nova animação!",
          video_url: videoUrl,
          category: "Personalizado"
        }
      ]);

    if (!error) {
      alert("Vídeo enviado com sucesso para o pai!");
      setVideoUrl("");
      setVideoTitle("");
      // Não limpamos o ProfileId imediamente para permitir a notificação via WhatsApp no formulário
    } else {
      alert("Erro ao enviar vídeo: " + error.message);
    }
  };

  const filteredProfiles = profiles.filter(p => 
    p.child_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.parent_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ========== TELA DE LOGIN ==========
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-800 rounded-[3rem] p-10 shadow-2xl border border-slate-700 text-center space-y-8">
          <div>
            <div className="text-5xl mb-4">🐧🔒</div>
            <h1 className="text-3xl font-black text-white">Painel Admin</h1>
            <p className="text-slate-400 text-sm mt-2">Acesso restrito à equipe Aniko.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <input
              type="text"
              placeholder="Usuário"
              value={loginUser}
              onChange={(e) => setLoginUser(e.target.value)}
              required
              className="w-full px-6 py-4 rounded-2xl bg-slate-700 text-white border-2 border-transparent focus:border-brand-accent outline-none font-medium placeholder:text-slate-500"
            />
            <input
              type="password"
              placeholder="Senha"
              value={loginPass}
              onChange={(e) => setLoginPass(e.target.value)}
              required
              className="w-full px-6 py-4 rounded-2xl bg-slate-700 text-white border-2 border-transparent focus:border-brand-accent outline-none font-medium placeholder:text-slate-500"
            />

            {loginError && (
              <p className="text-red-400 text-sm font-bold animate-pulse">{loginError}</p>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-4 bg-brand-accent text-white font-black rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all text-lg disabled:opacity-50"
            >
              {loginLoading ? "Verificando..." : "Entrar"}
            </button>
          </form>

          <Link href="/" className="block text-slate-500 text-sm hover:text-white transition-colors">
            ← Voltar para o site
          </Link>
        </div>
      </main>
    );
  }

  // ========== PAINEL ADMIN (Após Login) ==========
  return (
    <main className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black mb-2">Painel do Administrador 🐧⚙️</h1>
            <p className="text-slate-400">Gerencie as solicitações e envie os vídeos personalizados.</p>
          </div>
          <button 
            onClick={() => { sessionStorage.removeItem("aniko_admin"); setIsAuthenticated(false); }}
            className="px-6 py-2 bg-white/10 rounded-xl hover:bg-red-500/20 hover:text-red-400 transition-all"
          >
            Sair ❌
          </button>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Listagem de Pedidos */}
          <div className="xl:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>📥</span> Pedidos Recebidos
            </h2>
            
            {loading ? (
              <p className="text-slate-500">Carregando pedidos...</p>
            ) : requests.length > 0 ? (
              requests.map((req) => (
                <div key={req.id} className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl transition-all hover:border-brand-accent/50">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-brand-accent/20 text-brand-accent text-xs font-bold rounded-full uppercase">
                      {req.status}
                    </span>
                    <span className="text-slate-500 text-xs">
                      {new Date(req.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-lg font-medium mb-6">"{req.description}"</p>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => {
                          setSelectedProfileId(req.profile_id);
                          setSelectedProfile(req.profiles);
                          setVideoTitle(`Especial para você: ${req.description.slice(0, 20)}...`);
                      }}
                      className="text-sm font-bold text-brand-accent hover:underline"
                    >
                      Responder este pedido →
                    </button>
                    
                    {req.profiles?.phone && (
                      <a 
                        href={`https://wa.me/55${req.profiles.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá! 😊\n\nO vídeo personalizado que você solicitou já está disponível na plataforma do Aniko.\n\nEle foi criado com base nas preferências e objetivos que você informou, pensando no melhor desenvolvimento e experiência para a criança.\n\nQuando puder, acesse a plataforma para assistir. Qualquer dúvida ou feedback, fico à disposição!\n\nObrigado por confiar no Aniko 💙\n\nhttps://aniko-web.vercel.app`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-bold text-green-500 hover:text-green-400 flex items-center gap-1 transition-colors"
                      >
                        <span>📱 Notificar WhatsApp</span>
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-600">Nenhuma solicitação no momento.</p>
            )}
          </div>

          {/* Listagem de Todos os Clientes */}
          <div className="xl:col-span-1 space-y-6">
             <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span>👥</span> Lista de Clientes
             </h2>
             <input 
               type="text" 
               placeholder="Buscar cliente..."
               className="w-full px-5 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-sm outline-none focus:border-brand-accent"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
             <div className="space-y-3 h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredProfiles.map((prof) => (
                   <div 
                    key={prof.id} 
                    onClick={() => {
                        setSelectedProfileId(prof.id);
                        setSelectedProfile(prof);
                        setVideoTitle(`Um vídeo especial para o(a) ${prof.child_name}!`);
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${selectedProfileId === prof.id ? 'bg-brand-accent/20 border-brand-accent' : 'bg-slate-800 border-slate-700 hover:border-slate-500'}`}
                   >
                      <p className="font-bold text-sm leading-tight mb-1">{prof.child_name || "Sem nome"}</p>
                      <div className="space-y-1">
                        <p className="text-[11px] text-slate-300 flex items-center gap-1">
                          <span className="opacity-70">👤</span> {prof.parent_name || "Pai/Mãe"}
                        </p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1 italic break-all">
                          <span className="opacity-70">📧</span> {prof.email || "Sem e-mail"}
                        </p>
                        {prof.phone && (
                          <p className="text-[10px] text-brand-accent font-bold flex items-center gap-1">
                            <span className="opacity-70">📱</span> {prof.phone}
                          </p>
                        )}
                      </div>
                   </div>
                ))}
             </div>
          </div>

          {/* Formulário de Envio */}
          <div className="bg-white text-brand-primary p-8 rounded-[3rem] shadow-2xl h-fit sticky top-8">
             <h3 className="text-2xl font-black mb-6">Enviar Vídeo 🎬</h3>
             <form onSubmit={handleSendVideo} className="space-y-6">
                <div>
                   <label className="block text-sm font-bold mb-2">Destinatário Selecionado</label>
                   <div className="px-5 py-3 rounded-xl bg-slate-100 text-xs font-bold border-2 border-slate-100 flex justify-between items-center">
                      <span>{selectedProfile ? (selectedProfile.child_name || "Cliente") : "Ninguém selecionado"}</span>
                      {selectedProfileId && (
                        <button type="button" onClick={() => {setSelectedProfileId(""); setSelectedProfile(null);}} className="text-red-500">X</button>
                      )}
                   </div>
                </div>
                <div>
                   <label className="block text-sm font-bold mb-2">Título do Vídeo</label>
                   <input 
                     type="text" 
                     placeholder="Ex: Hora de escovar os dentes"
                     required
                     className="w-full px-5 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-brand-accent outline-none"
                     value={videoTitle}
                     onChange={(e) => setVideoTitle(e.target.value)}
                   />
                </div>
                <div>
                   <label className="block text-sm font-bold mb-2">Link do Vídeo (.mp4)</label>
                   <input 
                     type="url" 
                     placeholder="https://link-do-video.mp4"
                     required
                     className="w-full px-5 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-brand-accent outline-none font-mono text-sm"
                     value={videoUrl}
                     onChange={(e) => setVideoUrl(e.target.value)}
                   />
                </div>
                
                <div className="space-y-3 pt-2">
                  <button 
                    type="submit"
                    disabled={!selectedProfileId}
                    className="w-full py-4 bg-brand-primary text-white font-black rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                  >
                    Enviar para o Pai
                  </button>

                  {selectedProfile?.phone && (
                    <a 
                      href={`https://wa.me/55${selectedProfile.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá! 😊\n\nO vídeo personalizado que você solicitou já está disponível na plataforma do Aniko.\n\nEle foi criado com base nas preferências e objetivos que você informou, pensando no melhor desenvolvimento e experiência para a criança.\n\nQuando puder, acesse a plataforma para assistir. Qualquer dúvida ou feedback, fico à disposição!\n\nObrigado por confiar no Aniko 💙\n\nhttps://aniko-web.vercel.app`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 bg-green-500 text-white font-bold rounded-2xl shadow-lg hover:bg-green-600 transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      📱 Notificar via WhatsApp
                    </a>
                  )}
                </div>
             </form>
          </div>
        </div>
      </div>
    </main>
  );
}
