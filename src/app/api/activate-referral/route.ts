import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { user_id, referral_code } = await request.json();

    if (!user_id || !referral_code) {
      return NextResponse.json({ error: 'Dados incompletos.' }, { status: 400 });
    }

    const cleanCode = referral_code.trim().toUpperCase();

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Buscar o perfil da pessoa que está tentando ativar
    const { data: myProfile, error: myProfileErr } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user_id)
      .single();

    if (myProfileErr || !myProfile) {
      return NextResponse.json({ error: 'Perfil não encontrado.' }, { status: 404 });
    }

    // 2. Verificar se este usuário já ativou algum código de indicação antes
    if (myProfile.used_referral_code) {
      return NextResponse.json({ error: 'Você já ativou um código de indicação nesta conta anteriormente.' }, { status: 400 });
    }

    // 3. Buscar quem é o dono do código inserido
    // Código de indicação é derivado do ID do usuário (ex: primeiros 8 caracteres do ID em maiúsculo ou busca por id diretamente)
    const { data: referrerProfiles, error: referrerErr } = await supabaseAdmin
      .from('profiles')
      .select('*');

    if (referrerErr || !referrerProfiles) {
      return NextResponse.json({ error: 'Erro ao buscar o código de indicação.' }, { status: 500 });
    }

    const referrer = referrerProfiles.find((p: any) => 
      p.id.substring(0, 8).toUpperCase() === cleanCode || p.id.toUpperCase() === cleanCode
    );

    if (!referrer) {
      return NextResponse.json({ error: 'Código de indicação inválido. Verifique o código e tente novamente.' }, { status: 404 });
    }

    // 4. Bloquear se a pessoa estiver tentando ativar o próprio código
    if (referrer.id === user_id) {
      return NextResponse.json({ error: 'Você não pode ativar o seu próprio código de indicação!' }, { status: 400 });
    }

    // 5. Marcar que o novo usuário já usou um código
    await supabaseAdmin
      .from('profiles')
      .update({ used_referral_code: cleanCode })
      .eq('id', user_id);

    // 6. Atualizar a contagem do indicador
    const currentCount = referrer.referral_count || 0;
    const newCount = currentCount + 1;
    let newCredits = referrer.video_credits || 0;
    let rewarded = false;

    // A cada 2 indicações completadas, concede +1 crédito (1 Aniko)
    if (newCount % 2 === 0) {
      newCredits += 1;
      rewarded = true;
    }

    await supabaseAdmin
      .from('profiles')
      .update({ 
        referral_count: newCount,
        video_credits: newCredits 
      })
      .eq('id', referrer.id);

    return NextResponse.json({ 
      success: true, 
      rewarded,
      message: rewarded 
        ? 'Código ativado com sucesso! O indicador ganhou +1 crédito de animação!' 
        : 'Código ativado com sucesso! Falta apenas mais 1 indicação para seu amigo ganhar +1 crédito.'
    });

  } catch (err: any) {
    console.error('ERRO AO ATIVAR INDICAÇÃO:', err);
    return NextResponse.json({ error: err.message || 'Erro interno ao ativar indicação.' }, { status: 500 });
  }
}
