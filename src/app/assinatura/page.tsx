"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import BackgroundDecor from "@/components/BackgroundDecor";
import { supabase } from "@/lib/supabase";
import { 
  CreditCard, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  RefreshCcw, 
  ArrowRight, 
  ShieldCheck, 
  FileText,
  XCircle,
  TrendingUp,
  Plus
} from "lucide-react";

export default function AssinaturaPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modais de Gestão
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  const [showCardModal, setShowCardModal] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState("");
  const [newCardHolder, setNewCardHolder] = useState("");
  const [newCardExpiry, setNewCardExpiry] = useState("");
  const [newCardCvv, setNewCardCvv] = useState("");
  const [isUpdatingCard, setIsUpdatingCard] = useState(false);

  useEffect(() => {
    async function loadSubscriptionData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setCurrentUser(user);

      // Carregar perfil
      const { data: userProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (userProfile) setProfile(userProfile);

      // Carregar histórico de pagamentos/faturas
      const { data: userPayments } = await supabase
        .from("payments")
        .select("*")
        .eq("profile_id", user.id)
        .order("created_at", { ascending: false });

      if (userPayments) setPayments(userPayments);

      setLoading(false);
    }
    loadSubscriptionData();
  }, [router]);

  // Cancelamento de Assinatura
  const handleCancelSubscription = async () => {
    setIsCancelling(true);
    try {
      await supabase
        .from("profiles")
        .update({ subscription_status: "cancelled" })
        .eq("id", currentUser.id);

      setProfile((prev: any) => ({ ...prev, subscription_status: "cancelled" }));
      alert("Sua assinatura foi solicitada para cancelamento. Seu saldo de créditos continuará disponível até o final do período!");
      setShowCancelModal(false);
    } catch (err: any) {
      alert("Erro ao cancelar: " + err.message);
    } finally {
      setIsCancelling(false);
    }
  };

  // Atualização dos dados do cartão
  const handleUpdateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardNumber) return;
    setIsUpdatingCard(true);

    try {
      const lastFour = newCardNumber.replace(/\s/g, "").slice(-4);
      await supabase
        .from("profiles")
        .update({ 
          card_last_four: lastFour,
          card_brand: "Mastercard"
        })
        .eq("id", currentUser.id);

      setProfile((prev: any) => ({ ...prev, card_last_four: lastFour }));
      alert("✅ Dados do cartão de crédito atualizados com sucesso!");
      setShowCardModal(false);
    } catch (err: any) {
      alert("Erro ao atualizar cartão: " + err.message);
    } finally {
      setIsUpdatingCard(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 border-4 border-brand-primary border-t-brand-accent rounded-full animate-spin mx-auto" />
          <p className="font-black text-brand-primary">Carregando detalhes da sua assinatura...</p>
        </div>
      </main>
    );
  }

  const credits = profile?.video_credits || 0;
  const planName = profile?.plan_name || "Sem Plano Ativo";
  const subStatus = profile?.subscription_status || "inactive";

  const startDate = profile?.subscription_created_at 
    ? new Date(profile.subscription_created_at).toLocaleDateString("pt-BR")
    : new Date().toLocaleDateString("pt-BR");

  const renewalDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR");

  return (
    <main className="relative min-h-screen bg-slate-50 overflow-hidden pb-24">
      <BackgroundDecor />
      <Navbar />

      <div className="w-full max-w-6xl mx-auto px-6 pt-32 md:pt-40 space-y-12">
        {/* Cabeçalho da Página */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-block rounded-full bg-brand-primary/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-brand-primary mb-3">
              💳 Painel do Assinante
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-brand-primary tracking-tight">
              Minha <span className="text-brand-accent">Assinatura</span> & Créditos
            </h1>
            <p className="text-slate-600 font-medium mt-2 text-base">
              Gerencie seus créditos de vídeos adaptados, dados de faturamento e detalhes da conta.
            </p>
          </div>

          <Link
            href="/pagamento"
            className="self-start md:self-auto px-6 py-4 rounded-2xl bg-brand-primary hover:bg-brand-primary/90 text-white font-black text-sm shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            <span>Adicionar Créditos / Mudar Plano</span>
          </Link>
        </div>

        {/* Linha Principal: Card do Plano + Card do Saldo de Créditos */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Card do Plano Atual */}
          <div className="relative group rounded-[2.5rem] bg-gradient-to-br from-[#0F2B48] via-[#0A2038] to-[#041628] p-8 md:p-10 text-white shadow-2xl border-2 border-brand-accent/30 flex flex-col justify-between space-y-8 overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Plano Contratado</span>
                  <h2 className="text-3xl font-black text-white mt-1">{planName}</h2>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                  subStatus === "active"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : subStatus === "cancelled"
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                }`}>
                  {subStatus === "active" ? "🟢 Ativa" : subStatus === "cancelled" ? "🔴 Solicitado Cancelamento" : "🟡 Sem Assinatura"}
                </span>
              </div>

              {/* Datas de Renovação */}
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/10 text-xs">
                <div>
                  <p className="text-slate-400 font-medium">Data da Assinatura:</p>
                  <p className="font-mono font-bold text-white text-sm mt-0.5">{startDate}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Próxima Renovação:</p>
                  <p className="font-mono font-bold text-brand-accent text-sm mt-0.5">{renewalDate}</p>
                </div>
              </div>

              <ul className="space-y-3 text-xs text-slate-300 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span>Renovação automática com cancelamento a qualquer momento</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span>Créditos cumulativos válidos por 60 dias</span>
                </li>
              </ul>
            </div>

            {/* Ações da Assinatura */}
            <div className="pt-4 flex flex-wrap items-center gap-4 border-t border-white/10">
              <Link
                href="/pagamento"
                className="px-5 py-3 rounded-xl bg-brand-accent hover:bg-brand-accent/90 text-white text-xs font-black shadow-lg hover:scale-105 transition-all"
              >
                Fazer Upgrade de Plano
              </Link>

              {subStatus === "active" && (
                <button
                  type="button"
                  onClick={() => setShowCancelModal(true)}
                  className="px-4 py-3 text-xs font-bold text-slate-400 hover:text-rose-400 transition-colors"
                >
                  Cancelar Assinatura
                </button>
              )}
            </div>
          </div>

          {/* Card do Saldo de Créditos */}
          <div className="rounded-[2.5rem] bg-white p-8 md:p-10 border-2 border-slate-100 shadow-xl flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saldo de Créditos</span>
                  <h3 className="text-3xl font-black text-brand-primary mt-1">Créditos de Animação</h3>
                </div>
                <span className="rounded-full bg-brand-accent/10 px-3 py-1 text-xs font-bold text-brand-accent">
                  Validade 60 dias
                </span>
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 text-center space-y-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Créditos Disponíveis</p>
                <p className="text-6xl font-black text-brand-primary tracking-tight">{credits}</p>
                <p className="text-xs text-slate-400 font-medium">crédito(s) prontos para uso</p>
              </div>

              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Cada crédito permite solicitar 1 animação totalmente personalizada adaptada às preferências sensoriais do seu filho(a).
              </p>
            </div>

            <div className="space-y-3">
              <Link
                href="/dashboard#solicitar-video"
                className="w-full py-4 bg-brand-primary hover:bg-brand-primary/90 text-white font-black rounded-2xl text-sm shadow-xl text-center block hover:scale-[1.02] active:scale-95 transition-all"
              >
                ✨ Usar 1 Crédito (Solicitar Animação)
              </Link>
              
              <Link
                href="/pagamento"
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs text-center block transition-all"
              >
                Comprar Créditos Avulsos
              </Link>
            </div>
          </div>
        </div>

        {/* Dados do Cartão de Crédito Cadastrado */}
        <div className="bg-white rounded-3xl p-8 border-2 border-slate-100 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <h3 className="text-2xl font-black text-brand-primary flex items-center gap-2">
                <CreditCard size={24} className="text-brand-accent" /> Dados do Cartão de Crédito
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Meio de pagamento vinculado à sua cobrança recorrente.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowCardModal(true)}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-brand-primary text-white font-black text-xs transition-all self-start sm:self-auto shadow-md"
            >
              Alterar Dados do Cartão
            </button>
          </div>

          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 max-w-md">
            <div className="h-12 w-16 bg-slate-900 rounded-xl flex items-center justify-center text-white font-mono font-bold text-xs shadow-md">
              CARD
            </div>
            <div>
              <p className="font-mono text-sm font-black text-slate-900">
                •••• •••• •••• {profile?.card_last_four || "4242"}
              </p>
              <p className="text-xs text-slate-500 font-medium">Bandeira: {profile?.card_brand || "Mastercard"}</p>
            </div>
          </div>
        </div>

        {/* Histórico de Cobranças / Faturas */}
        <div className="bg-white rounded-3xl p-8 border-2 border-slate-100 shadow-xl space-y-6">
          <h3 className="text-2xl font-black text-brand-primary flex items-center gap-2 border-b border-slate-100 pb-6">
            <FileText size={24} className="text-brand-accent" /> Histórico de Faturas & Transações
          </h3>

          {payments.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Clock size={36} className="mx-auto text-slate-300" />
              <p className="font-bold text-sm">Nenhuma fatura anterior encontrada.</p>
              <p className="text-xs">Suas futuras cobranças aparecerão detalhadas aqui.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 text-xs uppercase tracking-wider">
                    <th className="py-3 px-4">Data</th>
                    <th className="py-3 px-4">Descrição</th>
                    <th className="py-3 px-4">Forma de Pagamento</th>
                    <th className="py-3 px-4">Valor</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map((pay) => (
                    <tr key={pay.id} className="hover:bg-slate-50 transition-colors text-xs font-medium">
                      <td className="py-4 px-4 font-mono font-bold text-slate-700">
                        {new Date(pay.created_at).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="py-4 px-4 font-bold text-brand-primary">
                        {profile?.plan_name || "Renovação de Assinatura"}
                      </td>
                      <td className="py-4 px-4 text-slate-600">
                        {pay.payment_method || "Cartão de Crédito"}
                      </td>
                      <td className="py-4 px-4 font-black text-slate-900">
                        R$ {pay.amount},00
                      </td>
                      <td className="py-4 px-4 text-right">
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

      {/* Modal de Confirmação de Cancelamento */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white max-w-md w-full rounded-3xl p-8 space-y-6 shadow-2xl">
            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <XCircle className="text-rose-500" /> Cancelar Assinatura
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tem certeza que deseja cancelar sua assinatura? Você não perderá os créditos acumulados que já possui.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Motivo do cancelamento (opcional):</label>
              <textarea
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Conte-nos o motivo para podermos melhorar..."
                className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-brand-accent"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
              >
                Voltar
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={isCancelling}
                className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-black text-xs shadow-md disabled:opacity-50"
              >
                {isCancelling ? "Confirmando..." : "Sim, Cancelar Assinatura"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Alteração dos Dados do Cartão */}
      {showCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
          <form onSubmit={handleUpdateCard} className="bg-white max-w-md w-full rounded-3xl p-8 space-y-6 shadow-2xl">
            <h3 className="text-2xl font-black text-brand-primary flex items-center gap-2">
              <CreditCard className="text-brand-accent" /> Alterar Cartão de Crédito
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Novo Número do Cartão</label>
                <input
                  type="text"
                  required
                  value={newCardNumber}
                  onChange={(e) => setNewCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
                  placeholder="0000 0000 0000 0000"
                  className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-sm font-bold focus:outline-none focus:border-brand-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome no Cartão</label>
                <input
                  type="text"
                  required
                  value={newCardHolder}
                  onChange={(e) => setNewCardHolder(e.target.value.toUpperCase())}
                  placeholder="NOME COMO ESTÁ NO CARTÃO"
                  className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold focus:outline-none focus:border-brand-accent uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Validade</label>
                  <input
                    type="text"
                    required
                    value={newCardExpiry}
                    onChange={(e) => setNewCardExpiry(e.target.value)}
                    placeholder="MM/AA"
                    className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs font-bold focus:outline-none focus:border-brand-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CVV</label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={newCardCvv}
                    onChange={(e) => setNewCardCvv(e.target.value.replace(/\D/g, ""))}
                    placeholder="123"
                    className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs font-bold focus:outline-none focus:border-brand-accent"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowCardModal(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isUpdatingCard}
                className="flex-1 py-3 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-xl font-black text-xs shadow-md disabled:opacity-50"
              >
                {isUpdatingCard ? "Salvando..." : "Salvar Novo Cartão"}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
