"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);
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
  const [isSending, setIsSending] = useState(false);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponDiscount, setNewCouponDiscount] = useState("");
  const [isCreatingCoupon, setIsCreatingCoupon] = useState(false);

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
      
      // Buscar pedidos via API (bypass RLS)
      try {
        const reqRes = await fetch('/api/admin/pedidos?key=aniko_admin_segredo_2026');
        const reqData = await reqRes.json();
        if (reqData.requests) setRequests(reqData.requests);
      } catch (e) {
        console.error('Erro ao buscar pedidos:', e);
      }

      // Carregar todos os perfis via API (绕过 RLS)
      try {
        const res = await fetch('/api/admin/clientes?key=aniko_admin_segredo_2026');
        const data = await res.json();
        if (data.profiles) setProfiles(data.profiles);
      } catch (e) {
        console.error('Erro ao buscar clientes:', e);
      }
      
      setLoading(false);
    }
    fetchData();
    refreshCoupons();
  }, [isAuthenticated, refreshCoupons]);

  const refreshCoupons = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/cupons?key=aniko_admin_segredo_2026');
      const data = await res.json();
      if (data.coupons) setCoupons(data.coupons);
    } catch (e) {
      console.error('Erro ao buscar cupons:', e);
    }
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode || !newCouponDiscount || isCreatingCoupon) return;
    setIsCreatingCoupon(true);

    try {
      const res = await fetch('/api/admin/cupons?key=aniko_admin_segredo_2026', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: newCouponCode,
          discount_fixed: newCouponDiscount
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNewCouponCode("");
        setNewCouponDiscount("");
        fetchCoupons();
      } else {
        alert("Erro ao criar cupom: " + data.error);
      }
    } catch (err: any) {
      alert("Erro ao criar cupom: " + err.message);
    } finally {
      setIsCreatingCoupon(false);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm("Excluir este cupom?")) return;
    try {
      const res = await fetch(`/api/admin/cupons?key=aniko_admin_segredo_2026&id=${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) fetchCoupons();
    } catch (err: any) {
      alert("Erro ao excluir cupom: " + err.message);
    }
  };

  // Enviar vídeo
  const handleSendVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl || !selectedProfileId || isSending) return;

    setIsSending(true);

    try {
      const res = await fetch('/api/admin/enviar-video?key=aniko_admin_segredo_2026', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile_id: selectedProfileId,
          title: videoTitle || "Sua nova animação!",
          video_url: videoUrl,
          category: "Personalizado"
        }),
      });
      
      const data = await res.json();

      if (data.success) {
        alert("Vídeo enviado com sucesso para os pais!");
        setVideoUrl("");
        setVideoTitle("");
      } else {
        alert("Erro ao enviar vídeo: " + (data.error || "Erro desconhecido na API"));
      }
    } catch (err: any) {
      alert("Erro ao enviar vídeo: " + err.message);
    } finally {
      setIsSending(false);
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
            <div className="relative">
              <input
                type={showLoginPass ? "text" : "password"}
                placeholder="Senha"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                required
                className="w-full px-6 py-4 rounded-2xl bg-slate-700 text-white border-2 border-transparent focus:border-brand-accent outline-none font-medium placeholder:text-slate-500 pr-14"
              />
              <button
                type="button"
                onClick={() => setShowLoginPass(!showLoginPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-white transition-colors"
              >
                {showLoginPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

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
                    <div className="flex flex-wrap gap-3">
                      <Link 
                        href={`/admin/cliente/${req.profile_id}`}
                        target="_blank"
                        className="text-sm font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                      >
                        📊 Ver Dashboard →
                      </Link>
                      <button 
                        onClick={() => {
                            setSelectedProfileId(req.profile_id);
                            setSelectedProfile(req.profiles || { 
                              child_name: req.profiles?.child_name || 'Cliente',
                              phone: req.profiles?.phone,
                              email: req.profiles?.email
                            });
                            setVideoTitle(`Especial para você: ${req.description?.slice(0, 20) || 'vídeo'}...`);
                        }}
                        className="text-sm font-bold text-brand-accent hover:underline"
                      >
                        Responder este pedido →
                      </button>
                    </div>
                    
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
                 {loading ? (
                   <p className="text-slate-500 text-sm">Carregando clientes...</p>
                 ) : filteredProfiles.length === 0 ? (
                   <p className="text-slate-500 text-sm">Nenhum cliente encontrado.</p>
                  ) : filteredProfiles.map((prof) => (
                    <div 
                     key={prof.id} 
                     onClick={() => {
                       setSelectedProfileId(prof.id);
                       setSelectedProfile(prof);
                       setVideoTitle(`Um vídeo especial para o(a) ${prof.child_name}!`);
                     }}
                     className={`p-4 rounded-2xl border cursor-pointer transition-all ${selectedProfileId === prof.id ? 'bg-brand-accent/20 border-brand-accent' : 'bg-slate-800 border-slate-700 hover:border-slate-500'}`}
                    >
                       <div className="flex justify-between items-start mb-2">
                         <p className="font-bold text-sm leading-tight">{prof.child_name || "Sem nome"}</p>
                         <div className="flex gap-1">
                           <Link 
                             href={`/admin/cliente/${prof.id}`}
                             target="_blank"
                             onClick={(e) => e.stopPropagation()}
                             className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-blue-500/10 px-2 py-1 rounded-lg"
                           >
                             <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
                           </Link>
                           <button 
                             onClick={(e) => {
                               e.stopPropagation();
                               setSelectedProfileId(prof.id);
                               setSelectedProfile(prof);
                               setVideoTitle(`Um vídeo especial para o(a) ${prof.child_name}!`);
                             }}
                             className="text-xs font-bold text-green-400 hover:text-green-300 flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded-lg"
                             title="Selecionar para enviar vídeo"
                           >
                             📤
                           </button>
                         </div>
                       </div>
                      <div className="space-y-1">
                        <p className="text-[11px] text-slate-300 flex items-center gap-1">
                          <span className="opacity-70">👤</span> {prof.parent_name || "Pais"}
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
                    disabled={!selectedProfileId || isSending}
                    className="w-full py-4 bg-brand-primary text-white font-black rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isSending ? "Enviando..." : "Enviar para os Pais"}
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

        {/* Gerenciamento de Cupons */}
        <div className="mt-16 bg-slate-800 rounded-[3rem] p-10 border border-slate-700 shadow-2xl">
          <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
            <span>🎟️</span> Gerenciar Cupons de Desconto
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form criar cupom */}
            <div className="bg-slate-700/50 p-8 rounded-[2rem] border border-slate-600 h-fit">
              <h3 className="text-xl font-bold mb-6">Criar Novo Cupom</h3>
              <form onSubmit={handleCreateCoupon} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Código do Cupom</label>
                  <input 
                    type="text" 
                    placeholder="Ex: ANIKO20"
                    className="w-full px-5 py-3 rounded-xl bg-slate-800 border border-slate-600 outline-none focus:border-brand-accent uppercase font-mono"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Desconto Fixo (R$)</label>
                  <input 
                    type="number" 
                    placeholder="Ex: 20"
                    className="w-full px-5 py-3 rounded-xl bg-slate-800 border border-slate-600 outline-none focus:border-brand-accent"
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(e.target.value)}
                    required
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isCreatingCoupon}
                  className="w-full py-4 bg-brand-accent text-white font-black rounded-xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 mt-2"
                >
                  {isCreatingCoupon ? "Criando..." : "Criar Cupom"}
                </button>
              </form>
            </div>

            {/* Lista de cupons */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coupons.length === 0 ? (
                  <p className="text-slate-500 italic">Nenhum cupom criado ainda.</p>
                ) : coupons.map((c) => (
                  <div key={c.id} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 flex justify-between items-center group hover:border-slate-500 transition-all">
                    <div>
                      <p className="font-mono font-black text-xl text-brand-accent">{c.code}</p>
                      <p className="text-sm text-slate-400 font-bold">Desconto: R$ {c.discount_fixed},00</p>
                      <p className="text-[10px] text-slate-600 mt-1 uppercase tracking-widest">{new Date(c.created_at).toLocaleDateString()}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteCoupon(c.id)}
                      className="p-3 bg-red-500/10 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
