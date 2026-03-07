import { cookies } from 'next/headers';
import { timingSafeEqual, createHash } from 'crypto';

const SESSION_COOKIE = 'admin_session';

/**
 * Comparación en tiempo constante para evitar timing attacks.
 * Ambos valores se hashean a longitud fija antes de comparar.
 */
function safeEqual(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a).digest();
  const hb = createHash('sha256').update(b).digest();
  return timingSafeEqual(ha, hb);
}

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
  if (!session?.value) return false;
  return safeEqual(session.value, secret);
}

export { safeEqual };

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 horas
