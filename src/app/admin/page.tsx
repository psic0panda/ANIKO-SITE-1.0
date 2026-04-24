"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, FileText, Send, MessageCircle, BarChart3 } from "lucide-react";

const SCRIPT_TEMPLATES = [
  { id: 'bluey_higiene', label: 'Bluey: Escovar os Dentes', title: 'Bluey ensina: A hora de escovar os dentes!', tags: 'Higiene, Bluey', category: 'Bluey' },
  { id: 'bluey_organizacao', label: 'Bluey: Guardar Brinquedos', title: 'Bluey e Bingo: Guardando os brinquedos!', tags: 'Educação, Bluey', category: 'Bluey' },
  { id: 'daniel_sentimentos', label: 'Daniel Tigre: Lidando com Emoções', title: 'Daniel Tigre: O que fazer quando está bravo?', tags: 'Social, Daniel Tigre', category: 'Daniel Tigre' },
  { id: 'daniel_alimentacao', label: 'Daniel Tigre: Provar Novos Alimentos', title: 'Daniel Tigre: Provar algo novo pode ser legal!', tags: 'Alimentação, Daniel Tigre', category: 'Daniel Tigre' },
  { id: 'luna_curiosidade', label: 'Luna: Por que lavar as mãos?', title: 'O Show da Luna: Por que as mãos ficam sujas?', tags: 'Higiene, Luna', category: 'Luna' },
];

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
  const [videoTags, setVideoTags] = useState("");
  const [videoCategory, setVideoCategory] = useState("Personalizado");
  const [selectedProfileId, setSelectedProfileId] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponDiscount, setNewCouponDiscount] = useState("");
  const [isCreatingCoupon, setIsCreatingCoupon] = useState(false);
  const [isSingleUse, setIsSingleUse] = useState(false);

  const [viewMode, setViewMode] = useState<'pendentes' | 'historico'>('pendentes');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadDebug, setUploadDebug] = useState("");

  const CLOUDINARY_CLOUD_NAME = "dorusgnpe";
  const CLOUDINARY_UPLOAD_PRESET = "aniko_videos";

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
  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const reqRes = await fetch('/api/admin/pedidos?key=aniko_admin_segredo_2026');
      const reqData = await reqRes.json();
      if (reqData.requests) setRequests(reqData.requests);

      const res = await fetch('/api/admin/clientes?key=aniko_admin_segredo_2026');
      const data = await res.json();
      if (data.profiles) setProfiles(data.profiles);
    } catch (e) {
      console.error('Erro ao buscar dados:', e);
    }
    setLoading(false);
  }, []);

  const refreshCoupons = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/cupons?key=aniko_admin_segredo_2026');
      const data = await res.json();
      if (data.coupons) setCoupons(data.coupons);
    } catch (e) {
      console.error('Erro ao buscar cupons:', e);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    refreshData();
    refreshCoupons();
  }, [isAuthenticated, refreshData, refreshCoupons]);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode || !newCouponDiscount || isCreatingCoupon) return;
    setIsCreatingCoupon(true);

    let codeToCreate = newCouponCode.toUpperCase();
    if (isSingleUse && !codeToCreate.startsWith('UNICO_')) {
      codeToCreate = `UNICO_${codeToCreate}`;
    }

    try {
      const res = await fetch('/api/admin/cupons?key=aniko_admin_segredo_2026', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: codeToCreate,
          discount_fixed: newCouponDiscount
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNewCouponCode("");
        setNewCouponDiscount("");
        setIsSingleUse(false);
        refreshCoupons();
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
      if (data.success) refreshCoupons();
    } catch (err: any) {
      alert("Erro ao excluir cupom: " + err.message);
    }
  };

  // Upload via assinatura do servidor → direto para Cloudinary (sem CORS, sem 413)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setVideoUrl("");
    setUploadDebug(`Preparando upload: ${file.name} (${(file.size / 1024 / 1024).toFixed(1)} MB)`);

    try {
      // Passo 1: Pegar assinatura do nosso servidor
      setUploadDebug('Obtendo autorização do servidor...');
      const sigRes = await fetch('/api/admin/cloudinary-signature?key=aniko_admin_segredo_2026');
      const sigData = await sigRes.json();

      if (!sigRes.ok || !sigData.signature) {
        setUploadDebug(`❌ Erro ao obter assinatura: ${sigData.error || 'Erro desconhecido'}`);
        setIsUploading(false);
        return;
      }

      // Passo 2: Upload direto para Cloudinary com XHR Fragmentado (Chunked Upload)
      setUploadDebug('Iniciando upload fragmentado (mais estável)...');

      const CHUNK_SIZE = 6 * 1024 * 1024; // 6MB por pedaço
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
      const uniqueUploadId = 'aniko_' + Math.random().toString(36).substring(2, 15);
      let currentByte = 0;

      for (let i = 0; i < totalChunks; i++) {
        const start = currentByte;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);
        const contentRange = `bytes ${start}-${end - 1}/${file.size}`;

        setUploadDebug(`Enviando parte ${i + 1} de ${totalChunks}...`);

        const formData = new FormData();
        formData.append('file', chunk);
        formData.append('api_key', sigData.api_key);
        formData.append('timestamp', String(sigData.timestamp));
        formData.append('signature', sigData.signature);
        formData.append('folder', sigData.folder);

        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          // Usamos auto/upload para maior compatibilidade e suporte a arquivos grandes
          xhr.open('POST', `https://api.cloudinary.com/v1_1/${sigData.cloud_name}/auto/upload`);
          
          // Headers cruciais para upload fragmentado
          xhr.setRequestHeader('X-Unique-Upload-Id', uniqueUploadId);
          xhr.setRequestHeader('Content-Range', contentRange);

          xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
              const chunkPct = event.loaded / event.total;
              const totalPct = Math.round(((start + (chunkPct * (end - start))) / file.size) * 100);
              setUploadProgress(totalPct);
              setUploadDebug(`Enviando... ${totalPct}% (Parte ${i + 1}/${totalChunks})`);
            }
          });

          xhr.addEventListener('load', () => {
            try {
              const data = JSON.parse(xhr.responseText);
              if (xhr.status === 200 || xhr.status === 201) {
                // Se for o último pedaço, salvamos a URL final
                if (i === totalChunks - 1 && data.secure_url) {
                  setVideoUrl(data.secure_url);
                  setUploadProgress(100);
                  setUploadDebug(`✅ Upload completo! Vídeo processado.`);
                }
                resolve();
              } else {
                setUploadDebug(`❌ Erro na parte ${i + 1} (${xhr.status}): ${data.error?.message || 'Erro no Cloudinary'}`);
                reject(new Error(data.error?.message || 'Erro no Cloudinary'));
              }
            } catch {
              setUploadDebug(`❌ Resposta inválida do Cloudinary na parte ${i + 1}.`);
              reject(new Error('Invalid response'));
            }
          });

          xhr.addEventListener('error', () => {
            setUploadDebug(`❌ Erro de rede na parte ${i + 1}. Tentando novamente...`);
            reject(new Error('Network error'));
          });

          xhr.send(formData);
        });

        currentByte = end;
      }


    } catch (err: any) {
      setUploadDebug(`❌ Erro: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Enviar vídeo
  const handleSendVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoUrl) {
      alert("⚠️ Erro: O link do vídeo está vazio. Aguarde o upload terminar ou cole um link manual.");
      return;
    }
    if (!selectedProfileId) {
      alert("⚠️ Erro: Nenhum cliente selecionado. Clique em 'Criar Vídeo' na lista de pedidos ou selecione um cliente na lista à direita.");
      return;
    }
    if (isSending) return;

    setIsSending(true);

    try {
      const requestId = (window as any).currentRequestId;
      const isAlteration = (window as any).currentIsAlteration;

      const res = await fetch('/api/admin/enviar-video?key=aniko_admin_segredo_2026', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile_id: selectedProfileId,
          title: videoTitle || "Sua nova animação!",
          video_url: videoUrl,
          category: videoCategory || "Personalizado",
          tags: videoTags,
          request_id: requestId,
          is_alteration: isAlteration
        }),
      });
      
      const data = await res.json();

      if (data.success) {
        alert("🎉 Sucesso! Vídeo enviado e disponível para os pais.");
        setVideoUrl("");
        setVideoTitle("");
        setVideoTags("");
        setVideoCategory("Personalizado");
        // Limpar os IDs de solicitação
        (window as any).currentRequestId = null;
        (window as any).currentIsAlteration = null;
        // Atualizar lista de pedidos
        refreshData();
      } else {
        console.error("Erro API Enviar:", data);
        alert(`❌ Erro no envio: ${data.error || "Erro desconhecido no servidor"}`);
      }
    } catch (err: any) {
      console.error("Erro Enviar Catch:", err);
      alert("❌ Erro de conexão ao tentar enviar o vídeo. Tente novamente.");
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
          <div className="flex gap-4">
            <Link 
              href="/admin/metrics"
              className="flex items-center gap-2 px-6 py-2 bg-white/10 rounded-xl hover:bg-brand-accent transition-all text-sm font-bold"
            >
              <BarChart3 className="h-4 w-4" />
              Métricas
            </Link>
            <button 
              onClick={() => { sessionStorage.removeItem("aniko_admin"); setIsAuthenticated(false); }}
              className="px-6 py-2 bg-white/10 rounded-xl hover:bg-red-500/20 hover:text-red-400 transition-all text-sm font-bold"
            >
              Sair ❌
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Listagem de Pedidos */}
          <div className="xl:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span>📥</span> Pedidos
              </h2>
              <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
                <button 
                  onClick={() => setViewMode('pendentes')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'pendentes' ? 'bg-brand-accent text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                  Pendentes
                </button>
                <button 
                  onClick={() => setViewMode('historico')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'historico' ? 'bg-brand-accent text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                  Histórico
                </button>
              </div>
            </div>
            
            {loading ? (
              <p className="text-slate-500">Carregando pedidos...</p>
            ) : (() => {
              const filteredRequests = requests.filter(r => 
                viewMode === 'pendentes' ? (r.status === 'pendente' || r.status === 'alteracao_solicitada') : r.status === 'concluido'
              );

              if (filteredRequests.length === 0) {
                return <p className="text-slate-600 italic py-10 text-center bg-slate-800/50 rounded-3xl border border-dashed border-slate-700">Nenhuma solicitação {viewMode === 'pendentes' ? 'pendente' : 'no histórico'}.</p>;
              }

              return filteredRequests.map((req) => (
                <div key={req.id} className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl transition-all hover:border-brand-accent/50 group">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase ${
                      req.is_alteration 
                        ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' 
                        : req.status === 'concluido' ? 'bg-green-500/20 text-green-500 border border-green-500/30' : 'bg-brand-accent/20 text-brand-accent'
                    }`}>
                      {req.is_alteration ? '⚠️ Alteração' : req.status === 'concluido' ? '✅ Concluído' : '📥 Novo Pedido'}
                    </span>
                    <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest text-right">
                      {req.is_alteration && <p className="text-amber-500/70 font-black mb-1 italic">Vídeo original: {req.original_title}</p>}
                      {new Date(req.created_at).toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-lg font-medium mb-6 text-slate-200">"{req.description}"</p>
                  
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-700/50">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden border-2 border-slate-600">
                        {req.profiles?.avatar_url ? (
                          <img src={`/assets/avatars/avatar_${req.profiles.avatar_url}.png`} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-lg">🧒</span>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-black text-white">{req.profiles?.child_name || 'Criança'}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">{req.profiles?.parent_name || 'Responsável'}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link 
                        href={`/admin/cliente/${req.profile_id}`}
                        target="_blank"
                        className="px-4 py-2 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-xl hover:bg-blue-500/20 transition-all flex items-center gap-2"
                      >
                        📊 Timeline
                      </Link>
                      
                      {viewMode === 'pendentes' && (
                        <button 
                          onClick={() => {
                              setSelectedProfileId(req.profile_id);
                              setSelectedProfile(req.profiles || { 
                                child_name: req.profiles?.child_name || 'Cliente',
                                phone: req.profiles?.phone,
                                email: req.profiles?.email
                              });
                              
                              const defaultTitle = req.is_alteration 
                                ? `Ajuste: ${req.original_title || 'Pedido'}`
                                : `Especial para você: ${req.description?.slice(0, 20) || 'vídeo'}...`;
                              
                              const text = req.description?.toLowerCase() || '';
                              const autoTags = [];
                              if (text.includes('banho') || text.includes('escovar') || text.includes('dente') || text.includes('higiene') || text.includes('mão') || text.includes('limpeza')) autoTags.push('Higiene');
                              if (text.includes('escola') || text.includes('educação') || text.includes('aprender') || text.includes('aula') || text.includes('estudar') || text.includes('número') || text.includes('letra')) autoTags.push('Educação');
                              if (text.includes('comer') || text.includes('alimento') || text.includes('fruta') || text.includes('comida') || text.includes('legume') || text.includes('alimentação') || text.includes('jantar') || text.includes('almoço')) autoTags.push('Alimentação');
                              if (text.includes('brincar') || text.includes('amigo') || text.includes('social') || text.includes('compartilhar') || text.includes('sentimento') || text.includes('conversar') || text.includes('pessoas')) autoTags.push('Social');
                              if (text.includes('pai') || text.includes('mãe') || text.includes('família') || text.includes('irmão') || text.includes('casa') || text.includes('avô') || text.includes('avó')) autoTags.push('Família');

                              setVideoTitle(defaultTitle);
                              setVideoTags(req.tags || autoTags.join(', '));
                              setVideoCategory("Personalizado");
                              // Guardar o ID da solicitação para marcar como concluído depois
                              (window as any).currentRequestId = req.id;
                              (window as any).currentIsAlteration = req.is_alteration;
                              
                              // Scroll suave para o formulário
                              document.getElementById('form-enviar')?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="px-6 py-2 bg-brand-accent text-white text-xs font-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg"
                        >
                          {req.is_alteration ? 'Responder Ajuste →' : 'Criar Vídeo →'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            })()}
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
                       setVideoCategory("Personalizado");
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
                               setVideoCategory("Personalizado");
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
          <div id="form-enviar" className="bg-white text-brand-primary p-8 rounded-[3rem] shadow-2xl h-fit sticky top-8">
             <h3 className="text-2xl font-black mb-6">Enviar Vídeo 🎬</h3>
             <form onSubmit={handleSendVideo} className="space-y-6">
                <div>
                   <label className="block text-sm font-bold mb-2">Destinatário Selecionado</label>
                   <div className="px-5 py-3 rounded-xl bg-slate-100 text-xs font-bold border-2 border-slate-100 flex justify-between items-center">
                      <span>{selectedProfile ? (selectedProfile.child_name || "Cliente") : "Ninguém selecionado"}</span>
                      {selectedProfileId && (
                        <button type="button" onClick={() => {setSelectedProfileId(""); setSelectedProfile(null);}} className="text-red-500 font-black">X</button>
                      )}
                   </div>
                </div>
                <div>
                   <label className="block text-sm font-bold mb-2">Template de Roteiro (Opcional)</label>
                   <select 
                     onChange={(e) => {
                       const template = SCRIPT_TEMPLATES.find(t => t.id === e.target.value);
                       if (template) {
                         setVideoTitle(template.title);
                         setVideoTags(template.tags);
                         setVideoCategory(template.category);
                       }
                     }}
                     className="w-full px-5 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-brand-accent outline-none text-sm font-bold"
                   >
                     <option value="">Selecione um roteiro rápido...</option>
                     {SCRIPT_TEMPLATES.map(t => (
                       <option key={t.id} value={t.id}>{t.label}</option>
                     ))}
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-bold mb-2">Título do Vídeo</label>
                   <input 
                     type="text" 
                     placeholder="Ex: Hora de escovar os dentes"
                     required
                     className="w-full px-5 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-brand-accent outline-none font-bold"
                     value={videoTitle}
                     onChange={(e) => setVideoTitle(e.target.value)}
                   />
                </div>
                
                <div>
                   <label className="block text-sm font-bold mb-2">Categoria (Ex: Bluey, Daniel Tigre, Personalizado)</label>
                   <input 
                     type="text" 
                     placeholder="Ex: Personalizado"
                     required
                     className="w-full px-5 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-brand-accent outline-none text-sm font-bold"
                     value={videoCategory}
                     onChange={(e) => setVideoCategory(e.target.value)}
                   />
                </div>

                <div className="p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <label className="block text-sm font-black text-brand-primary mb-3 flex items-center gap-2">
                      <span>📹</span> Upload do Vídeo
                    </label>
                    
                    {!videoUrl ? (
                      <div className="space-y-4">
                        <input 
                          type="file" 
                          accept="video/*"
                          onChange={handleFileUpload}
                          disabled={isUploading}
                          className="hidden"
                          id="video-upload"
                        />
                        <label 
                          htmlFor="video-upload"
                          className={`w-full py-6 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${isUploading ? 'bg-slate-100 border-slate-300' : 'bg-white border-brand-accent/30 hover:border-brand-accent hover:bg-brand-accent/5'}`}
                        >
                          {isUploading ? (
                            <div className="text-center space-y-3">
                              <div className="w-48 h-2 bg-slate-200 rounded-full overflow-hidden mx-auto">
                                <div 
                                  className="h-full bg-brand-accent transition-all duration-300" 
                                  style={{ width: `${uploadProgress}%` }}
                                />
                              </div>
                              <p className="text-[10px] font-black text-brand-accent uppercase tracking-widest">{uploadProgress}% Carregado</p>
                            </div>
                          ) : (
                            <>
                              <span className="text-3xl mb-2">☁️</span>
                              <p className="text-xs font-black text-brand-primary uppercase">Clique para selecionar o vídeo</p>
                              <p className="text-[10px] text-slate-400 mt-1 font-bold">MP4 recomendado (Cloudinary)</p>
                            </>
                          )}
                        </label>
                      </div>
                    ) : (
                      <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">✅</span>
                          <div>
                            <p className="text-[10px] font-black text-green-600 uppercase">Vídeo Pronto</p>
                            <p className="text-[10px] text-green-500 font-mono truncate max-w-[180px]">{videoUrl}</p>
                          </div>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => setVideoUrl("")}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        </button>
                      </div>
                    )}
                    
                    <details className="mt-4">
                      <summary className="text-[10px] font-black text-slate-400 cursor-pointer uppercase tracking-widest hover:text-brand-primary transition-all">Ou colar link manual</summary>
                      <div className="mt-3">
                         <input 
                           type="url" 
                           placeholder="https://link-do-video.mp4"
                           className="w-full px-4 py-2 rounded-lg bg-white border border-slate-200 text-xs font-mono outline-none focus:border-brand-accent"
                           value={videoUrl}
                           onChange={(e) => setVideoUrl(e.target.value)}
                         />
                      </div>
                    </details>
                    
                    {/* Debug bar — sempre visível */}
                    {uploadDebug && (
                      <div className={`mt-3 p-3 rounded-lg text-[10px] font-mono break-all border ${uploadDebug.startsWith('✅') ? 'bg-green-50 border-green-200 text-green-700' : uploadDebug.startsWith('❌') ? 'bg-red-50 border-red-200 text-red-700' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                        {uploadDebug}
                      </div>
                    )}
                </div>
                 
                <div>
                    <label className="block text-sm font-bold mb-2">Tags Comportamentais (Automáticas)</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Educação, Social"
                      className="w-full px-5 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-brand-accent outline-none text-sm"
                      value={videoTags}
                      onChange={(e) => setVideoTags(e.target.value)}
                    />
                    <p className="text-[10px] text-slate-400 mt-1 italic">Inferidas automaticamente da solicitação. Você pode editar.</p>
                </div>
                  
                <div className="space-y-3 pt-2">
                  <button 
                    type="submit"
                    disabled={!selectedProfileId || isSending || isUploading || !videoUrl}
                    className={`w-full py-4 text-white font-black rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all ${(!selectedProfileId || isSending || isUploading || !videoUrl) ? 'bg-slate-300 cursor-not-allowed' : 'bg-brand-primary'}`}
                  >
                    {isSending ? "Enviando..." : "Enviar para os Pais"}
                  </button>
                  
                  {/* Feedback de validação para o admin */}
                  <div className="flex flex-col gap-1">
                    {!selectedProfileId && <p className="text-[10px] text-red-500 font-bold text-center">⚠️ Selecione um cliente na lista</p>}
                    {isUploading && <p className="text-[10px] text-amber-500 font-bold text-center">⏳ Aguarde o upload terminar</p>}
                    {(!videoUrl && !isUploading) && <p className="text-[10px] text-red-500 font-bold text-center">⚠️ Faça o upload do vídeo primeiro</p>}
                  </div>

                  {selectedProfile?.phone && (
                    <a 
                      href={`https://wa.me/55${selectedProfile.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá, ${selectedProfile.parent_name || 'família'}! 😊 
Passando para avisar que o vídeo novo do(a) ${selectedProfile.child_name || 'pequeno(a)'} já está prontinho! 🐧💙

Ficou lindo e foi feito pensando em cada detalhe que você nos contou. Esse é um passo importante na jornada do(a) ${selectedProfile.child_name || 'pequeno(a)'}!

Quando puderem, assistam juntos no portal da Aniko. Qualquer dúvida ou feedback, é só me chamar neste WhatsApp: (81) 98842-0706! 🐧💙

Acesse aqui: https://aniko.com.br`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 bg-green-500 text-white font-bold rounded-2xl shadow-lg hover:bg-green-600 transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <MessageCircle className="h-4 w-4" /> Notificar via WhatsApp
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
                <label className="flex items-center gap-3 cursor-pointer py-1 px-2 hover:bg-slate-800/50 rounded-xl transition-colors border border-transparent hover:border-slate-600/50">
                  <input 
                    type="checkbox" 
                    checked={isSingleUse}
                    onChange={(e) => setIsSingleUse(e.target.checked)}
                    className="w-5 h-5 accent-brand-accent rounded cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-200">Uso Único Global</span>
                    <span className="text-[10px] text-slate-400">Apenas 1 pessoa poderá usar</span>
                  </div>
                </label>
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
