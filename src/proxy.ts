import { NextRequest, NextResponse } from 'next/server';
import createNextIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { jwtVerify } from 'jose';

const intlMiddleware = createNextIntlMiddleware(routing);

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return false;
  try {
    const secret = new TextEncoder().encode(process.env.ADMIN_SECRET!);
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Admin API routes ────────────────────────────────────────────────────
  if (pathname.startsWith('/api/admin/')) {
    // Login endpoint must stay public and return JSON (no locale redirects).
    if (pathname === '/api/admin/auth/login') {
      return NextResponse.next();
    }

    if (!(await isAuthenticated(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.next();
  }

  // ── Admin UI routes ──────────────────────────────────────────────────────
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    if (pathname === '/admin/login') {
      if (await isAuthenticated(request)) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      return NextResponse.next();
    }
    if (!(await isAuthenticated(request))) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return NextResponse.next();
  }

  // ── i18n for public routes ───────────────────────────────────────────────
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};