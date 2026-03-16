import { cookies } from 'next/headers';
import { timingSafeEqual, createHash } from 'crypto';

const SESSION_COOKIE = 'admin_session';

// ── ¿Qué es un timing attack? ──────────────────────────────────────────────
// Si comparas dos strings con ===, JavaScript se detiene en el primer
// caracter diferente. Un atacante puede medir cuánto tarda la comparación
// para adivinar la contraseña caracter por caracter.
// La solución: hashear ambos valores con SHA256 (quedan del mismo tamaño)
// y compararlos con timingSafeEqual, que siempre tarda exactamente lo mismo
// sin importar cuándo difieran.
function safeEqual(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a).digest(); // hash de 32 bytes fijo
  const hb = createHash('sha256').update(b).digest();
  return timingSafeEqual(ha, hb); // comparación en tiempo constante
}

/**
 * Verifica que la petición tenga una cookie de sesión admin válida.
 * Se usa en las API routes protegidas del admin así:
 *
 *   if (!(await requireAdmin())) {
 *     return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
 *   }
 *
 * La cookie es HTTP-only: el navegador la envía automáticamente en cada
 * petición, pero JavaScript no puede leerla (protección extra contra XSS).
 */
export async function requireAdmin(): Promise<boolean> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    // Si falta la variable de entorno, nadie puede entrar (falla segura)
    console.warn('[adminAuth] ADMIN_SESSION_SECRET no está configurado.');
    return false;
  }
  const cookieStore = await cookies(); // lee las cookies del request actual
  const session = cookieStore.get(SESSION_COOKIE);
  if (!session?.value) return false; // no hay cookie → no está logueado
  // Comparar el valor de la cookie con el secret usando tiempo constante
  return safeEqual(session.value, secret);
}

export { safeEqual };

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 horas en segundos
