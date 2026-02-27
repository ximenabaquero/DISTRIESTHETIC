import { cookies } from 'next/headers';

const SESSION_COOKIE = 'admin_session';

/**
 * Verifica que la petición tenga una cookie de sesión admin válida.
 * Usar en todas las rutas API que mutan datos.
 */
export async function requireAdmin(): Promise<boolean> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    console.warn('[adminAuth] ADMIN_SESSION_SECRET no está configurado.');
    return false;
  }
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  return session?.value === secret;
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 horas
