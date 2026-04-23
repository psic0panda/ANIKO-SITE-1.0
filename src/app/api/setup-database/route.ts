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
      return NextResponse.json({ 
        success: false, 
        error: 'Coluna historico não existe em profiles',
        instruction: 'Execute no Supabase: ALTER TABLE profiles ADD COLUMN historico text;'
      });
    }

    // Função auxiliar para tentar criar coluna via RPC
    const tryCreateColumn = async (tableName: string, columnName: string, columnType: string, defaultValue?: string) => {
      try {
        await supabase.rpc('add_column_if_not_exists', {
          table_name: tableName,
          column_name: columnName,
          column_type: columnType
        });
        if (defaultValue) {
          // Tentar definir valor padrão se necessário (opcional, pode falhar se não houver permissão)
          // Mas o RPC add_column_if_not_exists geralmente não suporta default value no argumento
        }
      } catch (e) {
        console.error(`Erro ao tentar criar coluna ${columnName}:`, e);
      }
    };

    // Verificar is_win, tags, status, requested_alteration em videos
    const { error: videoError } = await supabase
      .from('videos')
      .select('is_win, tags, status, requested_alteration')
      .limit(1);

    if (videoError) {
      if (videoError.message.includes('is_win')) {
        await tryCreateColumn('videos', 'is_win', 'boolean');
      }
      if (videoError.message.includes('tags')) {
        await tryCreateColumn('videos', 'tags', 'text');
      }
      if (videoError.message.includes('status')) {
        await tryCreateColumn('videos', 'status', 'text');
      }
      if (videoError.message.includes('requested_alteration')) {
        await tryCreateColumn('videos', 'requested_alteration', 'text');
      }
      
      // Re-verificar após tentativa
      const { error: videoErrorRetry } = await supabase
        .from('videos')
        .select('is_win, tags, status, requested_alteration')
        .limit(1);
      
      if (videoErrorRetry) {
        return NextResponse.json({ 
          success: false, 
          error: 'Não foi possível auto-corrigir as colunas em "videos".',
          detail: videoErrorRetry.message,
          instruction: 'Execute no Supabase SQL Editor: ALTER TABLE videos ADD COLUMN IF NOT EXISTS status text DEFAULT \'concluido\'; ALTER TABLE videos ADD COLUMN IF NOT EXISTS requested_alteration text; ALTER TABLE videos ADD COLUMN IF NOT EXISTS is_win boolean DEFAULT false; ALTER TABLE videos ADD COLUMN IF NOT EXISTS tags text;'
        });
      }
    }

    // Verificar tabela video_requests
    const { error: requestError } = await supabase
      .from('video_requests')
      .select('id')
      .limit(1);

    if (requestError && requestError.message.includes('relation "video_requests" does not exist')) {
       // Tentar criar tabela via RPC (se houver um RPC para isso, improvável)
      return NextResponse.json({ 
        success: false, 
        error: 'Tabela video_requests não existe',
        instruction: 'Execute no Supabase SQL Editor: CREATE TABLE IF NOT EXISTS video_requests (id uuid DEFAULT uuid_generate_v4() PRIMARY KEY, profile_id uuid REFERENCES profiles(id), description text, status text DEFAULT \'pendente\', created_at timestamp with time zone DEFAULT now());'
      });
    }

    return NextResponse.json({ success: true, message: 'Banco de dados verificado e corrigido com sucesso!' });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message });
  }
}
