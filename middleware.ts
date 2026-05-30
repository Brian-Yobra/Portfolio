import { NextRequest, NextResponse } from 'next/server';
import { isValidSession } from '@/lib/auth';

/** Routes that require admin authentication */
const PROTECTED = [
  /^\/admin(\/|$)/,           // /admin and all sub-paths
  /^\/blog\/new(\/|$)/,       // /blog/new
  /^\/blog\/.+\/edit(\/|$)/,  // /blog/[slug]/edit
];

/** Public routes that are always accessible (e.g. the login page itself) */
const PUBLIC_EXCEPTIONS = [/^\/admin\/login(\/|$)/];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED.some((r) => r.test(pathname));
  const isPublicException = PUBLIC_EXCEPTIONS.some((r) => r.test(pathname));

  if (!isProtected || isPublicException) {
    return NextResponse.next();
  }

  const cookieHeader = req.headers.get('cookie');
  if (await isValidSession(cookieHeader)) {
    return NextResponse.next();
  }

  // Redirect unauthenticated requests to login, preserving the intended destination
  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = '/admin/login';
  loginUrl.searchParams.set('next', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/admin/:path*', '/blog/new', '/blog/:slug/edit'],
};
