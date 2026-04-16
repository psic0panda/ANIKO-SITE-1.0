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

  // 1. Buscar novos pedidos
  const { data: videoRequests, error: error1 } = await supabase
    .from('video_requests')
    .select(`id, description, status, created_at, profile_id, profiles(phone, child_name, parent_name, email)`)
    .order('created_at', { ascending: false });

  // 2. Buscar solicitações de alteração
  const { data: videoAlterations, error: error2 } = await supabase
    .from('videos')
    .select(`id, requested_alteration, status, created_at, profile_id, title, profiles(phone, child_name, parent_name, email)`)
    .eq('status', 'alteracao_solicitada')
    .order('created_at', { ascending: false });

  if (error1 || error2) {
    return NextResponse.json({ error: (error1?.message || error2?.message) }, { status: 500 });
  }

  // 3. Combinar e normalizar
  const combined = [
    ...(videoRequests || []).map(r => ({ ...r, is_alteration: false })),
    ...(videoAlterations || []).map(a => ({ 
      id: a.id, 
      description: a.requested_alteration, 
      status: a.status, 
      created_at: a.created_at, 
      profile_id: a.profile_id, 
      profiles: a.profiles,
      original_title: a.title, // Adicionamos o título original para contexto
      is_alteration: true 
    }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return NextResponse.json({ requests: combined });
}
