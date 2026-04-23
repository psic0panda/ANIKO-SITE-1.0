import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  console.log(">>> CHECKOUT: Iniciando...");
  
  try {
    const { description, profile_id, user_email, coupon_code } = await request.json();
    console.log(">>> CHECKOUT: Dados recebidos:", { description: description?.substring(0, 30), profile_id, user_email, coupon_code });

    let finalAmount = 80;
    let couponId = null;
    let discountAmount = 0;

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );

    // PASSO 0: Validar cupom se houver
    if (coupon_code) {
      const { data: coupon } = await supabaseAdmin
        .from('coupons')
        .select('*')
        .eq('code', coupon_code.toUpperCase())
        .eq('active', true)
        .single();

      if (coupon) {
        if (coupon.code.startsWith('UNICO_')) {
          // A. Verificar se já usou (Limite GLOBAL)
          const { data: globalUsed } = await supabaseAdmin
            .from('payments')
            .select('id')
            .eq('coupon_id', coupon.id)
            .eq('status', 'approved')
            .limit(1)
            .maybeSingle();

          if (globalUsed) {
            console.warn(`>>> CHECKOUT: Cupom único ${coupon_code} já foi utilizado globalmente`);
            return NextResponse.json({ error: 'Este cupom era de uso único e já foi utilizado.' }, { status: 400 });
          }
        } else {
          // A. Verificar se já usou (Limite de 1 por conta)
          const { data: alreadyUsed } = await supabaseAdmin
            .from('payments')
            .select('id')
            .eq('profile_id', profile_id)
            .eq('coupon_id', coupon.id)
            .eq('status', 'approved')
            .limit(1)
            .maybeSingle();

          if (alreadyUsed) {
            console.warn(`>>> CHECKOUT: Usuário ${profile_id} tentou reutilizar cupom ${coupon_code}`);
            return NextResponse.json({ error: 'Você já utilizou este cupom anteriormente.' }, { status: 400 });
          }
        }

        // B. Verificar expiração
        const isNotExpired = !coupon.expires_at || new Date(coupon.expires_at) > new Date();
        if (isNotExpired) {
          discountAmount = coupon.discount_fixed;
          finalAmount = Math.max(0, 80 - discountAmount);
          couponId = coupon.id;
          console.log(`>>> CHECKOUT: Cupom aplicado! Desconto: R$ ${discountAmount}, Final: R$ ${finalAmount}`);
        }
      }
    }

    // PASSO 0.1: Se o valor for 0 (100% de desconto), pular Mercado Pago
    if (finalAmount === 0) {
      console.log(">>> CHECKOUT: Valor 0, aprovando direto...");
      const { data: paymentData, error: dbError } = await supabaseAdmin
        .from('payments')
        .insert([{
          profile_id,
          amount: 0,
          status: 'approved', // Já aprovado
          external_id: `free-${Date.now()}`,
          coupon_id: couponId,
          discount_amount: discountAmount
        }])
        .select()
        .single();

      if (dbError) {
        console.error(">>> CHECKOUT: Erro DB (Free):", dbError);
        return NextResponse.json({ error: `Erro banco: ${dbError.message}` }, { status: 500 });
      }

      return NextResponse.json({
        payment_id: paymentData.id,
        amount: 0,
        status: 'approved',
        is_free: true
      });
    }

    // PASSO 1: Chamar Mercado Pago
    console.log(">>> CHECKOUT: Chamando Mercado Pago com valor:", finalAmount);
    const mpResponse = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        'X-Idempotency-Key': `aniko-${Date.now()}`,
      },
      body: JSON.stringify({
        transaction_amount: finalAmount,
        description: `Video Aniko: ${(description || '').substring(0, 50)}`,
        payment_method_id: 'pix',
        payer: {
          email: user_email || 'test@test.com',
        },
      }),
    });

    const mpData = await mpResponse.json();
    
    if (!mpResponse.ok || !mpData.id) {
      console.error(">>> CHECKOUT: Erro MP:", mpData);
      return NextResponse.json({ 
        error: `Mercado Pago erro (${mpResponse.status}): ${mpData.message || JSON.stringify(mpData)}` 
      }, { status: 500 });
    }

    const qr_code = mpData.point_of_interaction?.transaction_data?.qr_code || '';
    const qr_code_base64 = mpData.point_of_interaction?.transaction_data?.qr_code_base64 || '';

    // PASSO 2: Salvar no Supabase
    console.log(">>> CHECKOUT: Salvando no Supabase...");
    const { data: paymentData, error: dbError } = await supabaseAdmin
      .from('payments')
      .insert([{
        profile_id,
        amount: finalAmount,
        status: 'pending',
        external_id: mpData.id.toString(),
        pix_qr_code: qr_code,
        pix_qr_code_base64: qr_code_base64,
        coupon_id: couponId,
        discount_amount: discountAmount
      }])
      .select()
      .single();

    if (dbError) {
      console.error(">>> CHECKOUT: Erro DB:", dbError);
      return NextResponse.json({ error: `Erro banco: ${dbError.message}` }, { status: 500 });
    }

    console.log(">>> CHECKOUT: SUCESSO!");
    return NextResponse.json({
      payment_id: paymentData.id,
      qr_code: qr_code,
      qr_code_base64: qr_code_base64,
      amount: finalAmount,
      discount: discountAmount
    });

  } catch (error: any) {
    console.error('>>> CHECKOUT ERRO FATAL:', error);
    return NextResponse.json({ error: `Erro: ${error.message}` }, { status: 500 });
  }
}
