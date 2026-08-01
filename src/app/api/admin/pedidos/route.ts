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

  // 1. Buscar novos pedidos (com current_stage)
  let videoRequests: any[] = [];
  try {
    const { data, error: error1 } = await supabase
      .from('video_requests')
      .select(`id, description, status, current_stage, created_at, profile_id, profiles(phone, child_name, parent_name, email)`)
      .order('created_at', { ascending: false });
    
    if (error1) {
      console.warn('Erro ao buscar video_requests com current_stage, tentando fallback:', error1.message);
      // Fallback sem current_stage se a coluna ainda não existir
      const { data: fallbackData } = await supabase
        .from('video_requests')
        .select(`id, description, status, created_at, profile_id, profiles(phone, child_name, parent_name, email)`)
        .order('created_at', { ascending: false });
      videoRequests = fallbackData || [];
    } else {
      videoRequests = data || [];
    }
  } catch (e) {
    console.error('Exceção ao buscar video_requests:', e);
  }

  // 2. Buscar solicitações de alteração
  let videoAlterations: any[] = [];
  try {
    const { data, error: error2 } = await supabase
      .from('videos')
      .select(`id, requested_alteration, status, current_stage, created_at, profile_id, title, profiles(phone, child_name, parent_name, email)`)
      .eq('status', 'alteracao_solicitada')
      .order('created_at', { ascending: false });

    if (error2) {
      console.warn('Erro ao buscar videoAlterations com current_stage, tentando fallback:', error2.message);
      const { data: fallbackAlterations } = await supabase
        .from('videos')
        .select(`id, requested_alteration, status, created_at, profile_id, title, profiles(phone, child_name, parent_name, email)`)
        .eq('status', 'alteracao_solicitada')
        .order('created_at', { ascending: false });
      videoAlterations = fallbackAlterations || [];
    } else {
      videoAlterations = data || [];
    }
  } catch (e) {
    console.error('Exceção ao buscar videoAlterations:', e);
  }

  // 3. Combinar e normalizar
  const combined = [
    ...(videoRequests || []).map(r => ({ 
      ...r, 
      current_stage: r.current_stage || r.status || 'roteiro',
      is_alteration: false 
    })),
    ...(videoAlterations || []).map(a => ({ 
      id: a.id, 
      description: a.requested_alteration, 
      status: a.status, 
      current_stage: a.current_stage || a.status || 'roteiro',
      created_at: a.created_at, 
      profile_id: a.profile_id, 
      profiles: a.profiles,
      original_title: a.title,
      is_alteration: true 
    }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return NextResponse.json({ requests: combined });
}
