import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { code, profile_id } = await request.json();

    if (!code) {
      return NextResponse.json({ success: false, error: 'Cupom não informado.' }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );

    // 1. Buscar o cupom
    const { data: coupon, error } = await supabaseAdmin
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('active', true)
      .single();

    if (error || !coupon) {
      return NextResponse.json({ success: false, error: 'Cupom inválido ou expirado.' }, { status: 404 });
    }

    // 2. Verificar expiração
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return NextResponse.json({ success: false, error: 'Este cupom já expirou.' }, { status: 400 });
    }

    // 3. Verificar se o usuário já usou este cupom (se profile_id foi fornecido)
    if (profile_id) {
      const { data: existingPayment } = await supabaseAdmin
        .from('payments')
        .select('id')
        .eq('profile_id', profile_id)
        .eq('coupon_id', coupon.id)
        .eq('status', 'approved')
        .limit(1)
        .maybeSingle();

      if (existingPayment) {
        return NextResponse.json({ success: false, error: 'Você já utilizou este cupom em outra solicitação.' }, { status: 400 });
      }
    }

    return NextResponse.json({
      success: true,
      discount: coupon.discount_fixed,
      code: coupon.code,
      id: coupon.id
    });

  } catch (error: any) {
    console.error('Erro ao validar cupom:', error);
    return NextResponse.json({ success: false, error: 'Erro interno no servidor.' }, { status: 500 });
  }
}
