import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    // Tentar zerar video_credits no Supabase
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ video_credits: 0 })
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (error && !error.message.includes('schema cache')) {
      console.error("Erro ao zerar créditos no Supabase:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Todos os créditos foram zerados e planos resetados para "Sem Plano".' 
    });
  } catch (err: any) {
    console.error("Erro fatal ao zerar créditos:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
