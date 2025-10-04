import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL; // fallback por si se define sin NEXT_PUBLIC_
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !anonKey) {
  // Evitar lanzar error duro en build; el login se ocultará si falta config.
  console.warn('[supabaseClient] Variables públicas de Supabase no configuradas.');
}

export const supabaseBrowser = createClient(supabaseUrl || 'http://localhost', anonKey || '');
