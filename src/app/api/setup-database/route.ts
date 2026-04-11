import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  const body = await request.json();
  
  if (body.key !== 'aniko_admin_segredo_2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // Tentar verificar se a coluna existe fazendo um select
    const { error: checkError } = await supabase
      .from('profiles')
      .select('historico')
      .limit(1);

    if (checkError && checkError.message.includes('historico')) {
      // Coluna não existe, criar via RPC ou executar SQL diretamente
      // Como não temos acesso direto ao SQL, vamos retornar instrução
      return NextResponse.json({ 
        success: false, 
        error: 'Coluna não existe',
        instruction: 'Execute no Supabase SQL Editor: ALTER TABLE profiles ADD COLUMN historico text;'
      });
    }

    return NextResponse.json({ success: true, message: 'Coluna historico já existe ou foi verificada com sucesso!' });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message });
  }
}
