import { NextRequest, NextResponse } from 'next/server';
import { validateCredentials, signAdminToken, TOKEN_COOKIE } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password required' },
        { status: 400 }
      );
    }

    if (!validateCredentials(username, password)) {
      // Slight delay to limit brute-force
      await new Promise((r) => setTimeout(r, 300));
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await signAdminToken(username);
    const response = NextResponse.json({ ok: true });

    response.cookies.set(TOKEN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 h
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
