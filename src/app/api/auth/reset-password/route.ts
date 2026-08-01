import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { email, redirectTo } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Por favor, informe seu e-mail.' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Configuração do Supabase ausente.' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const targetRedirect = redirectTo || `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/resetar-senha`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: targetRedirect,
    });

    if (error) {
      console.error('[Reset Password API Error]', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'E-mail de recuperação enviado! Verifique sua caixa de entrada.' 
    });
  } catch (err: any) {
    console.error('[Reset Password Server Error]', err);
    return NextResponse.json({ 
      error: 'Erro de conexão no servidor. Tente novamente em instantes.' 
    }, { status: 500 });
  }
}
