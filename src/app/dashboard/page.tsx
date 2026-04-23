"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  TrendingUp, 
  RefreshCcw, 
  Sparkles, 
  CheckCircle2, 
  LogOut, 
  Menu, 
  X, 
  MessageSquare, 
  Star, 
  Send,
  Play,
  Wind
} from "lucide-react";
import { useSensory } from "@/context/SensoryContext";
import BackgroundDecor from "@/components/BackgroundDecor";

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

function GraficoRespostaCustom({ videos }: { videos: any[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const dados = videos.map((v) => ({
    nota: v.response_score !== null && v.response_score !== undefined ? v.response_score : (v.rating ? v.rating * 2 : 0),
    titulo: v.title,
    data: new Date(v.created_at).toLocaleDateString('pt-BR'),
    temNota: v.response_score !== null && v.response_score !== undefined
  }));

  const maxNota = Math.max(...dados.map(d => d.nota), 10);
  const svgHeight = 200;
  const svgWidth = 600;
  const padding = 40;
  const chartHeight = svgHeight - padding * 2;
  const chartWidth = svgWidth - padding * 2;
  const stepX = chartWidth / Math.max(dados.length - 1, 1);

  const getY = (nota: number) => svgHeight - padding - (nota / maxNota) * chartHeight;
  const getX = (index: number) => padding + index * stepX;

  const pathData = dados.map((d, i) => 
    `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.nota)}`
  ).join(' ');

  const areaPath = pathData + 
    ` L ${getX(dados.length - 1)} ${svgHeight - padding}` +
    ` L ${padding} ${svgHeight - padding} Z`;

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="verdeGradiente2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4FD1A5" stopOpacity={0.35}/>
            <stop offset="50%" stopColor="#4FD1A5" stopOpacity={0.15}/>
            <stop offset="100%" stopColor="#4FD1A5" stopOpacity={0.02}/>
          </linearGradient>
        </defs>
        
        {[0, 2, 4, 6, 8, 10].map((val) => (
          <g key={val}>
            <line 
              x1={padding} y1={getY(val)} 
              x2={svgWidth - padding} y2={getY(val)} 
              stroke="rgba(14, 58, 95, 0.08)" 
              strokeDasharray="4 4"
            />
            <text x={padding - 8} y={getY(val) + 4} textAnchor="end" fontSize="10" fill="#0E3A5F" fontWeight="500">
              {val}
            </text>
          </g>
        ))}

        <path d={areaPath} fill="url(#verdeGradiente2)" />
        
        <path d={pathData} fill="none" stroke="#4FD1A5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {dados.map((d, i) => (
          <g 
            key={i} 
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="cursor-pointer"
          >
            <circle 
              cx={getX(i)} 
              cy={getY(d.nota)} 
              r={hoveredIndex === i ? 8 : 5}
              fill={d.temNota ? "#fff" : "#e2e8f0"}
              stroke="#4FD1A5"
              strokeWidth={2}
              className="transition-all duration-200"
            />
          </g>
        ))}

        {dados.map((d, i) => (
          <text 
            key={`label-${i}`}
            x={getX(i)} 
            y={svgHeight - 10} 
            textAnchor="middle" 
            fontSize="9" 
            fill="#0E3A5F"
            fontWeight="500"
          >
            {d.data.split('/')[0] + '/' + d.data.split('/')[1]}
          </text>
        ))}
      </svg>

      {hoveredIndex !== null && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-xl shadow-xl border border-slate-100 z-10 animate-fade-in">
          <p className="text-[10px] text-slate-400 font-bold">{dados[hoveredIndex].data}</p>
          <p className="text-brand-primary font-black text-lg">
            {dados[hoveredIndex].temNota ? `${dados[hoveredIndex].nota}/10` : 'Sem nota'}
          </p>
          <p className="text-slate-500 text-xs truncate max-w-[150px]">{dados[hoveredIndex].titulo || 'Vídeo'}</p>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { isSensoryFriendly, toggleSensoryFriendly } = useSensory();
  const [showVideo, setShowVideo] = useState(false);
  const [requestText, setRequestText] = useState("");
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>({
    child_name: "Carregando...",
    avatar_url: null,
    preferences: [],
    historico: ""
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
    preferences: [],
    historico: ""
  });
  const [availablePreferences, setAvailablePreferences] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [activeFeedbackId, setActiveFeedbackId] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackScore, setFeedbackScore] = useState(0);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [historicoExpandido, setHistoricoExpandido] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");
  
  // Estados para Solicitar Alteração
  const [activeAlterationId, setActiveAlterationId] = useState<number | null>(null);
  const [alterationText, setAlterationText] = useState("");
  const [isSubmittingAlteration, setIsSubmittingAlteration] = useState(false);
  const [alterationSuccess, setAlterationSuccess] = useState<number | null>(null);

  const router = useRouter();

  // Helper para inferir tags automaticamente a partir do texto
  const inferTags = (text: string): string => {
    const t = text.toLowerCase();
    const tags: string[] = [];
    
    if (t.includes('banho') || t.includes('escovar') || t.includes('dente') || t.includes('mão') || t.includes('higiene') || t.includes('limpeza')) {
      tags.push('Higiene');
    }
    if (t.includes('escola') || t.includes('estudar') || t.includes('aprender') || t.includes('aula') || t.includes('educação') || t.includes('número') || t.includes('letra')) {
      tags.push('Educação');
    }
    if (t.includes('comer') || t.includes('alimento') || t.includes('fruta') || t.includes('legume') || t.includes('alimentação') || t.includes('comida') || t.includes('jantar') || t.includes('almoço')) {
      tags.push('Alimentação');
    }
    if (t.includes('pai') || t.includes('mãe') || t.includes('família') || t.includes('irmão') || t.includes('casa') || t.includes('avô') || t.includes('avó')) {
      tags.push('Família');
    }
    if (t.includes('amigo') || t.includes('brincar') || t.includes('social') || t.includes('conversar') || t.includes('pessoas') || t.includes('compartilhar') || t.includes('sentimento')) {
      tags.push('Social');
    }
    
    return tags.join(', ');
  };

  const handleDeleteVideo = async (videoId: number) => {
    if (!confirm('Tem certeza que deseja excluir este vídeo?')) return;
    
    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', videoId);
    
    if (!error) {
      setVideos(prev => prev.filter(v => v.id !== videoId));
    } else {
      alert('Erro ao excluir vídeo: ' + error.message);
    }
  };
  
  // Função para converter links do Google Drive em links diretos para o player
  const getDirectLink = (url: string) => {
    if (!url) return "";
    
    // Suporte para Google Drive
    if (url.includes('drive.google.com')) {
      // Tenta extrair o ID do arquivo
      const match = url.match(/\/d\/(.+?)\//) || url.match(/id=(.+?)(&|$)/);
      const fileId = match ? match[1] : null;
      
      if (fileId) {
        // Adicionando confirm=t para burlar o aviso de verificação de vírus do Google Drive para arquivos grandes
        return `https://drive.google.com/uc?export=download&confirm=t&id=${fileId}`;
      }
    }
    
    return url;
  };

  const handleOpenVideo = (url: string) => {
    const directUrl = getDirectLink(url);
    setSelectedVideo(directUrl);
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
          preferences: profileData.preferences || [],
          historico: profileData.historico || ""
        });
        setEditFormData({
          child_name: profileData.child_name,
          avatar_url: profileData.avatar_url,
          phone: profileData.phone || "",
          preferences: profileData.preferences || [],
          historico: profileData.historico || ""
        });
      }

      // Buscar vídeos deste usuário específico via API (bypass RLS)
      try {
        const videosRes = await fetch(`/api/admin/videos-cliente/${user.id}?key=aniko_admin_segredo_2026`);
        const videosData = await videosRes.json();
        if (videosData.videos) setVideos(videosData.videos);
      } catch (e) {
        console.error('Erro ao buscar vídeos:', e);
      }
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
          user_email: user.email,
          coupon_code: appliedCoupon?.code
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

      if (data.is_free) {
        // Fluxo para cupom de 100% - Aprovação instantânea
        console.log(">>> DASHBOARD: Pagamento grátis, pulando modal...");
        
        if (requestText && user) {
          await supabase
            .from('video_requests')
            .insert([{ 
              description: requestText, 
              status: 'pendente',
              profile_id: user.id,
              payment_id: data.payment_id,
              coupon_code: appliedCoupon?.code
            }]);
        }

        setSuccess(true);
        setRequestText("");
        setAppliedCoupon(null);
        setTimeout(() => {
          setSuccess(false);
        }, 4000);
      } else {
        // Fluxo normal com Mercado Pago
        setPixData(data);
        setIsPaymentModalOpen(true);
      }
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

  // 3. Avaliar vídeo com Nota e Feedback
  const handleRate = async (videoId: number, score?: number, text?: string) => {
    const finalScore = score !== undefined ? score : feedbackScore;
    const finalText = text !== undefined ? text : feedbackText;

    setIsSubmittingFeedback(true);
    const { error } = await supabase
      .from('videos')
      .update({ 
        response_score: finalScore,
        feedback: finalText,
        rating: Math.ceil(finalScore / 2)
      })
      .eq('id', videoId);
    
    if (!error) {
      setVideos(prev => prev.map(v => v.id === videoId ? { 
        ...v, 
        response_score: finalScore, 
        feedback: finalText,
        rating: Math.ceil(finalScore / 2)
      } : v));
      setActiveFeedbackId(null);
      // Don't clear global state here if parameters were used, 
      // but usually it's fine as they are temporary.
    }
    setIsSubmittingFeedback(false);
  };

  const handleRequestAlteration = async (videoId: number) => {
    if (!alterationText.trim() || isSubmittingAlteration) return;
    setIsSubmittingAlteration(true);

    const { error } = await supabase
      .from('videos')
      .update({ 
        requested_alteration: alterationText.trim(),
        status: 'alteracao_solicitada' 
      })
      .eq('id', videoId);
    
    if (!error) {
      setVideos(prev => prev.map(v => v.id === videoId ? { 
        ...v, 
        requested_alteration: alterationText.trim(),
        status: 'alteracao_solicitada'
      } : v));
      setAlterationSuccess(videoId);
      setTimeout(() => setAlterationSuccess(null), 3000);
      setActiveAlterationId(null);
      setAlterationText("");
    } else {
      alert("Erro ao enviar solicitação: " + error.message);
    }
    setIsSubmittingAlteration(false);
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
        preferences: editFormData.preferences,
        historico: editFormData.historico
      })
      .eq('id', user.id);

    if (!error) {
      setProfile({
        ...editFormData,
        preferences: editFormData.preferences || [],
        historico: editFormData.historico || ""
      });
      setIsEditModalOpen(false);
    } else {
      alert("Erro ao atualizar perfil: " + error.message);
    }
  };

  const handleValidateCoupon = async () => {
    if (!couponCode || isValidatingCoupon) return;
    setIsValidatingCoupon(true);
    setCouponError("");
    
    try {
      const res = await fetch('/api/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code: couponCode,
          profile_id: user?.id
        }),
      });
      const data = await res.json();
      
      if (data.success) {
        setAppliedCoupon(data);
        setCouponCode("");
      } else {
        setCouponError(data.error || "Cupom inválido.");
      }
    } catch (e) {
      setCouponError("Erro ao validar cupom.");
    } finally {
      setIsValidatingCoupon(false);
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
    <main className="min-h-screen bg-slate-50 text-brand-primary pb-20 relative">
      <BackgroundDecor />
      {/* Navigation */}
      <nav className="w-full bg-white border-b border-slate-100 px-6 py-4 md:px-12 sticky top-0 z-30 shadow-sm">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
             <Image src="/assets/logo.jpeg" alt="Logo" width={40} height={40} className="rounded-xl shadow-md border-2 border-brand-secondary/20" />
             <span className="text-xl font-bold tracking-tight text-brand-primary uppercase">ANIKO</span>
          </Link>
          <div className="flex items-center gap-4">
             <button 
               onClick={() => {
                 document.getElementById('solicitar-video')?.scrollIntoView({ behavior: 'smooth' });
               }}
               className="flex items-center gap-2 px-4 md:px-6 py-2 bg-brand-accent text-white font-black rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all text-[10px] md:text-sm"
             >
               <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4" />
               <span>Solicitar Vídeo</span>
             </button>
             <button 
               onClick={toggleSensoryFriendly}
               className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-xs font-bold ${isSensoryFriendly ? 'bg-brand-accent/10 border-brand-accent text-brand-accent' : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-brand-secondary'}`}
             >
               {isSensoryFriendly ? <Sparkles className="h-3.5 w-3.5" /> : <Wind className="h-3.5 w-3.5" />}
               <span className="hidden sm:inline">{isSensoryFriendly ? 'Modo Sensorial On' : 'Ativar Modo Sensorial'}</span>
             </button>
             <Link href="/valores" className="hidden md:block text-slate-400 font-bold hover:text-brand-accent transition-colors text-sm">Valores</Link>
             <Link href="/duvidas" className="hidden md:block text-slate-400 font-bold hover:text-brand-accent transition-colors text-sm">Dúvidas?</Link>
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
          {/* Video Gallery - Timeline UX */}
          <section className="space-y-12 animate-fade-up">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-black">Sua Jornada Aniko</h1>
                <p className="text-slate-400 font-medium mt-1">Acompanhe as animações criadas para {profile.child_name || "seu filho"}</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-sm border border-slate-100">
                <div className="h-2 w-2 rounded-full bg-brand-accent animate-pulse" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{videos.length} Vídeos</span>
              </div>
            </div>
            
            <div className="relative space-y-16 pl-4 md:pl-8">
              {/* Vertical Timeline Line */}
              <div className="absolute left-[21px] md:left-[37px] top-4 bottom-4 w-1 bg-gradient-to-b from-brand-accent/40 via-brand-secondary/20 to-transparent rounded-full" />

              {loading ? (
                <div className="py-20 text-center text-slate-400 font-bold animate-pulse">Carregando sua linha do tempo...</div>
              ) : videos.length > 0 ? (
                videos.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((v, i) => {
                  const titleLower = (v.title || '').toLowerCase();
                  const thumb = v.thumbnail_url || (
                    (v.video_url && v.video_url.includes('cloudinary.com')) 
                      ? v.video_url.replace(/\.(mp4|mov|webm)$/i, '.jpg') 
                      : (
                          titleLower.includes('bluey') ? '/assets/drawings/bluey.jpg' :
                          titleLower.includes('daniel') ? '/assets/drawings/daniel.jpg' :
                          titleLower.includes('caillou') ? '/assets/drawings/caillou.jpg' :
                          titleLower.includes('luna') ? '/assets/drawings/luna.webp' :
                          titleLower.includes('arthur') ? '/assets/drawings/arthur.jpg' :
                          titleLower.includes('octonaut') ? '/assets/drawings/octonauts.jpg' :
                          titleLower.includes('peixonauta') ? '/assets/drawings/peixonauta.jpg' :
                          titleLower.includes('kratts') || titleLower.includes('irmãos kratts') ? '/assets/drawings/kratts.jpg' : null
                        )
                  );
                  const isLatest = i === 0;

                  return (
                    <div key={v.id} className="relative group">
                      {/* Timeline Dot */}
                      <div className={`absolute left-[-24px] md:left-[-40px] top-6 h-10 w-10 rounded-full border-4 border-slate-50 flex items-center justify-center z-10 transition-transform group-hover:scale-110 shadow-lg ${isLatest ? 'bg-brand-accent animate-pulse' : 'bg-white'}`}>
                        {isLatest ? <Sparkles className="h-5 w-5 text-white" /> : <CheckCircle2 className="h-5 w-5 text-brand-secondary" />}
                      </div>

                      <div className="bg-white rounded-[3rem] p-8 md:p-10 shadow-xl border border-white hover:shadow-2xl transition-all relative overflow-hidden group/item">
                        {/* Status Ribbon */}
                        <div className={`absolute top-0 right-10 px-6 py-2 rounded-b-2xl text-[10px] font-black uppercase tracking-widest text-white z-10 ${v.status === 'alteracao_solicitada' ? 'bg-amber-500' : 'bg-brand-secondary'}`}>
                          {v.status === 'alteracao_solicitada' ? 'Ajuste em Curso' : 'Entregue'}
                        </div>

                        <div className="grid lg:grid-cols-[1fr_350px] gap-10">
                          {/* Video Section */}
                          <div className="space-y-6">
                            <div className="flex items-center justify-between">
                              <div>
                                  <div className="flex flex-wrap gap-2 mb-3">
                                    {v.category && (
                                      <span className="px-3 py-1 bg-brand-secondary/10 text-brand-secondary rounded-lg text-[10px] font-black uppercase tracking-wider border border-brand-secondary/20">
                                        {v.category}
                                      </span>
                                    )}
                                    {v.tags && v.tags.split(',').map((tag: string, idx: number) => {
                                      const t = tag.trim().toLowerCase();
                                      let colorClass = "bg-slate-50 text-slate-500 border-slate-200";
                                      
                                      if (t.includes('educação')) colorClass = "bg-blue-50 text-blue-500 border-blue-100";
                                      else if (t.includes('alimentação')) colorClass = "bg-orange-50 text-orange-500 border-orange-100";
                                      else if (t.includes('família')) colorClass = "bg-purple-50 text-purple-500 border-purple-100";
                                      else if (t.includes('higiene')) colorClass = "bg-teal-50 text-teal-500 border-teal-100";
                                      else if (t.includes('social')) colorClass = "bg-emerald-50 text-emerald-500 border-emerald-100";

                                      return (
                                        <span key={idx} className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg border ${colorClass}`}>
                                          {tag.trim()}
                                        </span>
                                      );
                                    })}
                                  </div>
                                <h3 className="text-2xl font-black text-brand-primary">{v.title}</h3>
                                <p className="text-slate-400 font-bold text-sm">{new Date(v.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                              </div>
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => { setActiveAlterationId(v.id); setAlterationText(v.requested_alteration || ""); }}
                                  className="p-3 bg-slate-50 text-slate-400 hover:text-brand-accent hover:bg-brand-accent/5 rounded-2xl transition-all"
                                  title="Solicitar Ajuste"
                                >
                                  <RefreshCcw className="h-5 w-5" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteVideo(v.id)}
                                  className="p-3 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                                  title="Excluir"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                                </button>
                              </div>
                            </div>
                            
                            {!v.response_score && (
                              <div className="bg-brand-accent/10 border border-brand-accent/20 px-6 py-3 rounded-2xl flex items-center gap-3 animate-pulse">
                                <span className="text-xl">⭐</span>
                                <div>
                                  <p className="text-[10px] font-black text-brand-accent uppercase tracking-[0.2em] leading-none mb-1">Feedback Pendente</p>
                                  <p className="text-sm font-bold text-brand-primary">Sua avaliação é muito importante para nós!</p>
                                </div>
                              </div>
                            )}
 
                            <div className="group/video relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-slate-50">
                              {thumb ? (
                                <img src={thumb} alt={v.title} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover/video:scale-105" />
                              ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary to-brand-secondary" />
                              )}
                              <div className="absolute inset-0 bg-black/20 group-hover/video:bg-black/40 transition-colors flex items-center justify-center">
                                <button 
                                  onClick={() => handleOpenVideo(v.video_url)}
                                  className="h-20 w-20 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/50 flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all group/play"
                                >
                                  <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center shadow-xl group-hover/play:bg-brand-accent transition-all duration-500">
                                    <Play className="h-7 w-7 text-brand-accent group-hover/play:text-white fill-current ml-1 transition-colors" />
                                  </div>
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Feedback & Interaction Section */}
                          <div className="flex flex-col justify-between space-y-8 bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100">
                            <div className="space-y-6">
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-black text-brand-primary flex items-center gap-2">
                                    <Star className="h-5 w-5 text-brand-accent fill-brand-accent" />
                                    Avaliação
                                  </h4>
                                  <span className={`text-xl font-black ${v.response_score >= 8 ? 'text-green-500' : v.response_score >= 5 ? 'text-amber-500' : 'text-slate-400'}`}>
                                    {v.response_score || 0}/10
                                  </span>
                                </div>
                                <div className="flex gap-1.5">
                                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                                    <button
                                      key={star}
                                      onClick={() => { setFeedbackScore(star); handleRate(v.id, star, v.feedback || ""); }}
                                      className={`flex-1 h-8 rounded-lg transition-all ${star <= (v.response_score || 0) ? 'bg-brand-accent shadow-glow-accent' : 'bg-white border border-slate-100 hover:border-brand-accent/30'}`}
                                    />
                                  ))}
                                </div>
                              </div>

                              <div className="space-y-3">
                                <h4 className="font-black text-brand-primary flex items-center gap-2">
                                  <MessageSquare className="h-5 w-5 text-brand-secondary" />
                                  Comentários
                                </h4>
                                {activeFeedbackId === v.id ? (
                                  <div className="space-y-3 animate-fade-in">
                                    <textarea 
                                      value={feedbackText}
                                      onChange={(e) => setFeedbackText(e.target.value)}
                                      placeholder="O que o(a) pequeno(a) achou?"
                                      className="w-full h-24 p-4 rounded-2xl bg-white border border-slate-200 text-sm outline-none focus:border-brand-accent resize-none shadow-inner"
                                    />
                                    <div className="flex gap-2">
                                      <button onClick={() => setActiveFeedbackId(null)} className="flex-1 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-all">Cancelar</button>
                                      <button 
                                        onClick={() => handleRate(v.id, feedbackScore, feedbackText)}
                                        disabled={isSubmittingFeedback}
                                        className="flex-2 px-6 py-2 bg-brand-primary text-white text-xs font-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg"
                                      >
                                        {isSubmittingFeedback ? 'Salvando...' : 'Salvar'}
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div 
                                    onClick={() => { setActiveFeedbackId(v.id); setFeedbackText(v.feedback || ""); setFeedbackScore(v.response_score || 0); }}
                                    className="p-4 bg-white rounded-2xl border border-slate-100 cursor-pointer hover:border-brand-accent/30 transition-all min-h-[100px] flex flex-col"
                                  >
                                    {v.feedback ? (
                                      <p className="text-sm text-slate-600 leading-relaxed">{v.feedback}</p>
                                    ) : (
                                      <p className="text-sm text-slate-300 italic flex-1 flex items-center justify-center">Clique para deixar um comentário...</p>
                                    )}
                                    {v.feedback && <span className="text-[10px] font-black text-brand-accent uppercase mt-3 self-end">Editar</span>}
                                  </div>
                                )}
                              </div>
                            </div>

                            {v.status === 'alteracao_solicitada' && (
                              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex items-start gap-3">
                                <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                                  <RefreshCcw className="h-4 w-4 animate-spin-slow" />
                                </div>
                                <div>
                                  <p className="text-xs font-black text-amber-700 uppercase tracking-wider">Ajuste Solicitado</p>
                                  <p className="text-[10px] text-amber-600 font-medium line-clamp-2 mt-0.5">{v.requested_alteration}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Modal de Solicitação de Alteração (Inside Timeline for better context) */}
                      {activeAlterationId === v.id && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-primary/40 backdrop-blur-md p-4 animate-fade-in">
                          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-8 md:p-10 space-y-6 animate-scale-up border border-white">
                            <div className="flex justify-between items-center">
                              <h3 className="text-2xl font-black text-brand-primary">Solicitar Alteração</h3>
                              <button onClick={() => setActiveAlterationId(null)} className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200">✕</button>
                            </div>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed">
                              Diga-nos o que você gostaria de ajustar neste vídeo. <br />
                              <span className="text-xs font-bold text-brand-accent uppercase tracking-wider">* Limite de 1 alteração por vídeo personalizado.</span>
                            </p>
                            <textarea 
                              value={alterationText}
                              onChange={(e) => setAlterationText(e.target.value)}
                              placeholder="Ex: Gostaria que o pinguim falasse um pouco mais devagar nesta parte..."
                              className="w-full h-32 px-6 py-4 rounded-3xl bg-slate-50 border-2 border-transparent focus:border-brand-accent focus:bg-white transition-all outline-none text-brand-primary font-medium resize-none shadow-inner"
                            />
                            <div className="flex gap-4">
                              <button onClick={() => setActiveAlterationId(null)} className="flex-1 py-4 font-bold text-slate-400">Cancelar</button>
                              <button 
                                onClick={() => handleRequestAlteration(v.id)}
                                disabled={!alterationText.trim() || isSubmittingAlteration}
                                className="flex-[2] py-4 bg-brand-accent text-white font-black rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all text-lg disabled:opacity-50"
                              >
                                {isSubmittingAlteration ? "Enviando..." : "Enviar Pedido"}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                 <div className="py-20 bg-white rounded-[3rem] border border-dashed border-slate-200 text-center space-y-4">
                    <p className="text-slate-400 font-bold uppercase tracking-widest">Nenhuma animação na sua linha do tempo ainda.</p>
                    <p className="text-sm text-slate-300">Sua jornada começa com a primeira solicitação abaixo!</p>
                 </div>
              )}
            </div>
          </section>

          {/* Video Request Form */}
          <section id="solicitar-video" className="bg-white rounded-[3rem] p-10 shadow-xl border border-white animate-fade-up delay-100 scroll-mt-24">
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

             {/* Cupom de Desconto */}
             <div className="mb-8 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
               {!appliedCoupon ? (
                 <div className="flex flex-col md:flex-row gap-4 items-end">
                   <div className="flex-1 w-full">
                     <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-2">Tem um cupom?</label>
                     <input 
                       type="text"
                       placeholder="Insira o código aqui"
                       className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-slate-200 outline-none focus:border-brand-accent uppercase font-bold"
                       value={couponCode}
                       onChange={(e) => { setCouponCode(e.target.value); setCouponError(""); }}
                     />
                   </div>
                   <button 
                     onClick={handleValidateCoupon}
                     disabled={!couponCode || isValidatingCoupon}
                     className="px-8 py-4 bg-slate-800 text-white font-bold rounded-2xl hover:bg-slate-700 transition-all disabled:opacity-50"
                   >
                     {isValidatingCoupon ? "..." : "Aplicar"}
                   </button>
                 </div>
               ) : (
                 <div className="flex items-center justify-between bg-brand-accent/10 p-4 rounded-2xl border border-brand-accent/20">
                   <div className="flex items-center gap-3">
                     <div className="h-10 w-10 bg-brand-accent rounded-xl flex items-center justify-center text-white text-xl">🎟️</div>
                     <div>
                       <p className="text-xs font-bold text-brand-accent uppercase">Cupom Aplicado!</p>
                       <p className="text-brand-primary font-black">{appliedCoupon.code} (-R$ {appliedCoupon.discount})</p>
                     </div>
                   </div>
                   <button 
                     onClick={() => setAppliedCoupon(null)}
                     className="text-slate-400 hover:text-red-500 font-bold text-sm"
                   >
                     Remover
                   </button>
                 </div>
               )}
               {couponError && <p className="mt-2 ml-2 text-red-500 text-xs font-bold">{couponError}</p>}
             </div>

             <div className="flex flex-col md:flex-row gap-4">
               <button 
                  onClick={handleRequest}
                  disabled={!requestText || paymentLoading}
                  className="disabled:opacity-50 flex-1 px-10 py-5 bg-brand-accent text-white font-black rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all text-lg"
               >
                  {paymentLoading ? "Gerando PIX..." : `Enviar Solicitação ${appliedCoupon ? `(R$ ${80 - appliedCoupon.discount})` : '(R$ 80)'}`}
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

          {/* Progress Section */}
          <section className="bg-white rounded-[3rem] p-10 shadow-xl border border-white animate-fade-up delay-200">
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                   <div className="h-10 w-10 rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                      <TrendingUp className="h-5 w-5" />
                   </div>
                   <h3 className="text-2xl font-black">Gráfico de Resposta</h3>
                </div>
                <div className="hidden md:flex gap-2">
                   <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
                      <div className="h-2 w-2 rounded-full bg-brand-accent" /> Notas Individuais
                   </span>
                </div>
             </div>
             
              <div className="w-full">
                {videos.length > 0 ? (
                  <GraficoRespostaCustom videos={videos} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-slate-300">
                    <TrendingUp className="h-10 w-10 opacity-20" />
                    <p className="text-sm font-bold uppercase tracking-widest mt-2">Aguardando avaliações...</p>
                  </div>
                )}
              </div>
             
              {videos.length > 0 && (
                <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
                   <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Média de Resposta</p>
                      <p className="text-xl font-black text-brand-primary">
                         {(() => {
                           const videosComNota = videos.filter(v => v.response_score !== null && v.response_score !== undefined);
                           if (videosComNota.length === 0) return '-';
                           const media = videosComNota.reduce((acc, v) => acc + v.response_score, 0) / videosComNota.length;
                           return `${media.toFixed(1)}/10`;
                         })()}
                      </p>
                   </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                     <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Total de Vídeos</p>
                     <p className="text-xl font-black text-brand-primary">{videos.length}</p>
                  </div>
               </div>
             )}
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

            {/* Histórico da Criança */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-[3rem] p-8 shadow-xl border border-purple-200/50">
               <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                     <span className="text-2xl">📖</span>
                     <h3 className="text-lg font-black text-brand-primary">Sobre {profile.child_name?.split(' ')[0] || 'a criança'}</h3>
                  </div>
                  {profile.historico && (
                    <button 
                      onClick={() => setIsEditModalOpen(true)}
                      className="text-purple-500 hover:text-purple-600 text-xs font-bold"
                    >
                      ✏️ Editar
                    </button>
                  )}
               </div>
               {profile.historico ? (
                 <div className="bg-white/70 rounded-2xl p-5">
                   <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                     {historicoExpandido || profile.historico.length <= 150 
                       ? profile.historico 
                       : profile.historico.slice(0, 150) + '...'}
                   </p>
                   {profile.historico.length > 150 && (
                     <button 
                       onClick={() => setHistoricoExpandido(!historicoExpandido)}
                       className="mt-2 text-purple-500 hover:text-purple-600 text-sm font-bold"
                     >
                       {historicoExpandido ? 'Ver menos' : 'Ver completo'}
                     </button>
                   )}
                 </div>
               ) : (
                 <div className="text-center py-4">
                   <p className="text-slate-500 text-sm mb-4">Conte um pouco sobre {profile.child_name?.split(' ')[0] || 'a criança'} para ajudarmos a criar animações ainda mais personalizadas!</p>
                   <button 
                     onClick={() => setIsEditModalOpen(true)}
                     className="px-6 py-2 bg-purple-500 text-white font-bold rounded-full text-sm hover:bg-purple-600 transition-all"
                   >
                     + Adicionar História
                   </button>
                 </div>
               )}
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

                {/* Histórico field */}
                <div>
                  <label className="block text-sm font-bold text-purple-400 uppercase tracking-widest mb-3 ml-2 flex items-center gap-2">
                    <span>📖</span> Conte-nos sobre {editFormData.child_name?.split(' ')[0] || 'a criança'}
                  </label>
                  <textarea 
                    value={editFormData.historico}
                    onChange={(e) => setEditFormData({ ...editFormData, historico: e.target.value })}
                    placeholder="Ex: João adora animais, especialmente dogs. Tem 6 anos, é muito curioso e gosta de histórias sobre amizade. Já assistiu muito Bluey e Daniel Tigre..."
                    className="w-full px-6 py-4 rounded-2xl bg-purple-50 border-2 border-transparent focus:border-purple-400 focus:bg-white transition-all outline-none text-brand-primary font-bold shadow-inner min-h-[120px]"
                  />
                  <p className="text-[10px] text-slate-400 mt-2 italic ml-2">* Isso nos ajuda a criar animações ainda mais personalizadas!</p>
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
