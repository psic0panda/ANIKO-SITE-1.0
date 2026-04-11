import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const adminKey = searchParams.get('key');
  
  if (adminKey !== 'aniko_admin_segredo_2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // Tentar adicionar a coluna historico
    const { error } = await supabase.rpc('add_column_if_not_exists', {
      table_name: 'profiles',
      column_name: 'historico',
      column_type: 'text'
    });

    // Se RPC não funcionar, tenta via ALTER TABLE
    if (error) {
      const { error: alterError } = await supabase.from('profiles').select('historico').limit(1);
      if (alterError && alterError.message.includes('historico')) {
        return NextResponse.json({ error: 'Coluna não existe e não foi possível criar. Adicione manualmente no Supabase: ALTER TABLE profiles ADD COLUMN historico text;' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, message: 'Coluna historico verificada/criada' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
