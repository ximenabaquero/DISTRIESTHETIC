import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET() {
  const ok = await requireAdmin();
  return NextResponse.json({ ok });
}
