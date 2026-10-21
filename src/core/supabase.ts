import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured: boolean = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('placeholder')
);

if (!isSupabaseConfigured) {
  console.info(
    '%c[Halka Hayat OS]%c Supabase URL/Key henüz bağlanmadı. Sistem yerel depolama (Local-First) moduyla çalışıyor. Bulut senkronizasyonu için .env dosyasını doldurabilirsiniz.',
    'color: #38bdf8; font-weight: bold;',
    'color: #94a3b8;'
  );
}

/**
 * Singleton Supabase Client
 */
export const supabase: SupabaseClient = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'halka_auth_token',
    },
  }
);
