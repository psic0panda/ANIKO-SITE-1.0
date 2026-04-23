"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  Star, 
  MessageSquare, 
  TrendingUp, 
  ChevronRight, 
  PlayCircle,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

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

function GraficoRespostaAdmin({ videos }: { videos: any[] }) {
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
          <linearGradient id="verdeGradienteAdmin" x1="0" y1="0" x2="0" y2="1">
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

        <path d={areaPath} fill="url(#verdeGradienteAdmin)" />
        
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

export default function AdminClientDashboard({ params }: { params: Promise<{ id: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [requestText, setRequestText] = useState("");
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>({
    child_name: "Carregando...",
    avatar_url: null,
    preferences: [],
    historico: "",
    phone: "",
    email: ""
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [activeFeedbackId, setActiveFeedbackId] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackScore, setFeedbackScore] = useState(0);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [mostrarHistoricoCompleto, setMostrarHistoricoCompleto] = useState(false);
  const router = useRouter();

  useEffect(() => {
    params.then(p => setResolvedParams(p));
  }, [params]);

  useEffect(() => {
    if (!resolvedParams?.id) return;
    
    async function fetchClientData() {
      if (!resolvedParams?.id) return;
      const profileId = resolvedParams.id;
      
      // Buscar dados via API (bypass RLS)
      try {
        // Buscar perfil
        const profileRes = await fetch(`/api/admin/perfil/${profileId}?key=aniko_admin_segredo_2026`);
        const profileData = await profileRes.json();
        if (profileData.profile) {
          setProfile({
            ...profileData.profile,
            preferences: profileData.profile.preferences || []
          });
        }

        // Buscar vídeos
        const videosRes = await fetch(`/api/admin/videos-cliente/${profileId}?key=aniko_admin_segredo_2026`);
        const videosData = await videosRes.json();
        if (videosData.videos) setVideos(videosData.videos);
      } catch (e) {
        console.error('Erro ao buscar dados:', e);
      }
      setLoading(false);
    }
    fetchClientData();
  }, [resolvedParams]);

  const handleSaveProfileAdmin = async () => {
    if (!resolvedParams?.id) return;
    setIsSaving(true);
    
    try {
      const res = await fetch(`/api/admin/perfil/${resolvedParams.id}/editar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'aniko_admin_segredo_2026',
          ...editFormData
        })
      });
      const data = await res.json();
      
      if (data.profile) {
        setProfile({
          ...data.profile,
          preferences: data.profile.preferences || []
        });
        setIsEditModalOpen(false);
      } else {
        alert('Erro ao salvar: ' + (data.error || 'Erro desconhecido'));
      }
    } catch (e) {
      alert('Erro ao salvar perfil');
    }
    setIsSaving(false);
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

  const handleRate = async (videoId: number) => {
    setIsSubmittingFeedback(true);
    const { error } = await supabase
      .from('videos')
      .update({ 
        response_score: feedbackScore,
        feedback: feedbackText,
        rating: Math.ceil(feedbackScore / 2)
      })
      .eq('id', videoId);
    
    if (!error) {
      setVideos(prev => prev.map(v => v.id === videoId ? { 
        ...v, 
        response_score: feedbackScore, 
        feedback: feedbackText,
        rating: Math.ceil(feedbackScore / 2)
      } : v));
      setActiveFeedbackId(null);
      setFeedbackText("");
      setFeedbackScore(0);
    }
    setIsSubmittingFeedback(false);
  };

  const handleUpdateTags = async (videoId: number, tags: string) => {
    const { error } = await supabase
      .from('videos')
      .update({ tags })
      .eq('id', videoId);
    
    if (!error) {
      setVideos(prev => prev.map(v => v.id === videoId ? { ...v, tags } : v));
    } else {
      alert("Erro ao atualizar tags: " + error.message);
    }
  };

  if (!resolvedParams) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-brand-accent border-t-transparent rounded-full"></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-brand-primary pb-20">
      {/* Admin Header */}
      <div className="w-full bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">👑 MODO ADMIN</span>
            <span className="text-sm font-medium">Visualizando dashboard do cliente</span>
          </div>
          <Link 
            href="/admin" 
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-bold transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Admin
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <nav className="w-full bg-white border-b border-slate-100 px-6 py-4 md:px-12 sticky top-0 z-30 shadow-sm">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link href={`/admin/cliente/${resolvedParams.id}`} className="flex items-center gap-3">
             <Image src="/assets/logo.jpeg" alt="Logo" width={40} height={40} className="rounded-xl shadow-md border-2 border-brand-secondary/20" />
             <span className="text-xl font-bold tracking-tight text-brand-primary uppercase">ANIKO</span>
          </Link>
          <div className="flex items-center gap-4">
             <span className="text-slate-400 font-bold text-sm">Cliente: {profile.child_name}</span>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 py-12 md:px-12 grid gap-12 lg:grid-cols-[1fr_350px]">
        {/* Main Content */}
          <div className="space-y-12">
            <section className="space-y-12 animate-fade-up">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-black text-brand-primary">Jornada de {profile.child_name || "Cliente"}</h1>
                  <p className="text-slate-400 font-medium mt-1">Acompanhe todos os vídeos e feedbacks</p>
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
                  <div className="py-20 text-center text-slate-400 font-bold animate-pulse">Carregando jornada...</div>
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
                            {v.status === 'alteracao_solicitada' ? 'Ajuste Solicitado' : 'Entregue'}
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
                                    onClick={async () => {
                                      const newWinStatus = !v.is_win;
                                      const { error } = await supabase.from('videos').update({ is_win: newWinStatus }).eq('id', v.id);
                                      if (!error) {
                                        setVideos(prev => prev.map(vid => vid.id === v.id ? { ...vid, is_win: newWinStatus } : vid));
                                      }
                                    }}
                                    className={`p-3 rounded-2xl transition-all ${v.is_win ? 'bg-amber-100 text-amber-600 border border-amber-200' : 'bg-slate-50 text-slate-400 hover:text-amber-500 hover:bg-amber-50'}`}
                                    title={v.is_win ? "Remover da Biblioteca de Wins" : "Adicionar à Biblioteca de Wins (Referência)"}
                                  >
                                    <Star className={`h-5 w-5 ${v.is_win ? 'fill-amber-600' : ''}`} />
                                  </button>
                                  <button 
                                    onClick={async () => {
                                      if (!confirm("Excluir este vídeo permanentemente?")) return;
                                      const { error } = await supabase.from('videos').delete().eq('id', v.id);
                                      if (!error) setVideos(prev => prev.filter(vid => vid.id !== v.id));
                                    }}
                                    className="p-3 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                                  </button>
                                </div>
                              </div>

                              <div className="group/video relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-slate-50 bg-slate-100">
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
                                      <PlayCircle className="h-7 w-7 text-brand-accent group-hover/play:text-white fill-current transition-colors" />
                                    </div>
                                  </button>
                                </div>
                              </div>

                              {/* Admin Tags Editor */}
                              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Tags Comportamentais (Admin)</p>
                                <input 
                                  type="text"
                                  defaultValue={v.tags || ""}
                                  placeholder="Ex: Educação, Social, Alimentação"
                                  onBlur={async (e) => {
                                    const val = e.target.value;
                                    const { error } = await supabase.from('videos').update({ tags: val }).eq('id', v.id);
                                    if (error) alert("Erro ao salvar tags: " + error.message);
                                  }}
                                  className="w-full px-5 py-3 rounded-xl bg-white border border-slate-200 text-sm font-bold text-brand-primary outline-none focus:border-brand-accent transition-all"
                                />
                                {v.tags && (
                                  <div className="flex flex-wrap gap-2 mt-4">
                                    {v.tags.split(',').map((tag: string, idx: number) => {
                                      const t = tag.trim().toLowerCase();
                                      let colorClass = "bg-slate-200 text-slate-600 border-slate-300";
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
                                )}
                              </div>
                            </div>

                            {/* Sidebar Interaction Section */}
                            <div className="flex flex-col justify-between space-y-8 bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100">
                              <div className="space-y-6">
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-black text-brand-primary flex items-center gap-2">
                                      <Star className="h-5 w-5 text-brand-accent fill-brand-accent" />
                                      Avaliação do Cliente
                                    </h4>
                                    <span className={`text-xl font-black ${v.response_score >= 8 ? 'text-green-500' : v.response_score >= 5 ? 'text-amber-500' : 'text-slate-400'}`}>
                                      {v.response_score !== null ? `${v.response_score}/10` : 'Pendente'}
                                    </span>
                                  </div>
                                  <div className="flex gap-1.5 opacity-50 grayscale pointer-events-none">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                                      <div key={star} className={`flex-1 h-6 rounded-md ${star <= (v.response_score || 0) ? 'bg-brand-accent' : 'bg-white border border-slate-200'}`} />
                                    ))}
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  <h4 className="font-black text-brand-primary flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5 text-brand-secondary" />
                                    Comentários dos Pais
                                  </h4>
                                  <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm min-h-[100px]">
                                    {v.feedback ? (
                                      <p className="text-sm text-brand-primary font-bold italic leading-relaxed">"{v.feedback}"</p>
                                    ) : (
                                      <p className="text-sm text-slate-300 italic flex items-center justify-center h-full">Nenhum comentário enviado ainda.</p>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {v.requested_alteration && (
                                <div className="bg-amber-50 p-6 rounded-[2.5rem] border border-amber-100 shadow-sm">
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                      <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                                        <AlertCircle className="h-4 w-4 animate-pulse" />
                                      </div>
                                      <p className="text-xs font-black text-amber-700 uppercase">Ajuste Solicitado</p>
                                    </div>
                                    <button 
                                      onClick={async () => {
                                        if (!confirm("Marcar como concluída?")) return;
                                        await supabase.from('videos').update({ status: 'concluido', requested_alteration: null }).eq('id', v.id);
                                        setVideos(prev => prev.map(vid => vid.id === v.id ? { ...vid, status: 'concluido', requested_alteration: null } : vid));
                                      }}
                                      className="px-4 py-2 bg-amber-500 text-white text-[10px] font-black rounded-xl hover:bg-amber-600 transition-all shadow-md"
                                    >
                                      Concluir
                                    </button>
                                  </div>
                                  <p className="text-sm text-amber-900 font-bold leading-relaxed italic">"{v.requested_alteration}"</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-20 bg-white rounded-[3rem] border border-dashed border-slate-200 text-center space-y-4">
                    <p className="text-slate-400 font-bold uppercase tracking-widest">Nenhuma animação enviada ainda.</p>
                  </div>
                )}
              </div>
            </section>

            {/* Response Chart */}
            <section className="bg-white rounded-[3rem] p-10 shadow-xl border border-white">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-10 w-10 rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <h3 className="text-2xl font-black">Análise de Engajamento</h3>
              </div>
              <div className="w-full">
                {videos.length > 0 ? (
                  <GraficoRespostaAdmin videos={videos} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-slate-300">
                    <TrendingUp className="h-10 w-10 opacity-20" />
                    <p className="text-sm font-bold mt-2 uppercase tracking-widest">Aguardando dados...</p>
                  </div>
                )}
              </div>
            </section>
          </div>

        {/* Sidebar */}
        <aside className="space-y-8">
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
                 {profile.phone && (
                   <p className="text-sm text-white/70 mb-2">📱 {profile.phone}</p>
                 )}
                 {profile.email && (
                   <p className="text-xs text-white/50 mb-4 break-all">{profile.email}</p>
                 )}
              </div>
           </div>

            {/* Active Tasks/Interests */}
            <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-white">
               <h3 className="text-lg font-black mb-6">Preferências Ativas</h3>
               <div className="flex flex-wrap gap-2">
                  {profile.preferences?.length > 0 ? profile.preferences.map((int: string, i: number) => (
                     <span key={i} className="px-4 py-2 bg-slate-50 text-slate-600 rounded-full text-xs font-bold border border-slate-100 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-accent" />
                        {int}
                     </span>
                  )) : (
                    <p className="text-sm text-slate-400 italic">Nenhuma preferência selecionada.</p>
                  )}
               </div>
               <button 
                 onClick={() => {
                   setEditFormData(profile);
                   setIsEditModalOpen(true);
                 }}
                 className="w-full mt-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-all text-sm"
               >
                 ✏️ Editar Perfil
               </button>
            </div>

            {/* Histórico da Criança */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-[3rem] p-8 shadow-xl border border-purple-200/50">
               <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                     <span className="text-xl">📖</span>
                     <h3 className="text-md font-black text-brand-primary">Sobre a criança</h3>
                  </div>
               </div>
               {profile.historico ? (
                  <div className="bg-white/70 rounded-2xl p-4">
                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                      {profile.historico.length > 200 && !mostrarHistoricoCompleto 
                        ? `${profile.historico.slice(0, 200)}...` 
                        : profile.historico}
                    </p>
                    {profile.historico.length > 200 && (
                      <button 
                        onClick={() => setMostrarHistoricoCompleto(!mostrarHistoricoCompleto)}
                        className="mt-2 text-sm font-bold text-purple-600 hover:text-purple-800 transition-colors"
                      >
                        {mostrarHistoricoCompleto ? 'Ver menos' : 'Ver mais'}
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm italic">Nenhum histórico cadastrado.</p>
                )}
            </div>
         </aside>

      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-brand-primary/40 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-white animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="p-8 md:p-10 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-brand-primary">Editar Perfil do Cliente</h3>
                <button onClick={() => setIsEditModalOpen(false)} className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 transition-all">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Nome da Criança</label>
                  <input 
                    type="text" 
                    value={editFormData.child_name || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, child_name: e.target.value })}
                    className="w-full px-5 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-accent focus:bg-white transition-all outline-none text-brand-primary font-bold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">WhatsApp</label>
                  <input 
                    type="text" 
                    value={editFormData.phone || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full px-5 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-accent focus:bg-white transition-all outline-none text-brand-primary font-bold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-purple-400 uppercase tracking-widest mb-2 ml-1 flex items-center gap-2">
                    <span>📖</span> Histórico da Criança
                  </label>
                  <textarea 
                    value={editFormData.historico || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, historico: e.target.value })}
                    placeholder="Conte um pouco sobre a criança, histórico, preferências, etc..."
                    className="w-full px-5 py-3 rounded-2xl bg-purple-50 border-2 border-transparent focus:border-purple-400 focus:bg-white transition-all outline-none text-brand-primary font-bold min-h-[100px]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Avatar</label>
                  <div className="grid grid-cols-5 gap-3">
                    {AVATARS.map((av) => (
                      <button 
                        key={av.id}
                        type="button"
                        onClick={() => setEditFormData({ ...editFormData, avatar_url: av.id })}
                        className={`aspect-square rounded-xl overflow-hidden border-4 transition-all hover:scale-105 ${editFormData.avatar_url === av.id ? 'border-brand-accent bg-brand-accent/5' : 'border-slate-50 bg-slate-50 opacity-60 hover:opacity-100'}`}
                      >
                        <img src={`/assets/avatars/avatar_${av.id}.png`} alt={av.label} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-4 rounded-2xl font-black text-slate-400 bg-slate-50 hover:bg-slate-100 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSaveProfileAdmin}
                  disabled={isSaving}
                  className="flex-1 py-4 rounded-2xl font-black text-white bg-brand-accent shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                  {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </div>
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
