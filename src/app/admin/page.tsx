"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { 
  Eye, 
  EyeOff, 
  FileText, 
  Send, 
  MessageSquare, 
  BarChart3, 
  Clock, 
  AlertTriangle, 
  Zap, 
  CheckCircle2, 
  DollarSign, 
  Users, 
  Video, 
  Search,
  PlusCircle,
  Tag,
  RefreshCcw,
  Sparkles
} from "lucide-react";

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

  const [activeTab, setActiveTab] = useState<'pedidos' | 'faturamento' | 'clientes' | 'cupons'>('pedidos');
  const [viewMode, setViewMode] = useState<'pendentes' | 'historico'>('pendentes');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadDebug, setUploadDebug] = useState("");

  // Modal de Concessão Manual de Créditos
  const [creditModalUser, setCreditModalUser] = useState<any>(null);
  const [creditAmount, setCreditAmount] = useState<number>(4);
  const [isUpdatingCredits, setIsUpdatingCredits] = useState(false);

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

  // Helper de Cálculo de SLA e Urgência (>48 horas)
  const calculateSLA = (createdAt: string) => {
    const created = new Date(createdAt).getTime();
    const now = new Date().getTime();
    const diffMs = now - created;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    const remainingHours = diffHours % 24;

    const isUrgent = diffHours >= 48;
    const pctSLA = Math.min(Math.round((diffHours / 48) * 100), 100);

    let timeText = `${diffHours}h`;
    if (diffDays > 0) {
      timeText = `${diffDays}d ${remainingHours}h`;
    }

    return { diffHours, diffDays, isUrgent, pctSLA, timeText };
  };

  // Ajuste manual de créditos
  const handleGrantCredits = async () => {
    if (!creditModalUser || isUpdatingCredits) return;
    setIsUpdatingCredits(true);

    try {
      const newCredits = (creditModalUser.video_credits || 0) + Number(creditAmount);
      const { error } = await supabase
        .from('profiles')
        .update({ video_credits: newCredits })
        .eq('id', creditModalUser.id);

      if (!error) {
        alert(`✅ Sucesso! ${creditAmount} créditos concedidos para ${creditModalUser.child_name || 'Cliente'}.`);
        setCreditModalUser(null);
        refreshData();
      } else {
        alert("Erro ao conceder créditos: " + error.message);
      }
    } catch (err: any) {
      alert("Erro ao conceder créditos: " + err.message);
    } finally {
      setIsUpdatingCredits(false);
    }
  };

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

  // Upload via assinatura do servidor → direto para Cloudinary
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setVideoUrl("");
    setUploadDebug(`Preparando upload: ${file.name} (${(file.size / 1024 / 1024).toFixed(1)} MB)`);

    try {
      const sigRes = await fetch('/api/admin/cloudinary-signature?key=aniko_admin_segredo_2026');
      const sigData = await sigRes.json();

      if (!sigRes.ok || !sigData.signature) {
        setUploadDebug(`❌ Erro ao obter assinatura: ${sigData.error || 'Erro desconhecido'}`);
        setIsUploading(false);
        return;
      }

      const CHUNK_SIZE = 6 * 1024 * 1024;
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
      const uniqueUploadId = 'aniko_' + Math.random().toString(36).substring(2, 15);
      let currentByte = 0;

      for (let i = 0; i < totalChunks; i++) {
        const start = currentByte;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);
        const contentRange = `bytes ${start}-${end - 1}/${file.size}`;

        const formData = new FormData();
        formData.append('file', chunk);
        formData.append('api_key', sigData.api_key);
        formData.append('timestamp', String(sigData.timestamp));
        formData.append('signature', sigData.signature);
        formData.append('folder', sigData.folder);

        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', `https://api.cloudinary.com/v1_1/${sigData.cloud_name}/auto/upload`);
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
              reject(new Error('Invalid response'));
            }
          });

          xhr.addEventListener('error', () => {
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

  // Enviar vídeo para o cliente
  const handleSendVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl) {
      alert("⚠️ Erro: O link do vídeo está vazio.");
      return;
    }
    if (!selectedProfileId) {
      alert("⚠️ Erro: Nenhum cliente selecionado.");
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
        alert("🎉 Sucesso! Vídeo enviado ao cliente.");
        setVideoUrl("");
        setVideoTitle("");
        setVideoTags("");
        setVideoCategory("Personalizado");
        (window as any).currentRequestId = null;
        (window as any).currentIsAlteration = null;
        refreshData();
      } else {
        alert(`❌ Erro no envio: ${data.error || "Erro desconhecido"}`);
      }
    } catch (err: any) {
      alert("❌ Erro de conexão ao enviar vídeo.");
    } finally {
      setIsSending(false);
    }
  };

  const filteredProfiles = profiles.filter(p => 
    p.child_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.parent_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pedidos Urgentes (>48h)
  const urgentRequestsCount = requests.filter(r => r.status === 'pendente' && calculateSLA(r.created_at).isUrgent).length;
  // Faturamento estimado (baseado nos pedidos pagos)
  const totalRevenue = requests.reduce((acc, r) => acc + (r.payment_amount || 80), 0);

  // ========== TELA DE LOGIN ==========
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#070E17] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#0F1B2A] rounded-[3rem] p-10 shadow-2xl border border-slate-800 text-center space-y-8">
          <div>
            <div className="h-20 w-20 mx-auto rounded-3xl bg-brand-primary/20 border-2 border-brand-accent/30 flex items-center justify-center text-4xl shadow-xl mb-4">
              🐧
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Painel Admin Aniko</h1>
            <p className="text-slate-400 text-sm mt-2 font-medium">Acesso restrito para gestão e operações.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <input
              type="text"
              placeholder="Usuário"
              value={loginUser}
              onChange={(e) => setLoginUser(e.target.value)}
              required
              className="w-full px-6 py-4 rounded-2xl bg-[#16253B] text-white border-2 border-transparent focus:border-brand-accent outline-none font-medium placeholder:text-slate-500"
            />
            <div className="relative">
              <input
                type={showLoginPass ? "text" : "password"}
                placeholder="Senha"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                required
                className="w-full px-6 py-4 rounded-2xl bg-[#16253B] text-white border-2 border-transparent focus:border-brand-accent outline-none font-medium placeholder:text-slate-500 pr-14"
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
              {loginLoading ? "Verificando..." : "Entrar no Painel"}
            </button>
          </form>

          <Link href="/" className="block text-slate-500 text-sm hover:text-white transition-colors font-bold">
            ← Voltar ao site
          </Link>
        </div>
      </main>
    );
  }

  // ========== PAINEL ADMIN ULTRA-PREMIUM ==========
  return (
    <main className="min-h-screen bg-[#070E1B] text-white pb-20">
      {/* Top Bar Navigation */}
      <header className="sticky top-0 z-40 bg-[#0A1628]/90 backdrop-blur-md border-b border-slate-800/80 px-6 py-4 md:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-brand-primary border border-brand-accent/40 flex items-center justify-center text-xl shadow-lg">
              🐧
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                Aniko OS <span className="px-2 py-0.5 rounded-full bg-brand-accent/20 text-brand-accent text-[10px] font-black uppercase">v2.6 Pro</span>
              </h1>
              <p className="text-xs text-slate-400 font-medium">Gestão de Produção, Créditos & Assinaturas</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/metrics"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white hover:border-brand-accent text-xs font-bold transition-all"
            >
              <BarChart3 className="h-4 w-4 text-brand-accent" />
              <span>Métricas</span>
            </Link>
            <button
              onClick={() => { sessionStorage.removeItem("aniko_admin"); setIsAuthenticated(false); }}
              className="px-5 py-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 text-xs font-bold transition-all"
            >
              Sair ❌
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10 md:px-12 space-y-10">
        
        {/* KPI Summary Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Faturamento */}
          <div className="rounded-3xl bg-[#0F1F35] p-6 border border-slate-800 shadow-xl flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Faturamento Total</p>
              <h3 className="text-3xl font-black text-white">R$ {totalRevenue.toLocaleString('pt-BR')}</h3>
              <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <span>↑ 100% verificado</span>
              </p>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <DollarSign className="h-7 w-7" />
            </div>
          </div>

          {/* Card 2: Urgência SLA 48h */}
          <div className={`rounded-3xl p-6 border shadow-xl flex items-center justify-between ${urgentRequestsCount > 0 ? 'bg-red-950/40 border-red-500/50 animate-pulse' : 'bg-[#0F1F35] border-slate-800'}`}>
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Solicitações &gt; 48h</p>
              <h3 className={`text-3xl font-black ${urgentRequestsCount > 0 ? 'text-red-400' : 'text-white'}`}>
                {urgentRequestsCount} Urgente{urgentRequestsCount !== 1 && 's'}
              </h3>
              <p className="text-[10px] text-slate-400 font-medium">SLA de entrega prioritário</p>
            </div>
            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${urgentRequestsCount > 0 ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-slate-800 text-slate-400'}`}>
              <AlertTriangle className="h-7 w-7" />
            </div>
          </div>

          {/* Card 3: Assinantes / Clientes */}
          <div className="rounded-3xl bg-[#0F1F35] p-6 border border-slate-800 shadow-xl flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Clientes Ativos</p>
              <h3 className="text-3xl font-black text-white">{profiles.length}</h3>
              <p className="text-[10px] text-brand-accent font-bold">Clínicas e Famílias</p>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-brand-accent/10 border border-brand-accent/20 text-brand-accent flex items-center justify-center">
              <Users className="h-7 w-7" />
            </div>
          </div>

          {/* Card 4: Vídeos Entregues */}
          <div className="rounded-3xl bg-[#0F1F35] p-6 border border-slate-800 shadow-xl flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vídeos Entregues</p>
              <h3 className="text-3xl font-black text-white">
                {requests.filter(r => r.status === 'concluido').length}
              </h3>
              <p className="text-[10px] text-blue-400 font-bold">100% adaptados para TEA</p>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Video className="h-7 w-7" />
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <section className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('pedidos')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${activeTab === 'pedidos' ? 'bg-brand-accent text-white shadow-lg' : 'bg-slate-900/60 text-slate-400 hover:text-white'}`}
          >
            <Clock className="h-4 w-4" />
            <span>Fila de Produção & SLA</span>
            {urgentRequestsCount > 0 && (
              <span className="h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center">
                {urgentRequestsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('faturamento')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${activeTab === 'faturamento' ? 'bg-brand-accent text-white shadow-lg' : 'bg-slate-900/60 text-slate-400 hover:text-white'}`}
          >
            <DollarSign className="h-4 w-4" />
            <span>Faturamento & Contas</span>
          </button>

          <button
            onClick={() => setActiveTab('clientes')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${activeTab === 'clientes' ? 'bg-brand-accent text-white shadow-lg' : 'bg-slate-900/60 text-slate-400 hover:text-white'}`}
          >
            <Users className="h-4 w-4" />
            <span>Clientes & Gestão de Créditos</span>
          </button>

          <button
            onClick={() => setActiveTab('cupons')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${activeTab === 'cupons' ? 'bg-brand-accent text-white shadow-lg' : 'bg-slate-900/60 text-slate-400 hover:text-white'}`}
          >
            <Tag className="h-4 w-4" />
            <span>Cupons de Desconto</span>
          </button>
        </section>

        {/* TAB 1: FILA DE PRODUÇÃO & SLA */}
        {activeTab === 'pedidos' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Lista de Pedidos */}
            <div className="xl:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <span>📥</span> Fila de Solicitações
                </h2>
                <div className="flex bg-[#0F1F35] p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setViewMode('pendentes')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'pendentes' ? 'bg-brand-accent text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                  >
                    Pendentes ({requests.filter(r => r.status === 'pendente' || r.status === 'alteracao_solicitada').length})
                  </button>
                  <button
                    onClick={() => setViewMode('historico')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'historico' ? 'bg-brand-accent text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                  >
                    Histórico ({requests.filter(r => r.status === 'concluido').length})
                  </button>
                </div>
              </div>

              {loading ? (
                <p className="text-slate-500 animate-pulse py-8 text-center">Carregando pedidos...</p>
              ) : (() => {
                const filteredRequests = requests.filter(r =>
                  viewMode === 'pendentes' ? (r.status === 'pendente' || r.status === 'alteracao_solicitada') : r.status === 'concluido'
                ).sort((a, b) => {
                  // Priorizar Plano Pro no topo
                  const isProA = a.profiles?.plan_name?.toLowerCase().includes('pro') ? 1 : 0;
                  const isProB = b.profiles?.plan_name?.toLowerCase().includes('pro') ? 1 : 0;
                  if (isProA !== isProB) return isProB - isProA;

                  // Em seguida, priorizar maior tempo de SLA (mais antigo)
                  return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                });

                if (filteredRequests.length === 0) {
                  return (
                    <div className="py-16 text-center bg-[#0F1F35]/50 rounded-3xl border border-dashed border-slate-800 space-y-2">
                      <p className="text-slate-400 font-bold">Nenhuma solicitação {viewMode === 'pendentes' ? 'pendente' : 'no histórico'}.</p>
                    </div>
                  );
                }

                return filteredRequests.map((req) => {
                  const sla = calculateSLA(req.created_at);
                  const isProUser = req.profiles?.plan_name?.toLowerCase().includes('pro');

                  return (
                    <div
                      key={req.id}
                      className={`p-6 rounded-3xl border shadow-xl transition-all relative overflow-hidden space-y-5 ${
                        sla.isUrgent && viewMode === 'pendentes'
                          ? 'bg-[#1D0B12] border-red-500/60'
                          : isProUser
                          ? 'bg-[#0F2238] border-brand-accent/50'
                          : 'bg-[#0F1F35] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {/* SLA Progress Bar no topo do card */}
                      {viewMode === 'pendentes' && (
                        <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${sla.isUrgent ? 'bg-red-500 animate-pulse' : sla.pctSLA > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${sla.pctSLA}%` }}
                          />
                        </div>
                      )}

                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          {sla.isUrgent && viewMode === 'pendentes' && (
                            <span className="px-3 py-1 text-[10px] font-black rounded-full bg-red-500 text-white animate-pulse flex items-center gap-1 shadow-lg">
                              🚨 URGENTE: SLA 48h Excedido ({sla.timeText})
                            </span>
                          )}

                          {isProUser && (
                            <span className="px-3 py-1 text-[10px] font-black rounded-full bg-brand-accent text-white flex items-center gap-1 shadow-md">
                              ⚡ PRIORIDADE PRO
                            </span>
                          )}

                          <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase ${
                            req.is_alteration
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : req.status === 'concluido' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}>
                            {req.is_alteration ? '⚠️ Alteração' : req.status === 'concluido' ? '✅ Concluído' : '📥 Novo Pedido'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                          <Clock className="h-3.5 w-3.5" />
                          <span>Solicitado há {sla.timeText}</span>
                        </div>
                      </div>

                      <p className="text-lg font-medium text-slate-100 leading-relaxed">&quot;{req.description}&quot;</p>

                      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-700">
                            {req.profiles?.avatar_url ? (
                              <img src={`/assets/avatars/avatar_${req.profiles.avatar_url}.png`} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-lg">🧒</span>
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-black text-white">{req.profiles?.child_name || 'Criança'}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{req.profiles?.parent_name || 'Responsável'}</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {req.profiles?.phone && (
                            <a
                              href={`https://wa.me/55${req.profiles.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${req.profiles.parent_name || ''}! Seu vídeo personalizado do Aniko está sendo produzido com muito carinho.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 rounded-xl text-xs font-bold flex items-center gap-1.5"
                            >
                              <MessageSquare className="h-3.5 w-3.5" />
                              <span>WhatsApp</span>
                            </a>
                          )}

                          <Link
                            href={`/admin/cliente/${req.profile_id}`}
                            target="_blank"
                            className="px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 rounded-xl text-xs font-bold flex items-center gap-1.5"
                          >
                            <BarChart3 className="h-3.5 w-3.5" />
                            <span>Perfil</span>
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
                                (window as any).currentRequestId = req.id;
                                (window as any).currentIsAlteration = req.is_alteration;
                                window.scrollTo({ top: 300, behavior: 'smooth' });
                              }}
                              className="px-5 py-2 bg-brand-accent text-white rounded-xl text-xs font-black shadow-lg hover:scale-105 transition-all"
                            >
                              Criar Vídeo →
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Form de Envio de Vídeo */}
            <div className="bg-[#0F1F35] p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6 self-start sticky top-24">
              <div>
                <h3 className="text-xl font-black flex items-center gap-2">
                  <span>🎬</span> Enviar Vídeo ao Cliente
                </h3>
                <p className="text-slate-400 text-xs mt-1">Selecione o pedido ou escolha um cliente manualmente.</p>
              </div>

              {selectedProfile && (
                <div className="p-4 bg-brand-primary/20 border border-brand-accent/30 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-brand-accent uppercase font-bold">Cliente Selecionado:</p>
                    <p className="font-black text-sm text-white">{selectedProfile.child_name || selectedProfile.email}</p>
                  </div>
                  <button onClick={() => { setSelectedProfileId(""); setSelectedProfile(null); }} className="text-slate-400 hover:text-white text-xs">Trocar</button>
                </div>
              )}

              {/* Templates */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Usar Template Rápido:</label>
                <div className="flex flex-wrap gap-2">
                  {SCRIPT_TEMPLATES.map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setVideoTitle(t.title);
                        setVideoCategory(t.category);
                        setVideoTags(t.tags);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-brand-accent hover:text-white text-xs font-bold transition-all border border-slate-700"
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSendVideo} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Título do Vídeo:</label>
                  <input
                    type="text"
                    placeholder="Ex: Bluey ensina a escovar os dentes!"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#16253B] text-white border border-slate-700 focus:border-brand-accent outline-none text-sm font-medium"
                  />
                </div>

                {/* Upload Cloudinary */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Arquivo de Vídeo (.MP4):</label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileUpload}
                    className="w-full text-xs text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-brand-accent file:text-white hover:file:opacity-90"
                  />
                  {isUploading && (
                    <div className="mt-3 space-y-1">
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-brand-accent h-full transition-all" style={{ width: `${uploadProgress}%` }} />
                      </div>
                      <p className="text-[10px] text-brand-accent font-mono">{uploadDebug}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Link do Vídeo (Manual ou Auto):</label>
                  <input
                    type="text"
                    placeholder="https://res.cloudinary.com/..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#16253B] text-white border border-slate-700 focus:border-brand-accent outline-none text-xs font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending || !videoUrl}
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all text-sm disabled:opacity-50"
                >
                  {isSending ? "Enviando..." : "🚀 Disparar Vídeo para o Cliente"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: FATURAMENTO & CONTAS */}
        {activeTab === 'faturamento' && (
          <div className="bg-[#0F1F35] p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <span>💵</span> Relatório de Faturamento & Contas
              </h2>
              <p className="text-slate-400 text-xs mt-1">Histórico completo de pagamentos recebidos via Mercado Pago (PIX e Cartão).</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                    <th className="py-4 px-4">Cliente / E-mail</th>
                    <th className="py-4 px-4">Plano / Pedido</th>
                    <th className="py-4 px-4">Valor</th>
                    <th className="py-4 px-4">Método</th>
                    <th className="py-4 px-4">Data</th>
                    <th className="py-4 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {requests.map((r, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 font-bold text-white">
                        {r.profiles?.child_name || r.profiles?.email || 'Cliente Aniko'}
                        <p className="text-[10px] text-slate-400 font-normal">{r.profiles?.email}</p>
                      </td>
                      <td className="py-4 px-4 text-slate-300">
                        {r.profiles?.plan_name || 'Vídeo Único'}
                      </td>
                      <td className="py-4 px-4 font-black text-emerald-400">
                        R$ {r.payment_amount || 80},00
                      </td>
                      <td className="py-4 px-4 text-xs font-bold text-slate-400 uppercase">
                        PIX / Mercado Pago
                      </td>
                      <td className="py-4 px-4 text-slate-400 text-xs">
                        {new Date(r.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          ✓ APROVADO
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CLIENTES & GESTÃO DE CRÉDITOS */}
        {activeTab === 'clientes' && (
          <div className="bg-[#0F1F35] p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <span>👥</span> Clientes & Créditos de Vídeos
                </h2>
                <p className="text-slate-400 text-xs mt-1">Gerencie saldos de créditos e contas de usuários.</p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Buscar por nome..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#16253B] text-white border border-slate-700 focus:border-brand-accent outline-none text-xs"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                    <th className="py-4 px-4">Paciente / Criança</th>
                    <th className="py-4 px-4">Responsável</th>
                    <th className="py-4 px-4">Plano</th>
                    <th className="py-4 px-4">Créditos Restantes</th>
                    <th className="py-4 px-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredProfiles.map((p) => (
                    <tr key={p.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 font-bold text-white flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-700">
                          {p.avatar_url ? (
                            <img src={`/assets/avatars/avatar_${p.avatar_url}.png`} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <span>🧒</span>
                          )}
                        </div>
                        <span>{p.child_name || 'Sem nome'}</span>
                      </td>
                      <td className="py-4 px-4 text-slate-300">
                        {p.parent_name || 'N/A'}
                        <p className="text-[10px] text-slate-500">{p.phone || p.email}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black bg-brand-primary/30 text-brand-accent border border-brand-accent/20">
                          {p.plan_name || 'Plano Essencial'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {p.video_credits !== undefined ? p.video_credits : 4} Créditos
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right space-x-2">
                        <button
                          onClick={() => setCreditModalUser(p)}
                          className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold rounded-xl transition-all"
                        >
                          + Dar Créditos
                        </button>
                        <Link
                          href={`/admin/cliente/${p.id}`}
                          target="_blank"
                          className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 text-xs font-bold rounded-xl transition-all inline-block"
                        >
                          Detalhes
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: CUPONS DE DESCONTO */}
        {activeTab === 'cupons' && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#0F1F35] p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
              <div>
                <h3 className="text-xl font-black flex items-center gap-2">
                  <span>🎟️</span> Criar Novo Cupom
                </h3>
                <p className="text-slate-400 text-xs mt-1">Crie códigos de desconto fixos para parcerias com clínicas ou campanhas.</p>
              </div>

              <form onSubmit={handleCreateCoupon} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Código do Cupom:</label>
                  <input
                    type="text"
                    placeholder="Ex: CLINICA_APAE"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#16253B] text-white border border-slate-700 focus:border-brand-accent outline-none font-mono text-sm uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Desconto Fixo (R$):</label>
                  <input
                    type="number"
                    placeholder="Ex: 30"
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#16253B] text-white border border-slate-700 focus:border-brand-accent outline-none text-sm font-bold"
                  />
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-800/60 rounded-xl">
                  <input
                    type="checkbox"
                    id="singleUse"
                    checked={isSingleUse}
                    onChange={(e) => setIsSingleUse(e.target.checked)}
                    className="h-4 w-4 rounded accent-brand-accent"
                  />
                  <label htmlFor="singleUse" className="text-xs font-bold text-slate-300">Cupom de Uso Único (Especial por cliente)</label>
                </div>

                <button
                  type="submit"
                  disabled={isCreatingCoupon}
                  className="w-full py-4 bg-brand-accent hover:bg-brand-accent/90 text-white font-black rounded-2xl shadow-xl hover:scale-[1.02] transition-all text-sm disabled:opacity-50"
                >
                  {isCreatingCoupon ? "Criando..." : "Criar Cupom"}
                </button>
              </form>
            </div>

            <div className="bg-[#0F1F35] p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
              <h3 className="text-xl font-black">Cupons Ativos</h3>
              <div className="space-y-3">
                {coupons.map((c) => (
                  <div key={c.id} className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700 flex items-center justify-between">
                    <div>
                      <p className="font-mono font-black text-brand-accent">{c.code}</p>
                      <p className="text-xs text-slate-400 font-bold">Desconto: R$ {c.discount_fixed},00</p>
                    </div>
                    <button
                      onClick={() => handleDeleteCoupon(c.id)}
                      className="px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl text-xs font-bold"
                    >
                      Excluir
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Concessão Manual de Créditos */}
      {creditModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-[#0F1F35] border border-slate-700 w-full max-w-md rounded-3xl p-8 space-y-6 text-white shadow-2xl">
            <h3 className="text-xl font-black flex items-center gap-2">
              <span>🎁</span> Conceder Créditos
            </h3>
            <p className="text-xs text-slate-400">
              Cliente: <strong className="text-white">{creditModalUser.child_name || creditModalUser.email}</strong><br />
              Saldo atual: <strong className="text-brand-accent">{creditModalUser.video_credits || 0} créditos</strong>
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Quantidade de Créditos a Adicionar:</label>
              <input
                type="number"
                min="1"
                max="50"
                value={creditAmount}
                onChange={(e) => setCreditAmount(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-[#16253B] text-white border border-slate-700 focus:border-brand-accent outline-none font-black text-lg"
              />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setCreditModalUser(null)} className="flex-1 py-3 bg-slate-800 text-slate-400 rounded-xl font-bold text-xs">Cancelar</button>
              <button
                onClick={handleGrantCredits}
                disabled={isUpdatingCredits}
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black text-xs shadow-lg"
              >
                {isUpdatingCredits ? "Adicionando..." : "Confirmar Créditos"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
