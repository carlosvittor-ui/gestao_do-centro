// supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Faltam VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY nas variáveis de ambiente do Vercel.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
