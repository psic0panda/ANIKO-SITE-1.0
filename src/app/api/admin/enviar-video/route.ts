import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * API Administrativa para Enviar Vídeos
 * Bypasses RLS using Service Role Key
 */
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const adminKey = searchParams.get('key');
  
  // Verificação de Segurança Simples (Padrão do Projeto)
  if (adminKey !== 'aniko_admin_segredo_2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { profile_id, title, video_url, category, tags, request_id, is_alteration } = await request.json();

    if (!profile_id || !video_url) {
      return NextResponse.json({ error: 'Faltam dados obrigatórios (profile_id ou video_url).' }, { status: 400 });
    }

    // Inicializa Supabase com Service Role para ignorar RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Inserir o novo vídeo
    const { data, error } = await supabase
      .from('videos')
      .insert([
        {
          profile_id,
          title: title || "Sua nova animação!",
          video_url,
          category: category || "Personalizado",
          tags: tags || "",
        }
      ])
      .select();

    if (error) {
      console.error('Erro Supabase (Admin Insert):', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 2. Atualizar o status da solicitação se houver um ID
    if (request_id) {
      if (is_alteration) {
        // Se for alteração, limpamos o status de alteração solicitada no vídeo original
        await supabase
          .from('videos')
          .update({ status: 'concluido', requested_alteration: null })
          .eq('id', request_id);
      } else {
        // Se for pedido novo, marcamos como concluído na tabela de pedidos
        await supabase
          .from('video_requests')
          .update({ status: 'concluido' })
          .eq('id', request_id);
      }
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: 'Erro interno ao processar a requisição: ' + err.message }, { status: 500 });
  }
}
