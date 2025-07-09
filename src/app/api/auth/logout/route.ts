import { NextResponse } from 'next/server';
import { clearAuthCookies } from '@/lib/auth/auth';

export async function POST() {
  const response = await clearAuthCookies();
  return NextResponse.json(
    { success: true },
    {
      headers: {
        'Set-Cookie': response.headers.get('Set-Cookie') || '',
      }
    }
  );
}
