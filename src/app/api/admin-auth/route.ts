import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { user, pass } = await request.json();

  const ADMIN_USER = process.env.ADMIN_USER || 'admin';
  const ADMIN_PASS = process.env.ADMIN_PASS || 'aniko2026';

  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false }, { status: 401 });
}
