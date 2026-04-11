"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const AVATARS = [
  { id: 'lion', label: 'Leão' },
  { id: 'elephant', label: 'Elefante' },
  { id: 'giraffe', label: 'Girafa' },
  { id: 'monkey', label: 'Macaco' },
  { id: 'panda', label: 'Panda' },
  { id: 'koala', label: 'Coala' },
  { id: 'fox', label: 'Raposa' },
  { id: 'rabbit', label: 'Coelho' },
  { id: 'cat', label: 'Gato' },
  { id: 'dog', label: 'Cachorro' },
  { id: 'bird', label: 'Pássaro' },
  { id: 'turtle', label: 'Tartaruga' },
  { id: 'whale', label: 'Baleia' },
  { id: 'bear', label: 'Urso' },
  { id: 'tiger', label: 'Tigre' },
];

const ALL_PREFERENCES = [
  "Daniel Tigre", "Bluey", "Mundo Bita", "Peppa Pig", 
  "Pocoyo", "Bob Zoom", "Show da Luna", "Galinha Pintadinha", 
  "Barney", "Thomas e seus Amigos", "Super Wings", "Patrulha Canina",
  "Bita e os Animais", "Bolofofos", "Lottie Dottie Chicken", "Baby Shark", 
  "Mickey Mouse", "Frozen", "Toy Story", "Moana", "Masha e o Urso", 
  "Turma da Mônica", "PJ Masks", "Miraculous", "Patati Patatá", 
  "Backyardigans", "Dora a Aventureira", "Bubble Guppies", "Octonautas", 
  "Blaze", "Shimmer and Shine", "Smilingüido", "Bita e o Corpo Humano"
];

export default function Dashboard() {
  const [showVideo, setShowVideo] = useState(false);
  const [requestText, setRequestText] = useState("");
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>({
    child_name: "Carregando...",
    avatar_url: null,
    preferences: []
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [pixData, setPixData] = useState<any>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string>('pending'); // pending, approved, rejected
  const [editFormData, setEditFormData] = useState<any>({
    child_name: "",
    avatar_url: "",
    phone: "",
    preferences: []
  });
  const [availablePreferences, setAvailablePreferences] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const router = useRouter();


  const handleOpenVideo = (url: string) => {
    if (url.includes('drive.google.com')) {
      window.open(url, '_blank');
    } else {
      setSelectedVideo(url);
    }
  };

  // 1. Verificar Sessão e Buscar Vídeos
  useEffect(() => {
    async function initDashboard() {
      // Pegar usuário logado
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        router.push("/login"); // Se não estiver logado, vai pro login
        return;
      }
      
      setUser(user);

      // Buscar perfil real na tabela 'profiles'
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (!profileError && profileData) {
        setProfile({
          ...profileData,
          preferences: profileData.preferences || []
        });
        setEditFormData({
          child_name: profileData.child_name,
          avatar_url: profileData.avatar_url,
          phone: profileData.phone || "",
          preferences: profileData.preferences || []
        });
      }

      // Buscar vídeos deste usuário específico
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false });
      
      if (!error && data) setVideos(data);
      setLoading(false);
    }
    initDashboard();
  }, []);

  // Sortear preferências dinâmicas ao abrir o modal
  useEffect(() => {
    if (isEditModalOpen) {
      const shuffled = [...ALL_PREFERENCES].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 12);
      
      // Garante que as já selecionadas continuem aparecendo para poder desmarcar
      const finalOptions = Array.from(new Set([...editFormData.preferences, ...selected]));
      setAvailablePreferences(finalOptions.sort());
    }
  }, [isEditModalOpen]);


  // 2. Iniciar Fluxo de Pagamento (Interceptor de Solicitação)
  const handleRequest = async () => {
    if (!requestText || !user) return;
    
    setPaymentLoading(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: requestText,
          profile_id: user.id,
          user_email: user.email
        }),
      });

      // Verificar se a resposta é JSON antes de tentar parsear
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const htmlText = await response.text();
        console.error("Resposta não-JSON da API:", htmlText.substring(0, 500));
        throw new Error(`Servidor retornou status ${response.status}. Veja o console (F12) para detalhes.`);
      }

      const data = await response.json();

      if (data.error) throw new Error(data.error);

      setPixData(data);
      setIsPaymentModalOpen(true);
    } catch (err: any) {
      alert("Erro ao gerar pagamento: " + err.message);
    } finally {
      setPaymentLoading(false);
    }
  };

  // 2.5 Polling: Verificar status do pagamento a cada 5s
  useEffect(() => {
    if (!isPaymentModalOpen || !pixData?.payment_id) return;
    setPaymentStatus('pending');

    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/check-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ payment_id: pixData.payment_id }),
        });
        const data = await res.json();

        if (data.status === 'approved') {
          clearInterval(interval);
          setPaymentStatus('approved');

          // Criar a solicitação oficial agora que o pagamento foi confirmado
          if (requestText && user) {
            await supabase
              .from('video_requests')
              .insert([{ 
                description: requestText, 
                status: 'pendente',
                profile_id: user.id,
                payment_id: pixData.payment_id
              }]);
          }

          setSuccess(true);
          setRequestText("");
          setTimeout(() => {
            setIsPaymentModalOpen(false);
            setPixData(null);
            setPaymentStatus('pending');
            setSuccess(false);
          }, 4000);
        } else if (data.status === 'rejected' || data.status === 'cancelled') {
          clearInterval(interval);
          setPaymentStatus('rejected');
        }
      } catch (err) {
        console.error('Erro ao verificar pagamento:', err);
      }
    }, 5000);

    // Limpar intervalo ao fechar modal
    return () => clearInterval(interval);
  }, [isPaymentModalOpen, pixData]);

  // 3. Avaliar vídeo com estrelas
  const handleRate = async (videoId: number, rating: number) => {
    const { error } = await supabase
      .from('videos')
      .update({ rating })
      .eq('id', videoId);
    
    if (!error) {
      // Atualizar estado local para feedback visual
      setVideos(prev => prev.map(v => v.id === videoId ? { ...v, rating } : v));
    }
  };

  // 4. Salvar Alterações de Perfil
  const handleSaveProfile = async () => {
    if (!user) return;
    
    const { error } = await supabase
      .from('profiles')
      .update({
        child_name: editFormData.child_name,
        avatar_url: editFormData.avatar_url,
        phone: editFormData.phone,
        preferences: editFormData.preferences
      })
      .eq('id', user.id);

    if (!error) {
      setProfile(editFormData);
      setIsEditModalOpen(false);
    } else {
      alert("Erro ao atualizar perfil: " + error.message);
    }
  };

  const togglePreference = (pref: string) => {
    setEditFormData((prev: any) => {
      const isSelected = prev.preferences.includes(pref);
      if (isSelected) {
        return { ...prev, preferences: prev.preferences.filter((p: string) => p !== pref) };
      } else {
        return { ...prev, preferences: [...prev.preferences, pref] };
      }
    });
  };


  return (
    <main className="min-h-screen bg-slate-50 text-brand-primary pb-20">
      {/* Navigation */}
      <nav className="w-full bg-white border-b border-slate-100 px-6 py-4 md:px-12 sticky top-0 z-30 shadow-sm">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
             <Image src="/assets/logo.jpeg" alt="Logo" width={40} height={40} className="rounded-xl shadow-md border-2 border-brand-secondary/20" />
             <span className="text-xl font-bold tracking-tight text-brand-primary uppercase">ANIKO</span>
          </Link>
          <div className="flex items-center gap-4">
             <Link href="/contato" className="hidden md:block text-slate-400 font-bold hover:text-brand-accent transition-colors text-sm">Dúvidas?</Link>
             <button 
               onClick={() => { supabase.auth.signOut(); window.location.href = "/"; }}
               className="px-6 py-2 bg-slate-100 text-brand-primary font-bold rounded-xl hover:bg-slate-200 transition-all text-sm"
             >
               Sair
             </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 py-12 md:px-12 grid gap-12 lg:grid-cols-[1fr_350px]">
        {/* Main Content */}
        <div className="space-y-12">
          {/* Video Gallery */}
          <section className="space-y-8 animate-fade-up">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-black">Vídeos Solicitados</h1>
              <span className="text-brand-secondary font-bold cursor-pointer hover:underline">Ver Histórico</span>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              {loading ? (
                <div className="col-span-2 py-10 text-center text-slate-400 font-bold animate-pulse">Carregando seus vídeos...</div>
              ) : videos.length > 0 ? (
                videos.map((v, i) => (
                  <div key={i} className="group relative aspect-video bg-slate-200 rounded-[2.5rem] overflow-hidden shadow-lg border-4 border-white hover:scale-[1.02] transition-all">
                    <div className="absolute inset-0 bg-brand-primary/20 group-hover:bg-brand-primary/40 transition-colors flex items-center justify-center cursor-pointer" onClick={() => handleOpenVideo(v.video_url)}>
                        <div className="h-16 w-16 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
                          <svg className="h-6 w-6 fill-brand-primary ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                    </div>
                    <div className="absolute bottom-6 left-8 text-white pr-20">
                        <span className="inline-block px-3 py-1 bg-brand-secondary rounded-full text-[10px] font-black uppercase tracking-widest mb-2">{v.category || 'Animação'}</span>
                        <h4 className="text-xl font-bold font-shadow-md">{v.title}</h4>
                        <p className="text-white/80 text-sm">{new Date(v.created_at).toLocaleDateString()}</p>
                    </div>
                    
                    {/* Star Rating Interaction */}
                    <div className="absolute bottom-6 right-8 flex gap-1 bg-black/20 backdrop-blur-md px-3 py-2 rounded-2xl group/stars hover:bg-black/40 transition-all border border-white/10" onClick={(e) => e.stopPropagation()}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button 
                            key={star} 
                            onClick={() => handleRate(v.id, star)}
                            className={`${(v.rating || 0) >= star ? 'text-brand-accent' : 'text-white/40'} hover:text-brand-accent hover:scale-125 transition-all outline-none`}
                          >
                            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                          </button>
                        ))}
                    </div>
                  </div>
                ))
              ) : (
                 <div className="col-span-2 py-20 bg-white rounded-[3rem] border border-dashed border-slate-200 text-center space-y-4">
                    <p className="text-slate-400 font-bold uppercase tracking-widest">Nenhum vídeo disponível ainda.</p>
                    <p className="text-sm text-slate-300">Faça sua primeira solicitação abaixo!</p>
                 </div>
              )}
            </div>
          </section>

          {/* Video Request Form */}
          <section className="bg-white rounded-[3rem] p-10 shadow-xl border border-white animate-fade-up delay-100">
             <div className="flex items-center gap-4 mb-8">
                <div className="h-12 w-12 rounded-2xl bg-brand-accent/10 flex items-center justify-center text-2xl">✍️</div>
                <h3 className="text-2xl font-black">Nova Solicitação</h3>
             </div>
             <p className="text-slate-500 mb-6 font-medium">Descreva o que você gostaria de reforçar. Ex: "Vídeo do Bluey ensinando a guardar os brinquedos".</p>
             
             {success && (
                <div className="mb-6 p-6 bg-green-50 border-2 border-green-100 rounded-3xl flex items-center gap-4 text-green-600 animate-fade-in">
                   <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-xl">✅</div>
                   <div>
                      <p className="font-black">Pedido Enviado!</p>
                      <p className="text-sm font-medium opacity-80">Recebemos sua solicitação. Vamos preparar o vídeo com carinho.</p>
                   </div>
                </div>
             )}

             <textarea 
                value={requestText}
                onChange={(e) => setRequestText(e.target.value)}
                placeholder="Escreva aqui os detalhes do vídeo que você precisa..."
                className="w-full h-40 px-8 py-6 rounded-3xl bg-slate-50 border-2 border-transparent focus:border-brand-accent focus:bg-white transition-all outline-none text-brand-primary font-medium resize-none mb-6 shadow-inner"
             />
             <div className="flex flex-col md:flex-row gap-4">
               <button 
                  onClick={handleRequest}
                  disabled={!requestText || paymentLoading}
                  className="disabled:opacity-50 flex-1 px-10 py-5 bg-brand-accent text-white font-black rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all text-lg"
               >
                  {paymentLoading ? "Gerando PIX..." : "Enviar Solicitação (R$ 80)"}
               </button>
               {videos.length > 0 && (
                  <button 
                     onClick={() => handleOpenVideo(videos[0].video_url)}
                     className="flex-1 py-4 bg-brand-primary text-white font-black rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all text-xl"
                  >
                     Assistir Agora
                  </button>
               )}
             </div>
          </section>

          {/* Progress Section (Keep but keep it clean) */}
          <section className="bg-white rounded-[3rem] p-10 shadow-xl border border-white animate-fade-up delay-200">
             <h3 className="text-2xl font-black mb-8">Evolução do Engajamento</h3>
             <div className="h-48 w-full bg-slate-50 rounded-3xl border border-dashed border-slate-200 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                   <svg width="100%" height="100%" viewBox="0 0 1000 200" preserveAspectRatio="none">
                      <path d="M0,150 Q250,50 500,100 T1000,50" fill="none" stroke="#2563eb" strokeWidth="10" />
                   </svg>
                </div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-sm z-10">Gráfico de Interação</p>
             </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-8 animate-fade-in delay-300">
           {/* Child Profile Card */}
           <div className="bg-brand-primary rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="flex flex-col items-center text-center">
                 <div className="h-32 w-32 rounded-full border-4 border-white/20 p-2 mb-6 shadow-2xl">
                    <div className="h-full w-full rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                       {profile.avatar_url ? (
                         <img src={`/assets/avatars/avatar_${profile.avatar_url}.png`} alt="Avatar" className="w-full h-full object-cover" />
                       ) : (
                         <span className="text-4xl">🧒</span>
                       )}
                    </div>
                 </div>
                 <h2 className="text-2xl font-black mb-6">{profile.child_name || "Seu Filho"}</h2>
                 <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="w-full py-3 bg-white/10 hover:bg-white text-white hover:text-brand-primary rounded-2xl font-bold transition-all border border-white/10 text-sm"
                 >
                   Editar Perfil
                 </button>
              </div>
           </div>

           {/* Active Tasks/Interests */}
           <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-white">
              <h3 className="text-lg font-black mb-6">Preferências Ativas</h3>
              <div className="flex flex-wrap gap-2">
                 {profile.preferences.length > 0 ? profile.preferences.map((int: string, i: number) => (
                    <span key={i} className="px-4 py-2 bg-slate-50 text-slate-600 rounded-full text-xs font-bold border border-slate-100 flex items-center gap-2">
                       <span className="h-1.5 w-1.5 rounded-full bg-brand-accent" />
                       {int}
                    </span>
                 )) : (
                   <p className="text-sm text-slate-400 italic">Nenhuma preferência selecionada.</p>
                 )}
              </div>
           </div>
        </aside>

      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-brand-primary/40 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-white animate-scale-up">
            <div className="p-8 md:p-12 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-3xl font-black text-brand-primary">Editar Perfil</h3>
                <button onClick={() => setIsEditModalOpen(false)} className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 transition-all">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="space-y-6 max-h-[70vh] overflow-y-auto px-2 pb-6 custom-scrollbar">
                {/* Name field */}
                <div>
                  <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 ml-2">Nome da Criança</label>
                  <input 
                    type="text" 
                    value={editFormData.child_name}
                    onChange={(e) => setEditFormData({ ...editFormData, child_name: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-accent focus:bg-white transition-all outline-none text-brand-primary font-bold shadow-inner"
                  />
                </div>

                {/* WhatsApp field */}
                <div>
                  <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 ml-2">WhatsApp para Contato</label>
                  <input 
                    type="text" 
                    value={editFormData.phone}
                    placeholder="(00) 00000-0000"
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-accent focus:bg-white transition-all outline-none text-brand-primary font-bold shadow-inner"
                  />
                </div>

                {/* Avatar Selector */}
                <div>
                  <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 ml-2">Escolha seu Avatar</label>
                  <div className="grid grid-cols-5 gap-3">
                    {AVATARS.map((av) => (
                      <button 
                        key={av.id}
                        onClick={() => setEditFormData({ ...editFormData, avatar_url: av.id })}
                        className={`aspect-square rounded-2xl overflow-hidden border-4 transition-all hover:scale-105 active:scale-95 ${editFormData.avatar_url === av.id ? 'border-brand-accent bg-brand-accent/5' : 'border-slate-50 bg-slate-50 opacity-60 hover:opacity-100'}`}
                      >
                        <img src={`/assets/avatars/avatar_${av.id}.png`} alt={av.label} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preferences Selector */}
                <div>
                  <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 ml-2">Preferências de Animação</label>
                  <div className="flex flex-wrap gap-2">
                    {availablePreferences.map((pref) => (
                      <button 
                        key={pref}
                        onClick={() => togglePreference(pref)}
                        className={`px-5 py-3 rounded-2xl text-sm font-bold border-2 transition-all ${editFormData.preferences.includes(pref) ? 'bg-brand-primary border-brand-primary text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                      >
                        {pref}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-4 italic ml-2">* A cada acesso ao perfil, novos desenhos aparecem aqui!</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-5 rounded-2xl font-black text-slate-400 bg-slate-50 hover:bg-slate-100 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSaveProfile}
                  className="flex-1 py-5 rounded-2xl font-black text-white bg-brand-accent shadow-xl hover:scale-[1.02] active:scale-95 transition-all text-lg"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {isPaymentModalOpen && pixData && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-brand-primary/60 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-8 md:p-12 text-center space-y-8 animate-scale-up">
            
            {paymentStatus === 'approved' ? (
              /* ESTADO: PAGAMENTO APROVADO */
              <div className="space-y-6 py-8">
                <div className="text-7xl animate-bounce">✅</div>
                <h3 className="text-3xl font-black text-green-600">Pagamento Confirmado!</h3>
                <p className="text-slate-500 font-bold">Seu pedido foi enviado para nossa equipe.</p>
                <p className="text-sm text-slate-400">Esta janela fecha automaticamente...</p>
              </div>
            ) : paymentStatus === 'rejected' ? (
              /* ESTADO: PAGAMENTO REJEITADO */
              <div className="space-y-6 py-8">
                <div className="text-7xl">❌</div>
                <h3 className="text-3xl font-black text-red-500">Pagamento não aprovado</h3>
                <p className="text-slate-500 font-bold">Tente novamente ou use outra forma de pagamento.</p>
                <button 
                  onClick={() => { setIsPaymentModalOpen(false); setPaymentStatus('pending'); }}
                  className="w-full py-4 bg-brand-primary text-white font-black rounded-2xl"
                >
                  Fechar
                </button>
              </div>
            ) : (
              /* ESTADO: AGUARDANDO PAGAMENTO */
              <>
                <h3 className="text-3xl font-black text-brand-primary">Pagamento PIX</h3>
                <p className="text-slate-500 font-bold">Valor: R$ 80,00</p>
                
                <div className="mx-auto w-48 h-48 bg-slate-50 rounded-3xl border-4 border-brand-accent/20 p-2 overflow-hidden">
                   <img src={`data:image/png;base64,${pixData.qr_code_base64}`} alt="QR Code PIX" className="w-full h-full" />
                </div>

                <div className="space-y-4">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Ou copie o código abaixo:</p>
                  <div className="p-4 bg-slate-50 rounded-2xl text-[10px] break-all font-mono text-slate-500 border border-slate-100 select-all">
                    {pixData.qr_code}
                  </div>
                </div>

                <div className="space-y-4">
                   <div className="flex items-center justify-center gap-3 py-4">
                     <div className="h-3 w-3 bg-brand-accent rounded-full animate-pulse" />
                     <p className="text-brand-accent font-black text-sm">Aguardando pagamento...</p>
                   </div>
                   <button 
                      onClick={() => { setIsPaymentModalOpen(false); setPaymentStatus('pending'); }}
                      className="w-full text-slate-400 font-bold py-2"
                   >
                      Cancelar e Voltar
                   </button>
                </div>
                
                <p className="text-[10px] text-slate-400 italic">O pedido será enviado automaticamente assim que o pagamento for confirmado.</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Video Modal Overlay */}

      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-primary/95 p-4 backdrop-blur-xl animate-fade-in">
          <button 
            onClick={() => setSelectedVideo(null)}
            className="absolute top-8 right-8 text-white hover:text-brand-accent transition-colors z-50 p-2 bg-white/10 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
          
          <div className="relative aspect-[9/16] h-[85vh] overflow-hidden rounded-[3rem] border-8 border-white/20 shadow-2xl animate-scale-up">
            <video 
              src={selectedVideo} 
              controls 
              autoPlay 
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      )}
    </main>
  );
}
