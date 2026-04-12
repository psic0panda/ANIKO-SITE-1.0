import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasGroq: !!process.env.GROQ_API_KEY,
    hasGemini: !!process.env.GEMINI_API_KEY,
    hasSupabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasMP: !!process.env.MP_ACCESS_TOKEN,
    nodeEnv: process.env.NODE_ENV,
  });
}
