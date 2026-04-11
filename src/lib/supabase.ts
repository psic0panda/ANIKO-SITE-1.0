import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Functional database features will not work until .env.local is configured.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// URL base do site para redirecionamentos (Auth, Emails, etc)
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 
                       (typeof window !== 'undefined' ? window.location.origin : '');
