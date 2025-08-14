import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['en', 'hi', 'mr'],
  defaultLocale: 'en',
  // Add path prefix for all locales except default
  localePrefix: 'as-needed'
});

export default function middleware(request: NextRequest) {
  try {
    // Apply the intl middleware
    return intlMiddleware(request);
  } catch (error) {
    console.error('Middleware error:', error);
    // Return a proper error response
    return NextResponse.next();
  }
}

export const config = {
  // Specify the runtime environment
  runtime: 'edge',
  
  // Skip all paths that should not be internationalized
  matcher: [
    '/((?!api|images|_next|_vercel|.*\..*).*)',
    '/',
    '/(hi|mr)/:path*'
  ]
};