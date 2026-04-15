import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  
  // Test actual Supabase connectivity
  let supabaseStatus = 'not_tested';
  let supabaseError = '';
  
  if (url && anonKey) {
    try {
      const client = createClient(url, anonKey);
      const { error } = await client.auth.getSession();
      if (error) {
        supabaseStatus = 'error';
        supabaseError = error.message;
      } else {
        supabaseStatus = 'connected';
      }
    } catch (e: unknown) {
      supabaseStatus = 'exception';
      supabaseError = e instanceof Error ? e.message : String(e);
    }
  }

  return NextResponse.json({
    supabaseStatus,
    supabaseError,
    urlPrefix: url ? url.substring(0, 30) + '...' : 'MISSING',
    anonKeyPrefix: anonKey ? anonKey.substring(0, 20) + '...' : 'MISSING',
    anonKeyFormat: anonKey.startsWith('eyJ') ? 'JWT' : anonKey.startsWith('sb_') ? 'sb_publishable' : 'unknown',
    hasServiceKey: !!serviceKey,
    hasGroq: !!process.env.GROQ_API_KEY,
    hasGemini: !!process.env.GEMINI_API_KEY,
    hasMP: !!process.env.MP_ACCESS_TOKEN,
    hasAdminUser: !!process.env.ADMIN_USER,
    hasAdminPass: !!process.env.ADMIN_PASS,
    adminUserValue: process.env.ADMIN_USER || 'MISSING',
    nodeEnv: process.env.NODE_ENV,
  });
}
