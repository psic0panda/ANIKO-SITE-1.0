import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  console.log(">>> CHECKOUT: Iniciando...");
  console.log(">>> MP_ACCESS_TOKEN presente?", !!process.env.MP_ACCESS_TOKEN);
  console.log(">>> SUPABASE_SERVICE_ROLE_KEY presente?", !!process.env.SUPABASE_SERVICE_ROLE_KEY);

  try {
    const { description, profile_id, user_email } = await request.json();
    console.log(">>> CHECKOUT: Dados recebidos:", { description: description?.substring(0, 30), profile_id, user_email });

    // PASSO 1: Chamar Mercado Pago
    console.log(">>> CHECKOUT: Chamando Mercado Pago...");
    const mpResponse = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        'X-Idempotency-Key': `aniko-${Date.now()}`,
      },
      body: JSON.stringify({
        transaction_amount: 80,
        description: `Video Aniko: ${(description || '').substring(0, 50)}`,
        payment_method_id: 'pix',
        payer: {
          email: user_email || 'test@test.com',
        },
      }),
    });

    const mpData = await mpResponse.json();
    console.log(">>> CHECKOUT: Status MP:", mpResponse.status);
    console.log(">>> CHECKOUT: Resposta MP:", JSON.stringify(mpData).substring(0, 300));

    if (!mpResponse.ok || !mpData.id) {
      return NextResponse.json({ 
        error: `Mercado Pago erro (${mpResponse.status}): ${mpData.message || JSON.stringify(mpData)}` 
      }, { status: 500 });
    }

    const qr_code = mpData.point_of_interaction?.transaction_data?.qr_code || '';
    const qr_code_base64 = mpData.point_of_interaction?.transaction_data?.qr_code_base64 || '';

    // PASSO 2: Salvar no Supabase
    console.log(">>> CHECKOUT: Salvando no Supabase...");
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );

    const { data: paymentData, error: dbError } = await supabaseAdmin
      .from('payments')
      .insert([{
        profile_id,
        amount: 80,
        status: 'pending',
        external_id: mpData.id.toString(),
        pix_qr_code: qr_code,
        pix_qr_code_base64: qr_code_base64,
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
    });

  } catch (error: any) {
    console.error('>>> CHECKOUT ERRO FATAL:', error);
    return NextResponse.json({ error: `Erro: ${error.message}` }, { status: 500 });
  }
}
