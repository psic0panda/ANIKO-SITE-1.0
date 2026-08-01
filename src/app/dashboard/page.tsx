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
import PedagogicalPdfModal from "@/components/PedagogicalPdfModal";
import { Share2, Copy, Gift, FileText, Download, MessageCircle, Camera, Mail } from "lucide-react";

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

  // Estado de Navegação por Abas no Dashboard
  const [activeTab, setActiveTab] = useState<'timeline' | 'profile' | 'subscription' | 'referral'>('timeline');

  // Estado para Guia Pedagógico PDF, Compartilhamento e Link de Indicação
  const [pdfModalVideo, setPdfModalVideo] = useState<any>(null);
  const [shareModalVideo, setShareModalVideo] = useState<any>(null);
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [inputReferralCode, setInputReferralCode] = useState("");
  const [isActivatingReferral, setIsActivatingReferral] = useState(false);
  const [referralMsg, setReferralMsg] = useState("");
  const [referralErrorMsg, setReferralErrorMsg] = useState("");

  // Estado para Solicitações em Produção (Progresso das 4 Etapas)
  const [activeRequests, setActiveRequests] = useState<any[]>([]);

  // Estados para Gestão de Assinatura, Cartão e Cancelamento
  const [payments, setPayments] = useState<any[]>([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  const [showCardModal, setShowCardModal] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState("");
  const [newCardHolder, setNewCardHolder] = useState("");
  const [newCardExpiry, setNewCardExpiry] = useState("");
  const [newCardCvv, setNewCardCvv] = useState("");
  const [isUpdatingCard, setIsUpdatingCard] = useState(false);

  const handleCancelSubscription = async () => {
    if (!user) return;
    setIsCancelling(true);
    try {
      await supabase
        .from("profiles")
        .update({ subscription_status: "cancelled" })
        .eq("id", user.id);

      setProfile((prev: any) => ({ ...prev, subscription_status: "cancelled" }));
      alert("Sua assinatura foi solicitada para cancelamento. Seu saldo de créditos continuará disponível!");
      setShowCancelModal(false);
    } catch (err: any) {
      alert("Erro ao cancelar: " + err.message);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleUpdateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardNumber || !user) return;
    setIsUpdatingCard(true);

    try {
      const lastFour = newCardNumber.replace(/\s/g, "").slice(-4);
      await supabase
        .from("profiles")
        .update({ 
          card_last_four: lastFour,
          card_brand: "Mastercard"
        })
        .eq("id", user.id);

      setProfile((prev: any) => ({ ...prev, card_last_four: lastFour }));
      alert("✅ Dados do cartão de crédito atualizados com sucesso!");
      setShowCardModal(false);
    } catch (err: any) {
      alert("Erro ao atualizar cartão: " + err.message);
    } finally {
      setIsUpdatingCard(false);
    }
  };

  const handleActivateReferralCode = async () => {
    if (!inputReferralCode.trim() || isActivatingReferral || !user) return;
    setIsActivatingReferral(true);
    setReferralMsg("");
    setReferralErrorMsg("");

    try {
      const res = await fetch("/api/activate-referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          referral_code: inputReferralCode.trim(),
        }),
      });
      const data = await res.json();

      if (data.success) {
        setReferralMsg(data.message);
        setProfile((prev: any) => ({ ...prev, used_referral_code: inputReferralCode.trim().toUpperCase() }));
        setInputReferralCode("");
      } else {
        setReferralErrorMsg(data.error || "Erro ao ativar código.");
      }
    } catch (e) {
      setReferralErrorMsg("Erro de conexão ao ativar código.");
    } finally {
      setIsActivatingReferral(false);
    }
  };

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

      // Buscar solicitações em andamento/produção do usuário
      try {
        const { data: userReqs } = await supabase
          .from('video_requests')
          .select('*')
          .eq('profile_id', user.id)
          .neq('status', 'concluido')
          .order('created_at', { ascending: false });

        if (userReqs) setActiveRequests(userReqs);
      } catch (e) {
        console.error('Erro ao buscar solicitações em andamento:', e);
      }

      // Buscar histórico de pagamentos/faturas do usuário
      try {
        const { data: userPayments } = await supabase
          .from("payments")
          .select("*")
          .eq("profile_id", user.id)
          .order("created_at", { ascending: false });

        if (userPayments) setPayments(userPayments);
      } catch (e) {
        console.error('Erro ao buscar pagamentos:', e);
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
      
      const finalOptions = Array.from(new Set([...editFormData.preferences, ...selected]));
      setAvailablePreferences(finalOptions.sort());
    }
  }, [isEditModalOpen]);


  // 2. Iniciar Fluxo de Pagamento (Interceptor de Solicitação)
  const handleRequest = async () => {
    if (!requestText || !user) return;

    // ✅ SE TEM CRÉDITOS: usar um crédito diretamente, sem pagamento
    const userCredits = profile?.video_credits || 0;
    if (userCredits > 0) {
      setPaymentLoading(true);
      try {
        // Descontar 1 crédito do perfil via API segura
        const creditRes = await fetch('/api/admin/perfil/' + user.id + '/editar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-admin-key': 'aniko_admin_segredo_2026' },
          body: JSON.stringify({ video_credits: userCredits - 1 }),
        });

        // Inserir a solicitação diretamente
        const { error: reqError } = await supabase
          .from('video_requests')
          .insert([{
            description: requestText,
            status: 'pendente',
            profile_id: user.id,
          }]);

        if (reqError) throw new Error(reqError.message);

        // Atualizar créditos localmente na tela
        setProfile((prev: any) => ({ ...prev, video_credits: userCredits - 1 }));
        setSuccess(true);
        setRequestText('');
        setTimeout(() => setSuccess(false), 4000);
      } catch (err: any) {
        alert('Erro ao usar crédito: ' + err.message);
      } finally {
        setPaymentLoading(false);
      }
      return;
    }

    // SEM CRÉDITOS: vai para o fluxo de pagamento
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
        setRequestText('');
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
      alert('Erro ao gerar pagamento: ' + err.message);
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
      <nav className="w-full bg-white/90 dark:bg-[#070E1B]/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-3 sm:px-8 py-3 sticky top-0 z-30 shadow-sm">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Logo e Botão Principal */}
          <div className="flex items-center justify-between w-full sm:w-auto gap-3">
            <Link href="/" className="flex items-center gap-2.5">
               <Image src="/assets/logo.jpeg" alt="Logo" width={34} height={34} className="rounded-xl shadow-md border-2 border-brand-secondary/20" />
               <span className="text-base sm:text-lg font-black tracking-tight text-brand-primary dark:text-white uppercase">ANIKO</span>
            </Link>

            <button 
              onClick={() => {
                setActiveTab('timeline');
                setTimeout(() => {
                  document.getElementById('solicitar-video')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-brand-accent text-white font-black rounded-xl shadow-md hover:scale-105 active:scale-95 transition-all text-xs"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Solicitar Vídeo</span>
            </button>
          </div>

          {/* Abas de Navegação no Topo */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl w-full sm:w-auto overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap flex-1 sm:flex-initial justify-center ${
                activeTab === 'timeline'
                  ? 'bg-white dark:bg-[#0F1F35] text-brand-primary dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-brand-primary dark:hover:text-white'
              }`}
            >
              <span>🎬</span>
              <span>Animações</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap flex-1 sm:flex-initial justify-center ${
                activeTab === 'profile'
                  ? 'bg-white dark:bg-[#0F1F35] text-brand-primary dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-brand-primary dark:hover:text-white'
              }`}
            >
              <span>🧒</span>
              <span>Perfil</span>
            </button>

            <button
              onClick={() => setActiveTab('subscription')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap flex-1 sm:flex-initial justify-center ${
                activeTab === 'subscription'
                  ? 'bg-white dark:bg-[#0F1F35] text-brand-primary dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-brand-primary dark:hover:text-white'
              }`}
            >
              <span>💳</span>
              <span>Assinatura ({profile?.video_credits || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('referral')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap flex-1 sm:flex-initial justify-center ${
                activeTab === 'referral'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-emerald-700 dark:hover:text-emerald-400'
              }`}
            >
              <span>🎁</span>
              <span>Indicação</span>
            </button>
          </div>

          {/* Sair */}
          <div className="hidden md:flex items-center gap-3">
             <button 
               onClick={() => { supabase.auth.signOut(); window.location.href = "/"; }}
               className="px-4 py-2 bg-slate-100 text-brand-primary font-bold rounded-xl hover:bg-slate-200 transition-all text-xs"
             >
               Sair da Conta
             </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 md:px-8 py-10">
        
        {/* ABA 1: LINHA DO TEMPO & SOLICITAÇÕES */}
        {activeTab === 'timeline' && (
          <div className="space-y-12 animate-fade-in">
            {/* Video Gallery - Timeline UX */}
            <section className="space-y-12">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl md:text-4xl font-black">Sua Jornada Aniko</h1>
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

              {/* CARDS DE SOLICITAÇÕES EM PRODUÇÃO (STEPPER DE 4 ETAPAS) */}
              {activeRequests.length > 0 && activeRequests.map((req) => {
                const stage = (req.current_stage || req.status || 'roteiro').toLowerCase();
                const stageNum = (stage === 'concluido' || stage === '4') ? 4 : (stage === 'edicao' || stage === '3') ? 3 : (stage === 'voz' || stage === '2') ? 2 : 1;

                return (
                  <div key={req.id} className="relative group animate-fade-in">
                    <div className="absolute left-[-24px] md:left-[-40px] top-6 h-10 w-10 rounded-full border-4 border-slate-50 flex items-center justify-center z-10 bg-brand-accent animate-pulse shadow-lg">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>

                    <div className="bg-gradient-to-br from-[#0F2B48] via-[#163D63] to-[#041628] rounded-[3rem] p-8 md:p-10 shadow-2xl border-2 border-brand-accent/40 text-white space-y-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <span className="px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-brand-accent/20 text-brand-accent border border-brand-accent/30 inline-flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-brand-accent animate-pulse" />
                            Animação em Produção
                          </span>
                          <h3 className="text-xl md:text-2xl font-black mt-2 text-white">
                            &quot;{req.description}&quot;
                          </h3>
                        </div>
                        <span className="text-xs text-slate-300 font-bold bg-white/10 px-4 py-2 rounded-2xl border border-white/10">
                          Solicitado em {new Date(req.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>

                      {/* STEPPER VISUAL DAS 4 ETAPAS */}
                      <div className="pt-4 border-t border-white/10 space-y-4">
                        <p className="text-xs font-black uppercase tracking-wider text-slate-300">
                          Progresso de Criação da Animação:
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {/* Etapa 1: Roteiro */}
                          <div className={`p-4 rounded-2xl border transition-all text-center space-y-1 ${
                            stageNum >= 1
                              ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-md'
                              : 'bg-white/5 border-white/10 text-slate-400 opacity-50'
                          }`}>
                            <span className="text-xl block">📝</span>
                            <p className="font-black text-xs">1. Roteiro</p>
                            <p className="text-[10px] text-slate-300">Criação da história</p>
                          </div>

                          {/* Etapa 2: Voz */}
                          <div className={`p-4 rounded-2xl border transition-all text-center space-y-1 ${
                            stageNum >= 2
                              ? 'bg-blue-500/20 border-blue-500/50 text-blue-300 shadow-md'
                              : 'bg-white/5 border-white/10 text-slate-400 opacity-50'
                          }`}>
                            <span className="text-xl block">🎙️</span>
                            <p className="font-black text-xs">2. Voz (TTS)</p>
                            <p className="text-[10px] text-slate-300">Narração adaptada</p>
                          </div>

                          {/* Etapa 3: Edição */}
                          <div className={`p-4 rounded-2xl border transition-all text-center space-y-1 ${
                            stageNum >= 3
                              ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 shadow-md'
                              : 'bg-white/5 border-white/10 text-slate-400 opacity-50'
                          }`}>
                            <span className="text-xl block">🎨</span>
                            <p className="font-black text-xs">3. Edição</p>
                            <p className="text-[10px] text-slate-300">Edição da animação</p>
                          </div>

                          {/* Etapa 4: Concluído */}
                          <div className={`p-4 rounded-2xl border transition-all text-center space-y-1 ${
                            stageNum >= 4
                              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-md'
                              : 'bg-white/5 border-white/10 text-slate-400 opacity-50'
                          }`}>
                            <span className="text-xl block">🎉</span>
                            <p className="font-black text-xs">4. Concluído</p>
                            <p className="text-[10px] text-slate-300">Pronto para assistir</p>
                          </div>
                        </div>

                        {/* Mensagem Explicativa Dinâmica do Status Atual */}
                        <div className="bg-white/10 p-4 rounded-2xl border border-white/10 text-xs text-slate-200 flex items-center gap-3">
                          <span className="text-lg">💡</span>
                          <span>
                            {stageNum === 1 && "O roteiro e a história da animação estão sendo criados e adaptados para o pedido."}
                            {stageNum === 2 && "A narração com tom de voz adaptado está sendo gravada."}
                            {stageNum === 3 && "A animação e os efeitos visuais estão em processo de edição."}
                            {stageNum === 4 && "Animação concluída! O vídeo aparecerá na linha do tempo abaixo."}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

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
                    <div key={v.id} className="relative group max-w-md sm:max-w-4xl mx-auto w-full my-6">
                      {/* Card Principal: Vertical Reels no Mobile / Horizontal no Web Desktop */}
                      <div className="relative bg-[#070E1B] rounded-[2.5rem] overflow-hidden shadow-2xl border-2 border-slate-800 aspect-[9/16] sm:aspect-video min-h-[520px] sm:min-h-[460px] flex items-center justify-center group/reels">
                        {/* Imagem de Capa do Vídeo */}
                        {thumb ? (
                          <img src={thumb} alt={v.title} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover/reels:scale-105 transition-transform duration-700" />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-[#0F2B48] via-[#163D63] to-[#070E1B]" />
                        )}

                        {/* Sombras e Degradês do Reels */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/50 pointer-events-none" />

                        {/* Botão de Play Centralizado */}
                        <button 
                          onClick={() => handleOpenVideo(v.video_url)}
                          className="relative z-10 h-20 w-20 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/50 flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all group/play"
                        >
                          <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center shadow-xl group-hover/play:bg-brand-accent transition-colors duration-300">
                            <Play className="h-7 w-7 text-brand-accent group-hover/play:text-white fill-current ml-1 transition-colors" />
                          </div>
                        </button>

                        {/* Overlay de Informações (Canto Inferior Esquerdo) */}
                        <div className="absolute bottom-6 left-5 right-20 z-20 space-y-2 text-left text-white pointer-events-none">
                          <div className="flex flex-wrap gap-1.5 pointer-events-auto">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-md ${v.status === 'alteracao_solicitada' ? 'bg-amber-500' : 'bg-emerald-500'}`}>
                              {v.status === 'alteracao_solicitada' ? '⏳ Ajuste em Curso' : '✨ Entregue'}
                            </span>
                            {v.category && (
                              <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white rounded-full text-[10px] font-black uppercase tracking-wider border border-white/30">
                                {v.category}
                              </span>
                            )}
                          </div>

                          <h3 className="text-xl sm:text-2xl font-black drop-shadow-md leading-tight text-white">{v.title}</h3>
                          <p className="text-xs font-bold text-slate-300 drop-shadow-sm">
                            {new Date(v.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                          </p>
                        </div>

                        {/* Barra de Ações Flutuantes Estilo Reels (Canto Direito Limpo sem Textos) */}
                        <div className="absolute right-3.5 bottom-6 z-20 flex flex-col items-center gap-3.5 text-white">
                          {/* ⭐ Avaliação / Nota (Mantém a pontuação num visual minimalista) */}
                          <button 
                            onClick={() => { setActiveFeedbackId(activeFeedbackId === v.id ? null : v.id); setFeedbackText(v.feedback || ""); setFeedbackScore(v.response_score || 0); }}
                            className="group/action flex flex-col items-center gap-0.5 focus:outline-none"
                            title="Avaliar vídeo"
                          >
                            <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-black/60 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg group-hover/action:scale-110 group-hover/action:bg-brand-accent transition-all">
                              <Star className={`h-5 w-5 ${v.response_score ? 'text-amber-400 fill-amber-400' : 'text-white'}`} />
                            </div>
                            <span className="text-[10px] font-black tracking-wider drop-shadow-md">
                              {v.response_score ? `${v.response_score}/10` : 'Nota'}
                            </span>
                          </button>

                          {/* 💬 Comentário / Feedback */}
                          <button 
                            onClick={() => { setActiveFeedbackId(activeFeedbackId === v.id ? null : v.id); setFeedbackText(v.feedback || ""); setFeedbackScore(v.response_score || 0); }}
                            className="group/action focus:outline-none"
                            title="Deixar Comentário"
                          >
                            <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-black/60 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg group-hover/action:scale-110 group-hover/action:bg-brand-secondary transition-all">
                              <MessageSquare className="h-5 w-5 text-white" />
                            </div>
                          </button>

                          {/* 🔄 Solicitar Ajuste */}
                          <button 
                            onClick={() => { setActiveAlterationId(v.id); setAlterationText(v.requested_alteration || ""); }}
                            className="group/action focus:outline-none"
                            title="Solicitar Ajuste"
                          >
                            <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-black/60 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg group-hover/action:scale-110 group-hover/action:bg-amber-500 transition-all">
                              <RefreshCcw className="h-5 w-5 text-white" />
                            </div>
                          </button>

                          {/* 📘 Guia Pedagógico PDF */}
                          <button 
                            onClick={() => setPdfModalVideo({
                              title: v.title,
                              description: v.description,
                              child_name: profile?.child_name,
                              created_at: v.created_at
                            })}
                            className="group/action focus:outline-none"
                            title="Guia Pedagógico em PDF"
                          >
                            <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-black/60 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg group-hover/action:scale-110 group-hover/action:bg-blue-500 transition-all">
                              <FileText className="h-5 w-5 text-white" />
                            </div>
                          </button>

                          {/* 📤 Compartilhar / Opções do Vídeo */}
                          <button 
                            onClick={() => setShareModalVideo(v)}
                            className="group/action focus:outline-none"
                            title="Compartilhar / Baixar Vídeo"
                          >
                            <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-black/60 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg group-hover/action:scale-110 group-hover/action:bg-emerald-500 transition-all">
                              <Share2 className="h-5 w-5 text-white" />
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Gaveta de Avaliação & Comentários (Acionada pelos botões do Reels) */}
                      {activeFeedbackId === v.id && (
                        <div className="mt-4 p-6 bg-white dark:bg-[#0F1F35] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-scale-up text-left">
                          <div className="flex justify-between items-center">
                            <h4 className="font-black text-brand-primary dark:text-white text-base flex items-center gap-2">
                              <Star className="text-amber-400 fill-amber-400" size={18} />
                              <span>Avaliação & Comentário do Responsável</span>
                            </h4>
                            <button onClick={() => setActiveFeedbackId(null)} className="text-slate-400 hover:text-white font-bold p-1">✕</button>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sua nota de 1 a 10:</label>
                            <div className="grid grid-cols-10 gap-1 w-full">
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                                <button
                                  key={star}
                                  onClick={() => setFeedbackScore(star)}
                                  className={`h-8 rounded-lg font-bold text-xs transition-all ${
                                    feedbackScore === star
                                      ? 'bg-brand-accent text-white shadow-lg scale-110'
                                      : star <= feedbackScore
                                      ? 'bg-brand-accent/40 text-white'
                                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200'
                                  }`}
                                >
                                  {star}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Seu Comentário / Relato dos Pais:</label>
                            <textarea
                              value={feedbackText}
                              onChange={(e) => setFeedbackText(e.target.value)}
                              placeholder="Conte para a nossa equipe como a criança reagiu ao vídeo..."
                              className="w-full h-24 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-brand-primary dark:text-white outline-none focus:border-brand-accent resize-none font-medium"
                            />
                          </div>

                          <div className="flex justify-end gap-3 pt-2">
                            <button onClick={() => setActiveFeedbackId(null)} className="px-4 py-2 text-xs font-bold text-slate-400">Cancelar</button>
                            <button
                              onClick={() => handleRate(v.id, feedbackScore, feedbackText)}
                              disabled={isSubmittingFeedback}
                              className="px-6 py-2.5 bg-brand-accent text-white font-black rounded-xl shadow-lg hover:scale-105 transition-all text-xs disabled:opacity-50"
                            >
                              {isSubmittingFeedback ? 'Salvando...' : 'Salvar Avaliação'}
                            </button>
                          </div>
                        </div>
                      )}

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
               {paymentLoading 
                 ? (profile?.video_credits > 0 ? 'Enviando...' : 'Gerando PIX...')
                 : profile?.video_credits > 0
                   ? `✨ Enviar Solicitação (usar 1 crédito)`
                   : `Enviar Solicitação ${appliedCoupon ? `(R$ ${80 - appliedCoupon.discount})` : '(R$ 80)'}`
               }
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
        )}

        {/* ABA 2: PERFIL DA CRIANÇA */}
        {activeTab === 'profile' && (
          <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
            <div className="bg-brand-primary rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-[-10%] right-[-10%] w-48 h-48 bg-white/10 rounded-full blur-3xl" />
               <div className="flex flex-col items-center text-center">
                  <div className="h-36 w-36 rounded-full border-4 border-white/20 p-2 mb-6 shadow-2xl">
                     <div className="h-full w-full rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                        {profile.avatar_url ? (
                          <img src={`/assets/avatars/avatar_${profile.avatar_url}.png`} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-5xl">🧒</span>
                        )}
                     </div>
                  </div>
                  <h2 className="text-3xl font-black mb-6">{profile.child_name || "Seu Filho"}</h2>
                  <button 
                   onClick={() => setIsEditModalOpen(true)}
                   className="px-8 py-3 bg-white hover:bg-slate-100 text-brand-primary rounded-2xl font-black transition-all text-sm shadow-lg"
                  >
                    ✏️ Editar Perfil & Foto
                  </button>
               </div>
            </div>

            {/* Preferências Ativas */}
            <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100">
               <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                 <span>⭐</span> Preferências Ativas
               </h3>
               <div className="flex flex-wrap gap-2.5">
                  {profile.preferences.length > 0 ? profile.preferences.map((int: string, i: number) => (
                     <span key={i} className="px-5 py-2.5 bg-slate-50 text-slate-700 rounded-full text-xs font-bold border border-slate-200 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-brand-accent" />
                        {int}
                     </span>
                  )) : (
                    <p className="text-sm text-slate-400 italic">Nenhuma preferência selecionada ainda.</p>
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
                  <button 
                    onClick={() => setIsEditModalOpen(true)}
                    className="text-purple-600 hover:text-purple-700 text-xs font-bold"
                  >
                    ✏️ Editar
                  </button>
               </div>
               {profile.historico ? (
                 <div className="bg-white/80 rounded-2xl p-6 shadow-sm">
                   <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                     {profile.historico}
                   </p>
                 </div>
               ) : (
                 <div className="text-center py-6">
                   <p className="text-slate-500 text-sm mb-4">Conte um pouco sobre {profile.child_name?.split(' ')[0] || 'a criança'} para ajudarmos a criar animações ainda mais personalizadas!</p>
                   <button 
                     onClick={() => setIsEditModalOpen(true)}
                     className="px-6 py-3 bg-purple-600 text-white font-black rounded-2xl text-xs hover:bg-purple-700 transition-all shadow-md"
                   >
                     + Adicionar História
                   </button>
                 </div>
               )}
            </div>
          </div>
        )}

        {/* ABA 3: MINHA ASSINATURA & GESTÃO FINANCEIRA */}
        {activeTab === 'subscription' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            
            {/* Header da Aba */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-3xl font-black text-brand-primary">Gestão da Assinatura</h2>
                <p className="text-slate-500 font-medium text-xs mt-1">
                  Gerencie seus créditos, dados do titular, cartão cadastrado e histórico de compras.
                </p>
              </div>
              <Link
                href="/pagamento"
                className="px-6 py-3 rounded-2xl bg-brand-accent hover:bg-brand-accent/90 text-white font-black text-xs shadow-lg hover:scale-105 transition-all flex items-center gap-2"
              >
                <span>✨ Assinar Plano ou Recarregar</span>
              </Link>
            </div>

            {/* Dados do Titular da Conta */}
            <div className="bg-white rounded-3xl p-6 border-2 border-slate-100 shadow-xl space-y-4">
              <h3 className="text-lg font-black text-brand-primary flex items-center gap-2 border-b pb-3 border-slate-100">
                <span>👤</span> Dados do Titular da Conta
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-slate-400 font-bold uppercase text-[10px]">Nome do Responsável</p>
                  <p className="font-bold text-slate-800 text-sm mt-0.5">{profile.parent_name || 'Não informado'}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-slate-400 font-bold uppercase text-[10px]">E-mail de Cobrança</p>
                  <p className="font-bold text-slate-800 text-sm mt-0.5 truncate">{user?.email || 'Não informado'}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-slate-400 font-bold uppercase text-[10px]">Telefone / WhatsApp</p>
                  <p className="font-bold text-slate-800 text-sm mt-0.5">{profile.phone || 'Não informado'}</p>
                </div>
              </div>
            </div>

            {/* Card Principal da Assinatura Ativa & Créditos */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Plano & Status */}
              <div className="bg-gradient-to-br from-[#0F2B48] via-[#163D63] to-[#041628] rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">Plano Contratado</p>
                      <h3 className="text-2xl font-black text-white mt-0.5">{profile.plan_name || "Plano Avulso"}</h3>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      profile.subscription_status === "active"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : profile.subscription_status === "cancelled"
                        ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                        : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    }`}>
                      {profile.subscription_status === "active" ? "🟢 Ativa" : profile.subscription_status === "cancelled" ? "🔴 Cancelamento Solicitado" : "🟡 Sem Assinatura"}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-white/10 text-xs text-slate-300 space-y-2">
                    <p className="flex justify-between">
                      <span className="text-slate-400">Data de Início:</span>
                      <span className="font-bold font-mono">{new Date(profile.created_at || Date.now()).toLocaleDateString("pt-BR")}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-400">Próxima Renovação:</span>
                      <span className="font-bold font-mono text-brand-accent">{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR")}</span>
                    </p>
                  </div>
                </div>

                {/* Botão de Cancelar Assinatura */}
                {profile.subscription_status === "active" && (
                  <button
                    type="button"
                    onClick={() => setShowCancelModal(true)}
                    className="w-full py-2.5 bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 font-bold rounded-xl text-xs transition-all border border-rose-500/30 text-center"
                  >
                    Solicitar Cancelamento da Assinatura
                  </button>
                )}
              </div>

              {/* Saldo de Créditos */}
              <div className="bg-white rounded-[2.5rem] p-8 border-2 border-slate-100 shadow-xl space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <span className="text-xs font-bold text-slate-400 uppercase">Saldo de Animações</span>
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 text-center space-y-1">
                    <p className="text-xs font-bold text-slate-500 uppercase">Créditos de Vídeo Disponíveis</p>
                    <p className="text-5xl font-black text-brand-primary">{profile.video_credits || 0}</p>
                    <p className="text-[10px] text-slate-400 font-medium">crédito(s) prontos para uso</p>
                  </div>
                </div>

                <Link
                  href="/pagamento"
                  className="w-full py-3.5 bg-brand-primary hover:bg-brand-primary/90 text-white font-black rounded-2xl text-xs shadow-lg text-center block transition-all"
                >
                  Recarregar Mais Créditos
                </Link>
              </div>
            </div>

            {/* Dados do Cartão de Crédito Cadastrado */}
            <div className="bg-white rounded-3xl p-6 border-2 border-slate-100 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-black text-brand-primary flex items-center gap-2">
                    <span>💳</span> Cartão de Crédito Cadastrado
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Forma de pagamento vinculada às renovações automáticas.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCardModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-brand-primary text-white font-black text-xs transition-all shadow-md self-start sm:self-auto"
                >
                  Alterar Cartão de Crédito
                </button>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 max-w-sm">
                <div className="h-10 w-14 bg-slate-900 rounded-xl flex items-center justify-center text-white font-mono font-bold text-[10px] shadow-md">
                  CARD
                </div>
                <div>
                  <p className="font-mono text-sm font-black text-slate-900">
                    •••• •••• •••• {profile?.card_last_four || "4242"}
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">Bandeira: {profile?.card_brand || "Mastercard"}</p>
                </div>
              </div>
            </div>

            {/* Histórico de Compras & Transações */}
            <div className="bg-white rounded-3xl p-6 border-2 border-slate-100 shadow-xl space-y-4">
              <h3 className="text-lg font-black text-brand-primary flex items-center gap-2 border-b border-slate-100 pb-4">
                <span>📄</span> Histórico de Compras & Transações
              </h3>

              {payments.length === 0 ? (
                <div className="text-center py-8 text-slate-400 space-y-1">
                  <p className="font-bold text-xs">Nenhuma compra ou fatura registrada ainda.</p>
                  <p className="text-[10px]">Suas transações efetuadas aparecerão listadas nesta tabela.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                        <th className="py-3 px-3">Data</th>
                        <th className="py-3 px-3">Descrição</th>
                        <th className="py-3 px-3">Método</th>
                        <th className="py-3 px-3">Valor</th>
                        <th className="py-3 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {payments.map((pay) => (
                        <tr key={pay.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 px-3 font-mono font-bold text-slate-700">
                            {new Date(pay.created_at).toLocaleDateString("pt-BR")}
                          </td>
                          <td className="py-3.5 px-3 font-bold text-brand-primary">
                            {pay.description || profile?.plan_name || "Recarga de Créditos Aniko"}
                          </td>
                          <td className="py-3.5 px-3 text-slate-600">
                            {pay.payment_method || "Cartão de Crédito"}
                          </td>
                          <td className="py-3.5 px-3 font-black text-slate-900">
                            R$ {pay.amount || 80},00
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700 uppercase">
                              ✓ Aprovado
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ABA 4: INDICAÇÃO */}
        {activeTab === 'referral' && (
          <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
            <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 rounded-[3rem] p-10 text-white shadow-2xl space-y-8">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl shrink-0">
                  🎁
                </div>
                <div>
                  <h3 className="font-black text-2xl">Programa Indique e Ganhe</h3>
                  <p className="text-xs text-emerald-100 font-medium mt-1">A cada 2 pessoas que ativarem seu código, você ganha 1 Aniko!</p>
                </div>
              </div>

              {/* Código Único */}
              <div className="bg-white/10 p-6 rounded-3xl border border-white/20 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <p className="text-xs text-emerald-200 font-bold uppercase">Seu Código Único de Indicação</p>
                  <p className="text-3xl font-mono font-black tracking-widest text-white mt-1">
                    {user?.id ? user.id.substring(0, 8).toUpperCase() : '------'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    const code = user?.id ? user.id.substring(0, 8).toUpperCase() : '';
                    navigator.clipboard.writeText(code);
                    setCopiedReferral(true);
                    setTimeout(() => setCopiedReferral(false), 3000);
                  }}
                  className="w-full sm:w-auto px-6 py-3 bg-white text-emerald-900 font-black rounded-2xl text-xs hover:bg-emerald-50 transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <Copy size={16} />
                  <span>{copiedReferral ? "Copiado!" : "Copiar Código"}</span>
                </button>
              </div>

              {/* Progresso de Indicações (X / 2) */}
              <div className="bg-emerald-900/40 p-6 rounded-3xl border border-white/10 space-y-3">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-emerald-100">Progresso Atual</span>
                  <span className="text-white font-black text-base">
                    {(profile.referral_count || 0) % 2} / 2 indicações
                  </span>
                </div>
                <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white transition-all duration-500"
                    style={{ width: `${(((profile.referral_count || 0) % 2) / 2) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-emerald-200 text-center font-medium pt-1">
                  Total de amigos que já usaram seu código: <strong>{profile.referral_count || 0}</strong>
                </p>
              </div>

              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Crie sua conta no Aniko (Animações Adaptativas para TEA) e ative o meu código de indicação no seu painel: ${user?.id ? user.id.substring(0, 8).toUpperCase() : ''} - acesse: https://www.aniko.com.br/cadastro`)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-2xl text-sm transition-all flex items-center justify-center gap-2 shadow-xl"
              >
                <Share2 size={18} />
                <span>Enviar Código pelo WhatsApp</span>
              </a>

              {/* Formulário para Ativar Código Recebido de Outra Pessoa */}
              <div className="pt-6 border-t border-white/20 space-y-4">
                <h4 className="text-sm font-black uppercase tracking-wider text-emerald-100">
                  Foi indicado por alguém?
                </h4>

                {profile.used_referral_code ? (
                  <div className="p-4 bg-white/10 border border-white/20 rounded-2xl text-xs font-medium text-emerald-100 flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-300 shrink-0" />
                    <span>Você já ativou o código <strong>{profile.used_referral_code}</strong> nesta conta.</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={inputReferralCode}
                        onChange={(e) => setInputReferralCode(e.target.value.toUpperCase())}
                        placeholder="DIGITE O CÓDIGO DO SEU AMIGO"
                        maxLength={8}
                        className="flex-1 px-5 py-3.5 rounded-2xl bg-white/15 text-white placeholder-emerald-200/60 font-mono text-sm uppercase border border-white/20 focus:outline-none focus:border-white font-bold"
                      />
                      <button
                        onClick={handleActivateReferralCode}
                        disabled={!inputReferralCode.trim() || isActivatingReferral}
                        className="px-6 py-3.5 bg-white text-emerald-900 font-black text-sm rounded-2xl hover:bg-emerald-50 transition-all disabled:opacity-50 shadow-md"
                      >
                        {isActivatingReferral ? "..." : "Ativar"}
                      </button>
                    </div>
                    {referralMsg && <p className="text-xs text-emerald-200 font-bold">{referralMsg}</p>}
                    {referralErrorMsg && <p className="text-xs text-red-300 font-bold">{referralErrorMsg}</p>}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal Guia Pedagógico PDF */}
        <PedagogicalPdfModal 
          isOpen={!!pdfModalVideo} 
          onClose={() => setPdfModalVideo(null)} 
          video={pdfModalVideo} 
        />

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
                      className="w-full text-slate-400 font-bold py-2 hover:text-slate-600 transition-colors"
                   >
                      Cancelar e Voltar
                   </button>
                   
                   <a 
                     href={`https://wa.me/5511999999999?text=${encodeURIComponent('Olá! Tive dificuldades para efetuar o pagamento da minha solicitação no Aniko e gostaria de suporte.')}`}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all text-xs md:text-sm"
                   >
                     <MessageSquare className="h-4 w-4" />
                     <span>Não conseguiu pagar? Fale conosco no WhatsApp</span>
                   </a>
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
      {/* Modal de Confirmação de Cancelamento */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white max-w-md w-full rounded-3xl p-8 space-y-6 shadow-2xl">
            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>🔴</span> Cancelar Assinatura
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Tem certeza que deseja solicitar o cancelamento da sua assinatura? Seu saldo de créditos continuará 100% disponível para uso!
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Motivo do cancelamento (opcional):</label>
              <textarea
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Conte-nos o motivo para podermos melhorar..."
                className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-brand-accent resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs"
              >
                Voltar
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={isCancelling}
                className="flex-1 py-3.5 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black text-xs shadow-md disabled:opacity-50"
              >
                {isCancelling ? "Confirmando..." : "Sim, Cancelar Assinatura"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Alteração dos Dados do Cartão */}
      {showCardModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
          <form onSubmit={handleUpdateCard} className="bg-white max-w-md w-full rounded-3xl p-8 space-y-6 shadow-2xl">
            <h3 className="text-2xl font-black text-brand-primary flex items-center gap-2">
              <span>💳</span> Alterar Cartão de Crédito
            </h3>

            <div className="space-y-4 text-xs font-medium">
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Novo Número do Cartão</label>
                <input
                  type="text"
                  required
                  value={newCardNumber}
                  onChange={(e) => setNewCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
                  placeholder="0000 0000 0000 0000"
                  className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-sm font-bold focus:outline-none focus:border-brand-accent"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Nome no Cartão</label>
                <input
                  type="text"
                  required
                  value={newCardHolder}
                  onChange={(e) => setNewCardHolder(e.target.value.toUpperCase())}
                  placeholder="NOME COMO ESTÁ NO CARTÃO"
                  className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold focus:outline-none focus:border-brand-accent uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Validade</label>
                  <input
                    type="text"
                    required
                    value={newCardExpiry}
                    onChange={(e) => setNewCardExpiry(e.target.value)}
                    placeholder="MM/AA"
                    className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs font-bold focus:outline-none focus:border-brand-accent"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">CVV</label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={newCardCvv}
                    onChange={(e) => setNewCardCvv(e.target.value.replace(/\D/g, ""))}
                    placeholder="123"
                    className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs font-bold focus:outline-none focus:border-brand-accent"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowCardModal(false)}
                className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isUpdatingCard}
                className="flex-1 py-3.5 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-2xl font-black text-xs shadow-md disabled:opacity-50"
              >
                {isUpdatingCard ? "Salvando..." : "Salvar Cartão"}
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Modal de Compartilhamento / Opções do Vídeo (Reels Link Modal) */}
      {shareModalVideo && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#0F1F35] w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl space-y-5 animate-scale-up border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-white">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-lg flex items-center gap-2">
                <Share2 className="text-emerald-500" size={20} />
                <span>Opções da Animação</span>
              </h3>
              <button onClick={() => setShareModalVideo(null)} className="h-8 w-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs font-bold text-slate-400">Opções para o vídeo <strong>&quot;{shareModalVideo.title}&quot;</strong>:</p>

            <div className="grid grid-cols-1 gap-2.5">
              {/* Baixar Vídeo */}
              <a 
                href={shareModalVideo.video_url || '#'} 
                download={`${shareModalVideo.title}.mp4`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 bg-slate-50 dark:bg-slate-900 hover:bg-emerald-500/10 hover:border-emerald-500/30 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-3.5 transition-all text-xs font-black"
              >
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                  <Download size={20} />
                </div>
                <div className="text-left flex-1">
                  <span className="block text-slate-800 dark:text-white">Baixar Vídeo (MP4)</span>
                  <span className="text-[10px] text-slate-400 font-bold">Salvar arquivo no dispositivo</span>
                </div>
              </a>

              {/* Copiar Link */}
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(shareModalVideo.video_url || window.location.href);
                  setCopiedShareLink(true);
                  setTimeout(() => setCopiedShareLink(false), 2000);
                }}
                className="p-3.5 bg-slate-50 dark:bg-slate-900 hover:bg-brand-secondary/10 hover:border-brand-secondary/30 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-3.5 transition-all text-xs font-black text-left w-full"
              >
                <div className="h-10 w-10 rounded-xl bg-brand-secondary/10 text-brand-secondary flex items-center justify-center shrink-0">
                  <Copy size={20} />
                </div>
                <div className="flex-1">
                  <span className="block text-slate-800 dark:text-white">{copiedShareLink ? '✅ Link Copiado!' : 'Copiar Link Direto'}</span>
                  <span className="text-[10px] text-slate-400 font-bold">Copiar URL pública do vídeo</span>
                </div>
              </button>

              {/* WhatsApp */}
              <a 
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Assista à animação adaptativa de ${shareModalVideo.title}: ${shareModalVideo.video_url || window.location.href}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 bg-slate-50 dark:bg-slate-900 hover:bg-green-500/10 hover:border-green-500/30 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-3.5 transition-all text-xs font-black"
              >
                <div className="h-10 w-10 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
                  <MessageCircle size={20} />
                </div>
                <div className="text-left flex-1">
                  <span className="block text-slate-800 dark:text-white">Compartilhar no WhatsApp</span>
                  <span className="text-[10px] text-slate-400 font-bold">Enviar para família ou terapeuta</span>
                </div>
              </a>

              {/* Instagram */}
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`Confira a animação adaptativa de ${shareModalVideo.title}! Criado com carinho na ANIKO ❤️✨ ${shareModalVideo.video_url || window.location.href}`);
                  alert('Texto e link copiados! Agora abra o Instagram e cole nos seus Stories ou Direct.');
                }}
                className="p-3.5 bg-slate-50 dark:bg-slate-900 hover:bg-pink-500/10 hover:border-pink-500/30 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-3.5 transition-all text-xs font-black text-left w-full"
              >
                <div className="h-10 w-10 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center shrink-0">
                  <Camera size={20} />
                </div>
                <div className="flex-1">
                  <span className="block text-slate-800 dark:text-white">Compartilhar no Instagram</span>
                  <span className="text-[10px] text-slate-400 font-bold">Copia mensagem pronta para Stories</span>
                </div>
              </button>

              {/* E-mail */}
              <a 
                href={`mailto:?subject=${encodeURIComponent(`Animação Adaptativa: ${shareModalVideo.title}`)}&body=${encodeURIComponent(`Confira o vídeo de ${shareModalVideo.title}: ${shareModalVideo.video_url || window.location.href}`)}`}
                className="p-3.5 bg-slate-50 dark:bg-slate-900 hover:bg-blue-500/10 hover:border-blue-500/30 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-3.5 transition-all text-xs font-black"
              >
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                  <Mail size={20} />
                </div>
                <div className="text-left flex-1">
                  <span className="block text-slate-800 dark:text-white">Enviar por E-mail</span>
                  <span className="text-[10px] text-slate-400 font-bold">Enviar por correio eletrônico</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
