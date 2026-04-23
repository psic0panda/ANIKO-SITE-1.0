"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ArrowLeft, TrendingUp, Star, Clock, AlertCircle, CheckCircle2, BarChart3, PieChart } from "lucide-react";

export default function AdminMetrics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({
    avgScore: 0,
    totalVideos: 0,
    winsCount: 0,
    adjustmentsRate: 0,
    tagsPerformance: [],
    categoryStats: []
  });

  useEffect(() => {
    async function fetchMetrics() {
      // Nota: Em produção, isso seria uma query agregada no Supabase ou uma Edge Function
      // Para o MVP, buscamos os dados e processamos no cliente
      try {
        const { data: videos, error } = await supabase
          .from('videos')
          .select('response_score, tags, category, status, is_win');

        if (error) throw error;

        if (videos) {
          const total = videos.length;
          const scores = videos.filter(v => v.response_score !== null).map(v => v.response_score);
          const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
          const wins = videos.filter(v => v.is_win).length;
          const adjustments = videos.filter(v => v.status === 'alteracao_solicitada').length;

          // Processar Tags
          const tagMap: Record<string, { count: number, sum: number }> = {};
          videos.forEach(v => {
            if (v.tags) {
              v.tags.split(',').forEach((t: string) => {
                const tag = t.trim().toLowerCase();
                if (!tagMap[tag]) tagMap[tag] = { count: 0, sum: 0 };
                tagMap[tag].count++;
                tagMap[tag].sum += v.response_score || 0;
              });
            }
          });

          const tagsPerf = Object.entries(tagMap)
            .map(([name, data]) => ({
              name,
              avg: data.sum / data.count,
              count: data.count
            }))
            .sort((a, b) => b.avg - a.avg);

          setStats({
            avgScore: avg.toFixed(1),
            totalVideos: total,
            winsCount: wins,
            adjustmentsRate: ((adjustments / total) * 100).toFixed(1),
            tagsPerformance: tagsPerf.slice(0, 8)
          });
        }
      } catch (e) {
        console.error('Erro ao calcular métricas:', e);
      }
      setLoading(false);
    }
    fetchMetrics();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-brand-primary flex items-center gap-4">
              <BarChart3 className="h-10 w-10 text-brand-accent" />
              Métricas de Eficiência
            </h1>
            <p className="text-slate-400 font-medium">Análise de performance e qualidade das animações</p>
          </div>
          <Link 
            href="/admin" 
            className="flex items-center gap-2 bg-white px-6 py-3 rounded-2xl text-sm font-bold shadow-sm border border-slate-100 hover:bg-slate-50 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Painel
          </Link>
        </div>

        {loading ? (
          <div className="py-20 text-center animate-pulse font-black text-slate-300 text-2xl uppercase tracking-widest">
            Calculando impacto...
          </div>
        ) : (
          <>
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-white space-y-2">
                <div className="h-12 w-12 rounded-2xl bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                  <Star className="h-6 w-6 fill-brand-accent" />
                </div>
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Média de Satisfação</p>
                <p className="text-4xl font-black text-brand-primary">{stats.avgScore}<span className="text-sm text-slate-300 ml-1">/10</span></p>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-white space-y-2">
                <div className="h-12 w-12 rounded-2xl bg-brand-secondary/10 flex items-center justify-center text-brand-secondary">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Total de Entregas</p>
                <p className="text-4xl font-black text-brand-primary">{stats.totalVideos}</p>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-white space-y-2">
                <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Biblioteca de "Wins"</p>
                <p className="text-4xl font-black text-brand-primary">{stats.winsCount}</p>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-white space-y-2">
                <div className="h-12 w-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Taxa de Ajustes</p>
                <p className="text-4xl font-black text-brand-primary">{stats.adjustmentsRate}<span className="text-sm text-slate-300 ml-1">%</span></p>
              </div>
            </div>

            {/* Charts & Tables */}
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Tags Performance */}
              <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-white">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-brand-primary flex items-center gap-3">
                    <PieChart className="h-5 w-5 text-brand-secondary" />
                    Performance por Tag
                  </h3>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Top 8</span>
                </div>
                <div className="space-y-6">
                  {stats.tagsPerformance.map((tag: any, idx: number) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between items-center text-sm font-bold">
                        <span className="capitalize text-slate-600">{tag.name}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-slate-400 text-[10px] font-black">{tag.count} vídeos</span>
                          <span className="text-brand-primary font-black">{tag.avg.toFixed(1)}/10</span>
                        </div>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-brand-accent rounded-full transition-all duration-1000"
                          style={{ width: `${tag.avg * 10}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quality Insights */}
              <div className="bg-brand-primary rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <TrendingUp className="h-32 w-32" />
                </div>
                <div className="relative z-10 space-y-8">
                  <h3 className="text-xl font-black flex items-center gap-3">
                    <Clock className="h-5 w-5 text-brand-accent" />
                    Insights de Produção
                  </h3>
                  
                  <div className="grid gap-6">
                    <div className="bg-white/10 p-6 rounded-3xl border border-white/10">
                      <p className="text-xs font-black uppercase tracking-widest text-brand-accent mb-2">Meta de Escala</p>
                      <p className="text-sm font-medium leading-relaxed">
                        Com os novos **Templates de Roteiro**, a meta é reduzir o tempo de resposta em 40% nas categorias de Higiene e Educação.
                      </p>
                    </div>

                    <div className="bg-white/10 p-6 rounded-3xl border border-white/10">
                      <p className="text-xs font-black uppercase tracking-widest text-brand-secondary mb-2">Padrão de Sucesso</p>
                      <p className="text-sm font-medium leading-relaxed">
                        Tags com média acima de **9.0** devem ser priorizadas para a Biblioteca de Wins e usadas como base para novos templates.
                      </p>
                    </div>

                    <div className="bg-white/10 p-6 rounded-3xl border border-white/10">
                      <p className="text-xs font-black uppercase tracking-widest text-red-400 mb-2">Alerta de Qualidade</p>
                      <p className="text-sm font-medium leading-relaxed">
                        Sua taxa de ajustes está em **{stats.adjustmentsRate}%**. O benchmark ideal é abaixo de 5%. Revise os roteiros de "Alimentação".
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
