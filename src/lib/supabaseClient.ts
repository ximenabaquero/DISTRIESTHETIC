// Extiende el tipo Window para evitar error de 'any'
declare global {
  interface Window {
    __SUPABASE_WARNED__?: boolean;
  }
}
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Usamos SOLO variables con prefijo NEXT_PUBLIC_ para que no haya ambigüedad.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabaseBrowser: SupabaseClient | null = null;
if (typeof window !== 'undefined') {
  if (supabaseUrl && anonKey) {
    supabaseBrowser = createClient(supabaseUrl, anonKey, { auth: { persistSession: true } });
  } else {
    // Mensaje único (evitar spam en modo react strict)
    if (!window.__SUPABASE_WARNED__) {
      console.warn('[supabaseClient] Faltan NEXT_PUBLIC_SUPABASE_URL y/o NEXT_PUBLIC_SUPABASE_ANON_KEY. Panel admin mostrará Configuración incompleta.');
      window.__SUPABASE_WARNED__ = true;
    }
  }
}

export { supabaseBrowser };
