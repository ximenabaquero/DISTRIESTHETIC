import { getPool } from '@/lib/dbClient';

export interface ContactInfo {
  telefono: string;
  whatsapp: string;
  email: string;
}

const defaults: ContactInfo = {
  telefono: '304 683 1493',
  whatsapp: '573046831493',
  email: '',
};

export async function getContactInfo(): Promise<ContactInfo> {
  const pool = getPool();

  try {
    const { rows } = await pool.query(
      'SELECT telefono, whatsapp, email FROM contact_info WHERE id=1',
    );

    if (!rows[0]) {
      // Fila no existe aún → crearla con valores por defecto
      await pool.query(
        `INSERT INTO contact_info (id, telefono, whatsapp, email)
         VALUES (1, $1, $2, $3)
         ON CONFLICT (id) DO NOTHING`,
        [defaults.telefono, defaults.whatsapp, defaults.email],
      );
      return defaults;
    }

    const row = rows[0] as Record<string, unknown>;
    return {
      telefono: String(row.telefono ?? '').trim() || defaults.telefono,
      whatsapp: String(row.whatsapp ?? '').trim() || defaults.whatsapp,
      email: String(row.email ?? '').trim(),
    };
  } catch (e) {
    console.error('[contactInfoStore] Error obteniendo contact info:', e);
    return defaults;
  }
}

export async function updateContactInfo(info: ContactInfo): Promise<ContactInfo> {
  const pool = getPool();

  const sanitized: ContactInfo = {
    telefono: info.telefono.trim(),
    whatsapp: info.whatsapp.trim(),
    email: info.email.trim(),
  };

  await pool.query(
    `INSERT INTO contact_info (id, telefono, whatsapp, email)
     VALUES (1, $1, $2, $3)
     ON CONFLICT (id) DO UPDATE SET telefono=$1, whatsapp=$2, email=$3`,
    [sanitized.telefono, sanitized.whatsapp, sanitized.email],
  );

  return sanitized;
}
