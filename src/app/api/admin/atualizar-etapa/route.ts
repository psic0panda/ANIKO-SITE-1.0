import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { key, requestId, isAlteration, currentStage, action } = body;

    if (key !== 'aniko_admin_segredo_2026') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!requestId) {
      return NextResponse.json({ error: 'ID da solicitação não informado.' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const tableName = isAlteration ? 'videos' : 'video_requests';

    // Ação 1: Apagar solicitação
    if (action === 'delete') {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', requestId);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ success: true, message: 'Solicitação removida com sucesso.' });
    }

    // Ação 2: Atualizar Etapa de Produção (Roteiro -> Voz -> Edição -> Concluído)
    if (action === 'update_stage') {
      // Tenta atualizar ambas as colunas (current_stage e status)
      const { error: updateErr } = await supabase
        .from(tableName)
        .update({ 
          current_stage: currentStage,
          status: currentStage 
        })
        .eq('id', requestId);

      if (updateErr) {
        // Se a coluna current_stage não existir na tabela, atualiza o status diretamente
        const { error: fallbackErr } = await supabase
          .from(tableName)
          .update({ status: currentStage })
          .eq('id', requestId);

        if (fallbackErr) {
          return NextResponse.json({ error: fallbackErr.message }, { status: 500 });
        }
      }

      return NextResponse.json({ success: true, currentStage });
    }

    return NextResponse.json({ error: 'Ação inválida.' }, { status: 400 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro interno no servidor.' }, { status: 500 });
  }
}
