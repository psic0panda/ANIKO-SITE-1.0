import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ADMIN_SECRET = 'aniko_admin_segredo_2026';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const adminKey = searchParams.get('key');
  
  if (adminKey !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: coupons, error } = await supabase
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ coupons });
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const adminKey = searchParams.get('key');
  
  if (adminKey !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { code, discount_fixed, active, expires_at } = body;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from('coupons')
    .insert([{ 
      code: code.toUpperCase(), 
      discount_fixed: parseInt(discount_fixed), 
      active: active !== undefined ? active : true,
      expires_at: expires_at || null
    }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, coupon: data });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const adminKey = searchParams.get('key');
  const id = searchParams.get('id');
  
  if (adminKey !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!id) {
     return NextResponse.json({ error: 'ID not provided' }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabase
    .from('coupons')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
