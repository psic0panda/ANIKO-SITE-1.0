import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const PLANS: Record<string, { name: string; price: number; credits: number }> = {
  unico:    { name: 'Vídeo Único',    price: 80,  credits: 1 },
  essencial:{ name: 'Plano Essencial', price: 260, credits: 4 },
  pro:      { name: 'Plano Pro',       price: 440, credits: 8 },
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      plan_key, 
      payment_method, // 'card' | 'pix' | 'boleto'
      user_id, 
      user_email,
      user_name,
      cpf,
      coupon_code,
    } = body;

    const plan = PLANS[plan_key] || PLANS.essencial;

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // ---------- Validar cupom ----------
    let discount = 0;
    let couponId: string | null = null;
    if (coupon_code) {
      const { data: coupon } = await supabaseAdmin
        .from('coupons')
        .select('*')
        .eq('code', coupon_code.toUpperCase())
        .eq('active', true)
        .single();

      if (coupon) {
        const notExpired = !coupon.expires_at || new Date(coupon.expires_at) > new Date();
        if (notExpired) {
          discount = coupon.discount_fixed || 0;
          couponId = coupon.id;
        }
      }
    }

    const finalAmount = Math.max(0, plan.price - discount);

    // ---------- Caso pagamento gratuito (cupom 100%) ----------
    if (finalAmount === 0) {
      await addCreditsToUser(supabaseAdmin, user_id, plan, 'Cortesia');
      return NextResponse.json({ status: 'approved', is_free: true, plan });
    }

    const mpToken = process.env.MP_ACCESS_TOKEN!;
    const idempotencyKey = `aniko-${user_id}-${Date.now()}`;

    // ---------- CARTÃO DE CRÉDITO: aprova imediatamente ----------
    if (payment_method === 'card') {
      // Neste fluxo simplificado, aprovamos direto (sem tokenização real).
      // Em produção real, usar o SDK do MP no frontend para tokenizar o cartão.
      await addCreditsToUser(supabaseAdmin, user_id, plan, 'Cartão de Crédito');
      await supabaseAdmin.from('payments').insert([{
        profile_id: user_id,
        amount: finalAmount,
        status: 'approved',
        payment_method: 'Cartão de Crédito',
        external_id: `card-${Date.now()}`,
        coupon_id: couponId,
      }]);
      return NextResponse.json({ status: 'approved', plan });
    }

    // ---------- PIX: gera QR Code via Mercado Pago ----------
    if (payment_method === 'pix') {
      const mpRes = await fetch('https://api.mercadopago.com/v1/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mpToken}`,
          'X-Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify({
          transaction_amount: finalAmount,
          description: `Aniko - ${plan.name}`,
          payment_method_id: 'pix',
          payer: { email: user_email || 'cliente@aniko.com.br' },
        }),
      });

      const mpData = await mpRes.json();

      if (!mpRes.ok || !mpData.id) {
        return NextResponse.json({ error: `Erro Mercado Pago: ${mpData.message || JSON.stringify(mpData)}` }, { status: 500 });
      }

      const qr_code = mpData.point_of_interaction?.transaction_data?.qr_code || '';
      const qr_code_base64 = mpData.point_of_interaction?.transaction_data?.qr_code_base64 || '';

      await supabaseAdmin.from('payments').insert([{
        profile_id: user_id,
        amount: finalAmount,
        status: 'pending',
        payment_method: 'PIX',
        external_id: mpData.id.toString(),
        pix_qr_code: qr_code,
        pix_qr_code_base64: qr_code_base64,
        coupon_id: couponId,
        plan_key,
      }]);

      return NextResponse.json({
        status: 'pending_pix',
        plan,
        qr_code,
        qr_code_base64,
        mp_payment_id: mpData.id,
      });
    }

    // ---------- BOLETO: gera via Mercado Pago ----------
    if (payment_method === 'boleto') {
      const mpRes = await fetch('https://api.mercadopago.com/v1/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mpToken}`,
          'X-Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify({
          transaction_amount: finalAmount,
          description: `Aniko - ${plan.name}`,
          payment_method_id: 'bolbradesco',
          payer: {
            email: user_email || 'cliente@aniko.com.br',
            first_name: (user_name || 'Cliente').split(' ')[0],
            last_name: (user_name || 'Aniko').split(' ').slice(1).join(' ') || 'Aniko',
            identification: {
              type: 'CPF',
              number: (cpf || '').replace(/\D/g, '') || '00000000000',
            },
          },
        }),
      });

      const mpData = await mpRes.json();

      if (!mpRes.ok || !mpData.id) {
        console.error('MP Boleto Error:', mpData);
        return NextResponse.json({ error: `Erro ao gerar boleto: ${mpData.message || JSON.stringify(mpData)}` }, { status: 500 });
      }

      const barcodeContent = mpData.barcode?.content || '';
      const boletoUrl = mpData.transaction_details?.external_resource_url || '';
      const dueDate = mpData.date_of_expiration || '';

      await supabaseAdmin.from('payments').insert([{
        profile_id: user_id,
        amount: finalAmount,
        status: 'pending',
        payment_method: 'Boleto',
        external_id: mpData.id.toString(),
        boleto_barcode: barcodeContent,
        boleto_url: boletoUrl,
        coupon_id: couponId,
        plan_key,
      }]);

      return NextResponse.json({
        status: 'pending_boleto',
        plan,
        barcode: barcodeContent,
        boleto_url: boletoUrl,
        due_date: dueDate,
        mp_payment_id: mpData.id,
      });
    }

    return NextResponse.json({ error: 'Método de pagamento inválido.' }, { status: 400 });

  } catch (err: any) {
    console.error('CHECKOUT ERROR:', err);
    return NextResponse.json({ error: err.message || 'Erro interno' }, { status: 500 });
  }
}

// Adiciona créditos e atualiza plano no perfil (usando service_role — bypassa RLS)
async function addCreditsToUser(
  supabaseClient: any,
  userId: string,
  plan: { name: string; credits: number },
  _paymentMethodLabel: string
) {
  const { data: current } = await supabaseClient
    .from('profiles')
    .select('video_credits')
    .eq('id', userId)
    .single();

  const existing = (current as any)?.video_credits || 0;
  const newCredits = existing + plan.credits;

  const now = new Date();
  const expires = new Date(now);
  expires.setDate(expires.getDate() + 60);

  const { error } = await supabaseClient
    .from('profiles')
    .update({
      video_credits: newCredits,
      plan_name: plan.name,
      subscription_status: 'active',
      subscription_created_at: now.toISOString(),
      subscription_expires_at: expires.toISOString(),
    } as any)
    .eq('id', userId);

  if (error) {
    console.error('Erro ao atualizar créditos:', error);
    throw new Error('Não foi possível adicionar os créditos: ' + error.message);
  }

  console.log(`✅ +${plan.credits} créditos adicionados para ${userId} (total: ${newCredits})`);
}
