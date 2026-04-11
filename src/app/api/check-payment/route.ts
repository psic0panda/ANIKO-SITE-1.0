import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(request: Request) {
  try {
    const { payment_id } = await request.json();

    if (!payment_id) {
      return NextResponse.json({ error: 'payment_id necessário' }, { status: 400 });
    }

    // 1. Buscar o pagamento no nosso banco
    const { data: payment, error: dbError } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('id', payment_id)
      .single();

    if (dbError || !payment) {
      return NextResponse.json({ error: 'Pagamento não encontrado' }, { status: 404 });
    }

    // Se já está aprovado no nosso banco, retornar direto
    if (payment.status === 'approved') {
      return NextResponse.json({ status: 'approved' });
    }

    // 2. Consultar o status atualizado no Mercado Pago
    const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${payment.external_id}`, {
      headers: {
        'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      },
    });

    const mpData = await mpResponse.json();
    const mpStatus = mpData.status; // 'approved', 'pending', 'rejected', etc.

    // 3. Se o MP confirmou, atualizar no nosso banco
    if (mpStatus === 'approved') {
      await supabaseAdmin
        .from('payments')
        .update({ status: 'approved' })
        .eq('id', payment_id);
    }

    return NextResponse.json({ status: mpStatus });

  } catch (error: any) {
    console.error('>>> CHECK-PAYMENT ERRO:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
