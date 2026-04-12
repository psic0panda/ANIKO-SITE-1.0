import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ success: false, error: 'Cupom não informado.' }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );

    const { data: coupon, error } = await supabaseAdmin
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('active', true)
      .single();

    if (error || !coupon) {
      return NextResponse.json({ success: false, error: 'Cupom inválido ou expirado.' }, { status: 404 });
    }

    // Verificar expiração
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return NextResponse.json({ success: false, error: 'Este cupom já expirou.' }, { status: 400 });
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
