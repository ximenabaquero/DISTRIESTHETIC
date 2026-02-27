import type { SupabaseClient } from '@supabase/supabase-js';

export interface ContactInfo {
  telefono: string;
  whatsapp: string;
}

const defaults: ContactInfo = {
  telefono: '304 683 1493',
  whatsapp: '573046831493',
};

let supabase: SupabaseClient | null = null;

async function getSupabase(): Promise<SupabaseClient | null> {
  if (supabase) return supabase;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  const { createClient } = await import('@supabase/supabase-js');
  supabase = createClient(url, key, { auth: { persistSession: false } });
  return supabase;
}

export async function getContactInfo(): Promise<ContactInfo> {
  const sb = await getSupabase();
  if (!sb) return defaults;

  const { data, error } = await sb
    .from('contact_info')
    .select('telefono, whatsapp')
    .eq('id', 1)
    .single();

  if (error || !data) {
    // Fila no existe aún, crearla con los valores por defecto
    await sb
      .from('contact_info')
      .upsert({ id: 1, ...defaults }, { onConflict: 'id' });
    return defaults;
  }

  return {
    telefono: (data.telefono as string)?.trim() || defaults.telefono,
    whatsapp: (data.whatsapp as string)?.trim() || defaults.whatsapp,
  };
}

export async function updateContactInfo(info: ContactInfo): Promise<ContactInfo> {
  const sb = await getSupabase();
  if (!sb) throw new Error('Supabase no configurado. Verificar SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.');

  const sanitized: ContactInfo = {
    telefono: info.telefono.trim(),
    whatsapp: info.whatsapp.trim(),
  };

  const { error } = await sb
    .from('contact_info')
    .upsert({ id: 1, ...sanitized }, { onConflict: 'id' });

  if (error) throw new Error(error.message);
  return sanitized;
}
