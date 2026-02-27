import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE } from '@/lib/adminAuth';

export async function POST(request: NextRequest) {
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

    if (!allowedEmails.includes(email) || password !== adminPassword) {
      return NextResponse.json(
        { ok: false, error: 'Correo o contraseña incorrectos.' },
        { status: 401 },
      );
    }

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
