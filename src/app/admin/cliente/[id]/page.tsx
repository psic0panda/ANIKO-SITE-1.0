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
  ArrowLeft
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

  const handleOpenVideo = (url: string) => {
    if (url.includes('drive.google.com')) {
      window.open(url, '_blank');
    } else {
      setSelectedVideo(url);
    }
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
          {/* Video Gallery */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-black">Vídeos Solicitados</h1>
              <span className="text-brand-secondary font-bold cursor-pointer hover:underline">Ver Histórico</span>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              {loading ? (
                <div className="col-span-2 py-10 text-center text-slate-400 font-bold animate-pulse">Carregando vídeos...</div>
              ) : videos.length > 0 ? (
                videos.map((v, i) => {
                  const titleLower = (v.title || '').toLowerCase();
                  const thumb = v.thumbnail_url || (
                    titleLower.includes('bluey') ? '/assets/drawings/bluey.jpg' :
                    titleLower.includes('daniel') ? '/assets/drawings/daniel.jpg' :
                    titleLower.includes('caillou') ? '/assets/drawings/caillou.jpg' :
                    titleLower.includes('luna') ? '/assets/drawings/luna.webp' :
                    titleLower.includes('arthur') ? '/assets/drawings/arthur.jpg' :
                    titleLower.includes('octonaut') ? '/assets/drawings/octonauts.jpg' :
                    titleLower.includes('peixonauta') ? '/assets/drawings/peixonauta.jpg' :
                    titleLower.includes('kratts') || titleLower.includes('irmãos kratts') ? '/assets/drawings/kratts.jpg' : null
                  );
                  return (
                  <div key={i} className="space-y-4">
                    <div className="group relative aspect-video rounded-[2.5rem] overflow-hidden shadow-lg border-4 border-white hover:scale-[1.02] transition-all">
                      {thumb ? (
                        <img src={thumb} alt={v.title} className="absolute inset-0 w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary to-brand-secondary" />
                      )}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                      <button type="button" onClick={() => handleOpenVideo(v.video_url)} className="absolute inset-0 w-full h-full flex items-center justify-center cursor-pointer border-none">
                        <div className="h-16 w-16 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
                          <svg className="h-6 w-6 fill-brand-primary ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                      </button>
                      <div className="absolute top-6 right-6 group/rating">
                        <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 cursor-help">
                          <span className="text-white font-bold text-sm">{v.response_score || v.rating * 2 || 0}/10</span>
                          {v.feedback && (
                            <div className="absolute top-full right-0 mt-2 w-48 p-3 bg-white rounded-xl shadow-xl border border-slate-100 opacity-0 group-hover/rating:opacity-100 transition-opacity z-30 pointer-events-none">
                              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Feedback</p>
                              <p className="text-sm text-brand-primary font-medium">{v.feedback}</p>
                            </div>
                          )}
                          <button type="button" onClick={(e) => { e.stopPropagation(); setActiveFeedbackId(v.id); setFeedbackScore(v.response_score || v.rating * 2 || 0); setFeedbackText(v.feedback || ""); }} className="h-8 w-8 rounded-full bg-brand-accent flex items-center justify-center hover:scale-110 transition-transform">
                            <Star className="h-4 w-4 fill-white text-white" />
                          </button>
                        </div>
                      </div>
                      {activeFeedbackId === v.id && (
                        <div className="absolute inset-0 bg-brand-primary/95 backdrop-blur-md p-6 md:p-8 flex flex-col justify-center animate-fade-in z-20 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="text-white font-black text-lg">Como {profile.child_name || "a criança"} reagiu?</h4>
                            <button type="button" onClick={() => setActiveFeedbackId(null)} className="text-white/60 hover:text-white">✕</button>
                          </div>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs font-bold text-white/60 uppercase tracking-widest">
                                <span>Feedback</span>
                                <span className="text-brand-accent">{feedbackScore}/10</span>
                              </div>
                              <input type="range" min="0" max="10" value={feedbackScore} onChange={(e) => setFeedbackScore(parseInt(e.target.value))} className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-brand-accent" />
                            </div>
                            <textarea value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} placeholder="Opcional: O que ela mais gostou?" className="w-full h-16 md:h-20 bg-white/10 border border-white/10 rounded-2xl p-3 md:p-4 text-white text-sm outline-none focus:border-brand-accent transition-colors resize-none" />
                            <button type="button" disabled={isSubmittingFeedback} onClick={() => handleRate(v.id)} className="w-full py-3 bg-brand-accent text-white font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
                              {isSubmittingFeedback ? "Salvando..." : "Salvar Feedback"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="px-2 flex justify-between items-start">
                      <div>
                        <span className="inline-block px-3 py-1 bg-brand-secondary/50 rounded-full text-[10px] font-black uppercase tracking-widest text-brand-primary">{v.category || 'Animação'}</span>
                        <h4 className="text-lg font-bold text-brand-primary mt-1">{v.title}</h4>
                        <p className="text-slate-400 text-sm">{new Date(v.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  );
                })
              ) : (
                 <div className="col-span-2 py-20 bg-white rounded-[3rem] border border-dashed border-slate-200 text-center space-y-4">
                    <p className="text-slate-400 font-bold uppercase tracking-widest">Nenhum vídeo disponível ainda.</p>
                 </div>
              )}
            </div>
          </section>

          {/* Progress Section */}
          <section className="bg-white rounded-[3rem] p-10 shadow-xl border border-white">
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                   <div className="h-10 w-10 rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                      <TrendingUp className="h-5 w-5" />
                   </div>
                   <h3 className="text-2xl font-black">Gráfico de Resposta</h3>
                </div>
             </div>
             
              <div className="w-full">
                {videos.length > 0 ? (
                  <GraficoRespostaAdmin videos={videos} />
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
