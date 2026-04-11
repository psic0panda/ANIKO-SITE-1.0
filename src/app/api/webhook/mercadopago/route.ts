import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });
    const payment = new Payment(client);
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const dataId = searchParams.get('data.id');

    // Mercado Pago envia o ID do recurso na query string ou no body
    const body = await request.json();
    const id = dataId || body.data?.id;

    if (type === 'payment' && id) {
      // 1. Buscar status atual no Mercado Pago
      const mpPayment = await payment.get({ id });
      const status = mpPayment.status;

      if (status === 'approved') {
        // 2. Atualizar status na nossa tabela 'payments' usando Admin
        const { data: updatedPayment, error: paymentError } = await supabaseAdmin
          .from('payments')
          .update({ status: 'approved' })
          .eq('external_id', id.toString())
          .select()
          .single();

        if (paymentError) throw paymentError;

        // Opcional: Aqui você pode disparar outras ações, como e-mail pro admin
        console.log(`Pagamento ${id} aprovado para o perfil ${updatedPayment.profile_id}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Erro no Webhook:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
