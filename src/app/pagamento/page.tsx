"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import BackgroundDecor from "@/components/BackgroundDecor";
import { supabase } from "@/lib/supabase";
import { 
  CreditCard, 
  QrCode, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  ArrowLeft,
  Tag,
  AlertCircle
} from "lucide-react";

const PLANS: Record<string, { name: string; price: number; period: string; credits: number; features: string[] }> = {
  unico: {
    name: "Vídeo Único",
    price: 80,
    period: "pagamento único",
    credits: 1,
    features: [
      "1 Animação 100% personalizada",
      "Roteiro adaptado ao perfil da criança",
      "Estímulos visuais e sonoros controlados",
      "1 ajuste incluso por vídeo"
    ]
  },
  essencial: {
    name: "Plano Essencial",
    price: 260,
    period: "por mês",
    credits: 4,
    features: [
      "4 solicitações de vídeos por mês (R$ 65/crédito)",
      "Painel de gestão de saldo e solicitações",
      "Suavização sensorial e animação adaptativa",
      "Créditos cumulativos por até 60 dias",
      "1 ajuste por solicitação incluso"
    ]
  },
  pro: {
    name: "Plano Pro",
    price: 440,
    period: "por mês",
    credits: 8,
    features: [
      "8 solicitações de vídeos por mês (R$ 55/crédito)",
      "Painel de gestão de saldo e solicitações",
      "Prioridade na fila de produção",
      "Suavização sensorial e animação adaptativa",
      "Créditos cumulativos por até 60 dias",
      "1 ajuste por solicitação incluso"
    ]
  }
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const planParam = searchParams.get("plan") || "essencial";
  const [selectedPlanKey, setSelectedPlanKey] = useState<string>(PLANS[planParam] ? planParam : "essencial");
  
  const [paymentMethod, setPaymentMethod] = useState<"card" | "pix" | "boleto">("card");

  // Dados do Comprador
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [parentName, setParentName] = useState("");
  const [childName, setChildName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");

  // Endereço (obrigatório para boleto)
  const [zipCode, setZipCode] = useState("");
  const [streetName, setStreetName] = useState("");
  const [streetNumber, setStreetNumber] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [federalUnit, setFederalUnit] = useState("");
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  // Cartão de Crédito
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [installments, setInstallments] = useState("1");
  const [isFlipped, setIsFlipped] = useState(false);

  // Cupom
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState("");
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // Status de Processamento
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Resultado do pagamento
  const [pixQrCode, setPixQrCode] = useState("");
  const [pixQrBase64, setPixQrBase64] = useState("");
  const [boletoBarcode, setBoletoBarcode] = useState("");
  const [boletoUrl, setBoletoUrl] = useState("");
  const [boletoDueDate, setBoletoDueDate] = useState("");
  const [paymentResult, setPaymentResult] = useState<"" | "approved" | "pending_pix" | "pending_boleto">("");
  const [copiedPix, setCopiedPix] = useState(false);
  const [copiedBarcode, setCopiedBarcode] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser(user);
        setEmail(user.email || "");
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        if (profile) {
          setParentName(profile.parent_name || "");
          setChildName(profile.child_name || "");
          setPhone(profile.phone || "");
        }
      }
    }
    loadUser();
  }, []);

  const plan = PLANS[selectedPlanKey] || PLANS.essencial;

  // Cálculo financeiro
  const discount = appliedCoupon ? appliedCoupon.discount_fixed || 0 : 0;
  const finalPrice = Math.max(0, plan.price - discount);

  // Máscaras de input
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 16);
    val = val.replace(/(\d{4})/g, "$1 ").trim();
    setCardNumber(val);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (val.length >= 3) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setCardExpiry(val);
  };

  // Validação matemática do CPF (dígitos verificadores)
  const isValidCpf = (rawCpf: string): boolean => {
    const digits = rawCpf.replace(/\D/g, "");
    if (digits.length !== 11) return false;
    // Rejeita sequências repetidas (111.111.111-11, etc.)
    if (/^(\d)\1+$/.test(digits)) return false;

    const calc = (factor: number) => {
      let total = 0;
      for (let i = 0; i < factor - 1; i++) {
        total += parseInt(digits[i]) * (factor - i);
      }
      const remainder = (total * 10) % 11;
      return remainder === 10 || remainder === 11 ? 0 : remainder;
    };

    return calc(10) === parseInt(digits[9]) && calc(11) === parseInt(digits[10]);
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 11);
    val = val.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    setCpf(val);
  };

  const handleZipCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 8);
    if (val.length > 5) val = val.slice(0, 5) + "-" + val.slice(5);
    setZipCode(val);
    const digits = val.replace(/\D/g, "");
    if (digits.length === 8) {
      setIsLoadingCep(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setStreetName(data.logradouro || "");
          setNeighborhood(data.bairro || "");
          setCity(data.localidade || "");
          setFederalUnit(data.uf || "");
        }
      } catch {}
      setIsLoadingCep(false);
    }
  };

  // Validar Cupom
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsValidatingCoupon(true);
    setCouponError("");
    try {
      const res = await fetch("/api/validate-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coupon_code: couponCode, profile_id: currentUser?.id })
      });
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon(data.coupon);
        setCouponError("");
      } else {
        setCouponError(data.error || "Cupom inválido ou expirado.");
        setAppliedCoupon(null);
      }
    } catch {
      setCouponError("Erro ao validar cupom.");
      setAppliedCoupon(null);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  // Processar Pagamento
  const handleFinishPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage("");

    // Validar CPF para boleto (matemática dos dígitos verificadores)
    if (paymentMethod === "boleto") {
      if (!isValidCpf(cpf)) {
        setErrorMessage("CPF inválido. Verifique o número digitado e tente novamente.");
        setIsProcessing(false);
        return;
      }
    }


    try {
      let userId = currentUser?.id;

      // Se não estiver logado, criar/autenticar conta
      if (!userId) {
        if (!email || !parentName || !password) {
          setErrorMessage("Por favor, preencha Nome, E-mail e Senha para criar sua conta.");
          setIsProcessing(false);
          return;
        }


        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { parent_name: parentName, child_name: childName, phone } }
        });

        if (authError) {
          if (authError.message.includes("already registered")) {
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
            if (signInError) {
              setErrorMessage("Este e-mail já possui conta. Digite sua senha correta.");
              setIsProcessing(false);
              return;
            }
            userId = signInData.user.id;
          } else {
            setErrorMessage(`Erro ao criar conta: ${authError.message}`);
            setIsProcessing(false);
            return;
          }
        } else if (authData.user) {
          userId = authData.user.id;
          await supabase.from("profiles").upsert([{
            id: userId, parent_name: parentName, child_name: childName, phone, email
          }]);
        }
      }

      if (!userId) {
        setErrorMessage("Não foi possível identificar seu usuário. Tente novamente.");
        setIsProcessing(false);
        return;
      }

      // Chamar a API de checkout (server-side, usa service_role_key)
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan_key: selectedPlanKey,
          payment_method: paymentMethod,
          user_id: userId,
          user_email: email,
          user_name: parentName,
          cpf,
          coupon_code: appliedCoupon?.code || "",
          address: {
            zip_code: zipCode.replace(/\D/g, ""),
            street_name: streetName,
            street_number: streetNumber,
            neighborhood,
            city,
            federal_unit: federalUnit,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setErrorMessage(data.error || "Erro ao processar pagamento.");
        setIsProcessing(false);
        return;
      }

      // Tratar resposta conforme método de pagamento
      if (data.status === "approved" || data.is_free) {
        setPaymentResult("approved");
        setIsSuccess(true);
        setTimeout(() => router.push("/assinatura"), 2800);

      } else if (data.status === "pending_pix") {
        setPixQrCode(data.qr_code || "");
        setPixQrBase64(data.qr_code_base64 || "");
        setPaymentResult("pending_pix");

      } else if (data.status === "pending_boleto") {
        setBoletoBarcode(data.barcode || "");
        setBoletoUrl(data.boleto_url || "");
        setBoletoDueDate(data.due_date || "");
        setPaymentResult("pending_boleto");
      }

    } catch (err: any) {
      console.error("Erro no checkout:", err);
      setErrorMessage("Erro ao processar: " + (err.message || "Tente novamente"));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixQrCode);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 3000);
  };

  const handleCopyBarcode = () => {
    navigator.clipboard.writeText(boletoBarcode);
    setCopiedBarcode(true);
    setTimeout(() => setCopiedBarcode(false), 3000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-28 md:py-36">
      {/* Botão de Voltar */}
      <Link 
        href="/valores" 
        className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-primary font-bold text-sm mb-8 transition-colors"
      >
        <ArrowLeft size={16} />
        Voltar para a tabela de planos
      </Link>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Formulário Principal de Checkout */}
        <div className="w-full lg:w-3/5 space-y-8">
          {/* Seletor de Planos */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-100 shadow-xl space-y-6">
            <h2 className="text-2xl font-black text-brand-primary flex items-center gap-3">
              <span>🎯</span> Selecione seu Plano
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Object.entries(PLANS).map(([key, item]) => {
                const isSelected = selectedPlanKey === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedPlanKey(key)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? "border-brand-accent bg-brand-accent/5 shadow-md scale-[1.02]"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    {key === "pro" && (
                      <span className="absolute -top-2.5 right-3 bg-brand-warmth text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                        Popular
                      </span>
                    )}
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">{item.name}</p>
                      <p className="text-2xl font-black text-brand-primary mt-1">R$ {item.price}</p>
                      <p className="text-[10px] text-slate-500 font-medium">{item.period}</p>
                    </div>
                    <span className="mt-3 text-xs font-bold text-brand-accent flex items-center gap-1">
                      ✨ {item.credits} {item.credits === 1 ? "crédito" : "créditos"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dados do Comprador */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-100 shadow-xl space-y-6">
            <h2 className="text-2xl font-black text-brand-primary flex items-center gap-3">
              <span>👤</span> Seus Dados de Identificação
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome do Responsável *</label>
                <input
                  type="text"
                  required
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="Seu nome completo"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-medium text-sm focus:outline-none focus:border-brand-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome da Criança</label>
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="Nome do seu filho(a)"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-medium text-sm focus:outline-none focus:border-brand-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">E-mail *</label>
                <input
                  type="email"
                  required
                  disabled={!!currentUser}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-medium text-sm focus:outline-none focus:border-brand-accent disabled:opacity-70"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">WhatsApp / Telefone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(00) 90000-0000"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-medium text-sm focus:outline-none focus:border-brand-accent"
                />
              </div>

              {!currentUser && (
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Senha de Acesso para sua Conta *</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Crie uma senha (mínimo 6 caracteres)"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-medium text-sm focus:outline-none focus:border-brand-accent"
                  />
                  <p className="text-[10px] text-slate-400 mt-1 font-medium">Sua conta será criada automaticamente com esta senha para você gerenciar sua assinatura.</p>
                </div>
              )}
            </div>
          </div>

          {/* Formas de Pagamento */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-100 shadow-xl space-y-6">
            <h2 className="text-2xl font-black text-brand-primary flex items-center gap-3">
              <span>💳</span> Forma de Pagamento
            </h2>

            {/* Tabs de Seleção */}
            <div className="grid grid-cols-3 gap-3 bg-slate-100 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`py-3 rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all ${
                  paymentMethod === "card"
                    ? "bg-white text-brand-primary shadow-md font-black"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <CreditCard size={18} />
                <span>Cartão</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("pix")}
                className={`py-3 rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all ${
                  paymentMethod === "pix"
                    ? "bg-white text-emerald-600 shadow-md font-black"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <QrCode size={18} />
                <span>PIX</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("boleto")}
                className={`py-3 rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all ${
                  paymentMethod === "boleto"
                    ? "bg-white text-slate-800 shadow-md font-black"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <FileText size={18} />
                <span>Boleto</span>
              </button>
            </div>

            {/* Conteúdo Cartão de Crédito */}
            {paymentMethod === "card" && (
              <div className="space-y-6 pt-2">
                {/* Visualizador 3D do Cartão */}
                <div className="relative w-full max-w-sm mx-auto h-48 rounded-2xl bg-gradient-to-br from-slate-900 via-brand-primary to-slate-800 p-6 text-white shadow-2xl overflow-hidden border border-white/20 transition-transform duration-500">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/20 rounded-full blur-xl pointer-events-none" />
                  
                  {!isFlipped ? (
                    <div className="flex flex-col justify-between h-full relative z-10">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-mono tracking-widest text-slate-300 uppercase">Cartão de Crédito</span>
                        <span className="text-lg font-black italic tracking-tighter text-brand-accent">VISA / MASTERCARD</span>
                      </div>
                      <div>
                        <p className="font-mono text-xl md:text-2xl tracking-widest font-black">
                          {cardNumber || "•••• •••• •••• ••••"}
                        </p>
                      </div>
                      <div className="flex justify-between items-end text-xs font-mono">
                        <div>
                          <p className="text-[9px] text-slate-400 uppercase">Titular</p>
                          <p className="font-bold uppercase truncate max-w-[180px]">{cardHolder || "NOME NO CARTÃO"}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-400 uppercase">Validade</p>
                          <p className="font-bold">{cardExpiry || "MM/AA"}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col justify-between h-full relative z-10">
                      <div className="h-10 bg-slate-900 -mx-6 mt-2" />
                      <div className="bg-white/10 p-2 rounded text-right font-mono text-sm tracking-widest">
                        <span className="text-xs text-slate-400 mr-2">CVV:</span>
                        <span className="font-bold text-white">{cardCvv || "•••"}</span>
                      </div>
                      <p className="text-[9px] text-slate-400 text-center">Assinatura do Titular Autorizada</p>
                    </div>
                  )}
                </div>

                {/* Campos do Cartão */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Número do Cartão *</label>
                    <input
                      type="text"
                      required={paymentMethod === "card"}
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="0000 0000 0000 0000"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold text-base focus:outline-none focus:border-brand-accent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome Impresso no Cartão *</label>
                    <input
                      type="text"
                      required={paymentMethod === "card"}
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                      placeholder="NOME COMO ESTÁ NO CARTÃO"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm focus:outline-none focus:border-brand-accent uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Validade (MM/AA) *</label>
                    <input
                      type="text"
                      required={paymentMethod === "card"}
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      placeholder="12/28"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold text-sm focus:outline-none focus:border-brand-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CVV / Cód. Segurança *</label>
                    <input
                      type="text"
                      required={paymentMethod === "card"}
                      maxLength={4}
                      value={cardCvv}
                      onFocus={() => setIsFlipped(true)}
                      onBlur={() => setIsFlipped(false)}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                      placeholder="123"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold text-sm focus:outline-none focus:border-brand-accent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Opções de Parcelamento</label>
                    <select
                      value={installments}
                      onChange={(e) => setInstallments(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm focus:outline-none focus:border-brand-accent"
                    >
                      <option value="1">1x de R$ {finalPrice},00 sem juros</option>
                      <option value="2">2x de R$ {(finalPrice / 2).toFixed(2)} sem juros</option>
                      <option value="3">3x de R$ {(finalPrice / 3).toFixed(2)} sem juros</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Conteúdo PIX */}
            {paymentMethod === "pix" && (
              <div className="text-center py-6 space-y-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 p-6">
                <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <QrCode size={32} />
                </div>
                <h3 className="text-lg font-black text-emerald-900">Aprovação Instantânea via PIX</h3>
                <p className="text-xs text-emerald-700 max-w-md mx-auto">
                  Ao clicar em concluir, você receberá a chave PIX Copia e Cola e o QR Code com liberação imediata dos seus créditos.
                </p>
              </div>
            )}

            {/* Conteúdo Boleto */}
            {paymentMethod === "boleto" && (
              <div className="space-y-5 bg-slate-50 rounded-2xl border border-slate-200 p-6">
                <div className="text-center space-y-3">
                  <div className="h-14 w-14 bg-slate-200 text-slate-700 rounded-full flex items-center justify-center mx-auto">
                    <FileText size={28} />
                  </div>
                  <h3 className="text-lg font-black text-slate-900">Boleto Bancário</h3>
                  <p className="text-xs text-slate-500">Vencimento em 3 dias corridos. Créditos liberados em até 1 dia útil após o pagamento confirmado.</p>
                </div>

                {/* CPF e Endereço obrigatórios para boleto */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-4">
                  <p className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
                    ⚠️ CPF e endereço obrigatórios para emissão do boleto
                  </p>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CPF do Responsável *</label>
                    <input
                      type="text"
                      value={cpf}
                      onChange={handleCpfChange}
                      placeholder="000.000.000-00"
                      maxLength={14}
                      className="w-full px-4 py-3 border-2 border-slate-200 focus:border-brand-primary rounded-xl text-sm font-mono outline-none transition-colors bg-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CEP *</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={zipCode}
                          onChange={handleZipCodeChange}
                          placeholder="00000-000"
                          maxLength={9}
                          className="w-full px-4 py-3 border-2 border-slate-200 focus:border-brand-primary rounded-xl text-sm font-mono outline-none transition-colors bg-white"
                          required
                        />
                        {isLoadingCep && <span className="absolute right-3 top-3 text-xs text-slate-400">🔍</span>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Número *</label>
                      <input
                        type="text"
                        value={streetNumber}
                        onChange={(e) => setStreetNumber(e.target.value)}
                        placeholder="123"
                        className="w-full px-4 py-3 border-2 border-slate-200 focus:border-brand-primary rounded-xl text-sm outline-none transition-colors bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Rua / Logradouro *</label>
                    <input
                      type="text"
                      value={streetName}
                      onChange={(e) => setStreetName(e.target.value)}
                      placeholder="Rua das Flores"
                      className="w-full px-4 py-3 border-2 border-slate-200 focus:border-brand-primary rounded-xl text-sm outline-none transition-colors bg-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Bairro *</label>
                      <input
                        type="text"
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                        placeholder="Centro"
                        className="w-full px-4 py-3 border-2 border-slate-200 focus:border-brand-primary rounded-xl text-sm outline-none transition-colors bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cidade *</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="São Paulo"
                        className="w-full px-4 py-3 border-2 border-slate-200 focus:border-brand-primary rounded-xl text-sm outline-none transition-colors bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Estado (UF) *</label>
                    <select
                      value={federalUnit}
                      onChange={(e) => setFederalUnit(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 focus:border-brand-primary rounded-xl text-sm outline-none transition-colors bg-white"
                      required
                    >
                      <option value="">Selecione o Estado</option>
                      {["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"].map(uf => (
                        <option key={uf} value={uf}>{uf}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Resumo Financeiro no Lado Direito */}
        <div className="w-full lg:w-2/5 space-y-6 sticky top-28">
          <div className="bg-gradient-to-b from-[#0F2B48] to-[#041628] rounded-3xl p-8 text-white shadow-2xl border-2 border-brand-accent/30 space-y-6">
            <h3 className="text-xl font-black flex items-center gap-2 border-b border-white/10 pb-4">
              <span>🧾</span> Resumo do Pedido
            </h3>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-medium">Plano Selecionado:</span>
                <span className="font-black text-brand-accent text-base">{plan.name}</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Créditos de Vídeo:</span>
                <span className="font-bold text-white">+{plan.credits} créditos de animação</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Valor do Plano:</span>
                <span className="font-bold text-white">R$ {plan.price},00</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between items-center text-xs text-emerald-400">
                  <span>Desconto ({appliedCoupon.code}):</span>
                  <span className="font-black">- R$ {discount},00</span>
                </div>
              )}

              <div className="pt-4 border-t border-white/10 flex justify-between items-baseline">
                <span className="text-base font-bold text-slate-200">Total a Pagar:</span>
                <div className="text-right">
                  <span className="text-3xl font-black text-brand-accent">R$ {finalPrice}</span>
                  <span className="text-xs text-slate-400 font-normal block">,00 à vista</span>
                </div>
              </div>
            </div>

            {/* Campo de Cupom */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-300 uppercase mb-2 flex items-center gap-1.5">
                <Tag size={14} className="text-brand-accent" /> Cupom de Desconto
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="CÓDIGO DO CUPOM"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 text-white font-mono text-xs uppercase border border-white/20 focus:outline-none focus:border-brand-accent"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={isValidatingCoupon || !couponCode.trim()}
                  className="px-4 py-2.5 bg-brand-accent hover:bg-brand-accent/90 text-white font-bold text-xs rounded-xl transition-all disabled:opacity-50"
                >
                  {isValidatingCoupon ? "..." : "Aplicar"}
                </button>
              </div>
              {couponError && <p className="text-[11px] text-red-400 font-bold mt-1.5">{couponError}</p>}
              {appliedCoupon && <p className="text-[11px] text-emerald-400 font-bold mt-1.5">✓ Cupom aplicado com sucesso!</p>}
            </div>

            {/* Aviso de Segurança */}
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-3 text-xs text-slate-300">
              <ShieldCheck size={24} className="text-emerald-400 flex-shrink-0" />
              <span>Pagamento 100% Criptografado e Seguro via Mercado Pago.</span>
            </div>

            {errorMessage && (
              <div className="bg-red-500/20 border border-red-500/40 p-4 rounded-2xl flex items-center gap-2 text-xs text-red-300">
                <AlertCircle size={18} className="flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Botão de Concluir Pagamento */}
            <button
              type="button"
              onClick={handleFinishPayment}
              disabled={isProcessing || isSuccess}
              className="w-full py-5 bg-brand-accent hover:bg-brand-accent/90 text-white font-black rounded-2xl text-lg shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-60"
            >
              {isProcessing ? (
                <span>Processando pagamento...</span>
              ) : isSuccess ? (
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={24} /> Pagamento Aprovado!
                </span>
              ) : (
                <>
                  <Lock size={18} />
                  <span>Concluir Assinatura — R$ {finalPrice}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Cartão Aprovado */}
      {paymentResult === "approved" && isSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-8 text-center space-y-5 shadow-2xl">
            <div className="h-20 w-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 size={48} />
            </div>
            <h3 className="text-3xl font-black text-brand-primary">Pagamento Aprovado! 🎉</h3>
            <p className="text-sm text-slate-600">
              Sua assinatura do <strong>{plan.name}</strong> foi confirmada e <strong>{plan.credits} crédito{plan.credits > 1 ? "s" : ""}</strong> já foram adicionados à sua conta.
            </p>
            <p className="text-xs text-brand-accent font-bold animate-pulse">Redirecionando para o Painel do Assinante...</p>
          </div>
        </div>
      )}

      {/* Modal: QR Code PIX */}
      {paymentResult === "pending_pix" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-white max-w-sm w-full rounded-3xl p-8 text-center space-y-5 shadow-2xl">
            <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <QrCode size={36} />
            </div>
            <h3 className="text-2xl font-black text-brand-primary">Pague via PIX</h3>
            <p className="text-xs text-slate-500">Escaneie o QR Code ou copie o código abaixo. Seus créditos são liberados em até 1 minuto após confirmação.</p>

            {pixQrBase64 ? (
              <img
                src={`data:image/png;base64,${pixQrBase64}`}
                alt="QR Code PIX"
                className="w-48 h-48 mx-auto rounded-xl border border-slate-200 p-2"
              />
            ) : (
              <div className="w-48 h-48 mx-auto bg-slate-100 rounded-xl flex items-center justify-center text-xs text-slate-400">Gerando QR Code...</div>
            )}

            {pixQrCode && (
              <div className="space-y-2">
                <p className="text-[10px] text-slate-400 font-mono break-all bg-slate-50 p-3 rounded-xl border">{pixQrCode.substring(0, 80)}...</p>
                <button
                  onClick={handleCopyPix}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl text-sm transition-all"
                >
                  {copiedPix ? "✓ Código Copiado!" : "📋 Copiar Código PIX"}
                </button>
              </div>
            )}

            <p className="text-xs text-slate-400">Valor: <strong className="text-brand-primary">R$ {finalPrice},00</strong></p>
            <button onClick={() => setPaymentResult("")} className="text-xs text-slate-400 hover:text-slate-600 underline">Cancelar e voltar</button>
          </div>
        </div>
      )}

      {/* Modal: Boleto Bancário */}
      {paymentResult === "pending_boleto" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-8 text-center space-y-5 shadow-2xl">
            <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <FileText size={36} />
            </div>
            <h3 className="text-2xl font-black text-brand-primary">Boleto Gerado! 📄</h3>
            <p className="text-xs text-slate-500">Pague o boleto em qualquer banco, lotérica ou pelo app do seu banco. Seus créditos são liberados em até 1 dia útil após a confirmação do pagamento.</p>

            {boletoDueDate && (
              <p className="text-xs font-bold text-orange-600 bg-orange-50 py-2 px-4 rounded-xl">
                ⏰ Vencimento: {new Date(boletoDueDate).toLocaleDateString("pt-BR")}
              </p>
            )}

            {boletoBarcode && (
              <div className="space-y-2">
                <p className="text-[11px] font-mono break-all bg-slate-50 p-3 rounded-xl border text-slate-600 select-all">{boletoBarcode}</p>
                <button
                  onClick={handleCopyBarcode}
                  className="w-full py-3 bg-brand-primary hover:bg-brand-primary/90 text-white font-black rounded-2xl text-sm transition-all"
                >
                  {copiedBarcode ? "✓ Código Copiado!" : "📋 Copiar Código de Barras"}
                </button>
              </div>
            )}

            {boletoUrl && (
              <a
                href={boletoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 border-2 border-brand-primary text-brand-primary font-black rounded-2xl text-sm hover:bg-brand-primary/5 transition-all"
              >
                🖨️ Abrir / Imprimir Boleto
              </a>
            )}

            <p className="text-xs text-slate-400">Valor: <strong className="text-brand-primary">R$ {finalPrice},00</strong></p>
            <button onClick={() => setPaymentResult("")} className="text-xs text-slate-400 hover:text-slate-600 underline">Cancelar e voltar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PagamentoPage() {
  return (
    <main className="relative min-h-screen bg-slate-50 overflow-hidden">
      <BackgroundDecor />
      <Navbar />
      <Suspense fallback={<div className="text-center py-40 font-bold text-brand-primary">Carregando formulário de pagamento...</div>}>
        <CheckoutContent />
      </Suspense>
    </main>
  );
}
