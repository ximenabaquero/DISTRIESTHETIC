import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE, safeEqual } from '@/lib/adminAuth';

// ── Rate limiting en memoria (5 intentos / 15 min por IP) ──────────────────
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

function getClientIp(req: NextRequest): string {
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
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > MAX_ATTEMPTS;
}

function clearAttempts(ip: string) {
  attempts.delete(ip);
}
// ───────────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: 'Demasiados intentos. Espera 15 minutos e inténtalo de nuevo.' },
      { status: 429 },
    );
  }

  try {
    const body = await request.json();
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body?.password === 'string' ? body.password : '';

    const rawEmails = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || '';
    const allowedEmails = rawEmails
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    const adminPassword = process.env.ADMIN_PASSWORD || '';
    const sessionSecret = process.env.ADMIN_SESSION_SECRET || '';

    if (!allowedEmails.length || !adminPassword || !sessionSecret) {
      return NextResponse.json(
        { ok: false, error: 'Panel no configurado. Verificar variables de entorno.' },
        { status: 503 },
      );
    }

    // Comparación en tiempo constante para email y contraseña
    const emailOk = allowedEmails.some((allowed) => safeEqual(email, allowed));
    const passwordOk = safeEqual(password, adminPassword);

    if (!emailOk || !passwordOk) {
      return NextResponse.json(
        { ok: false, error: 'Correo o contraseña incorrectos.' },
        { status: 401 },
      );
    }

    // Login correcto → limpiar intentos fallidos
    clearAttempts(ip);

    const response = NextResponse.json({ ok: true, email });
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
