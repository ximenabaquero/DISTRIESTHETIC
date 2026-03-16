import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE, safeEqual } from '@/lib/adminAuth';

// ── Rate limiting: máximo 5 intentos de login por IP cada 15 minutos ────────
// Esto evita ataques de fuerza bruta (probar miles de contraseñas).
// Se guarda en memoria (Map), no en base de datos, así que se reinicia
// cuando el servidor se reinicia — es suficiente para protección básica.
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutos en milisegundos

function getClientIp(req: NextRequest): string {
  // x-forwarded-for viene de Vercel/proxies y puede tener varias IPs separadas por coma.
  // Se toma la primera (la del cliente real).
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  );
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);

  if (!entry || now > entry.resetAt) {
    // Primera vez o venció el tiempo → reiniciar contador
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false; // no está limitado
  }

  entry.count++; // sumar un intento
  return entry.count > MAX_ATTEMPTS; // true si superó el límite
}

function clearAttempts(ip: string) {
  // Cuando el login es exitoso, limpiar los intentos fallidos
  attempts.delete(ip);
}

// ── Endpoint POST /api/admin/login ──────────────────────────────────────────
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: 'Demasiados intentos. Espera 15 minutos e inténtalo de nuevo.' },
      { status: 429 }, // 429 = Too Many Requests
    );
  }

  try {
    const body = await request.json();
    // Normalizar: minúsculas y sin espacios para el email
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body?.password === 'string' ? body.password : '';

    // ADMIN_EMAILS puede tener varios correos separados por coma:
    // ej: "papa@gmail.com,yo@gmail.com"
    const rawEmails = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || '';
    const allowedEmails = rawEmails
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    const adminPassword = process.env.ADMIN_PASSWORD || '';
    const sessionSecret = process.env.ADMIN_SESSION_SECRET || '';

    // Si faltan variables de entorno, el panel no está configurado
    if (!allowedEmails.length || !adminPassword || !sessionSecret) {
      return NextResponse.json(
        { ok: false, error: 'Panel no configurado. Verificar variables de entorno.' },
        { status: 503 },
      );
    }

    // Verificar email y contraseña usando comparación en tiempo constante
    // (ver adminAuth.ts para explicación de por qué esto importa)
    const emailOk = allowedEmails.some((allowed) => safeEqual(email, allowed));
    const passwordOk = safeEqual(password, adminPassword);

    if (!emailOk || !passwordOk) {
      // Mensaje genérico: no revelar si el email existe o no
      return NextResponse.json(
        { ok: false, error: 'Correo o contraseña incorrectos.' },
        { status: 401 },
      );
    }

    // Login correcto → limpiar conteo de intentos fallidos
    clearAttempts(ip);

    const response = NextResponse.json({ ok: true, email });

    // Crear cookie de sesión HTTP-only:
    // - httpOnly: true → JavaScript no puede leerla (protege contra XSS)
    // - secure: true en producción → solo se envía por HTTPS
    // - sameSite: 'lax' → protege contra CSRF (no se envía desde otros sitios)
    // - maxAge: 8 horas → la sesión expira automáticamente
    response.cookies.set(SESSION_COOKIE_NAME, sessionSecret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE,
      path: '/',
    });
    return response;
  } catch {
    return NextResponse.json({ ok: false, error: 'Error inesperado.' }, { status: 500 });
  }
}
