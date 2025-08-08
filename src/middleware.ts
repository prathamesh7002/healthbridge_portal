import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'hi', 'mr'],
  defaultLocale: 'en'
});

export const config = {
  // Skip all paths that should not be internationalized. This example skips the
  // folders "api", "images" and "_next" (that contain static assets)
  // Also skip new app sections that don't use locale prefixes
  matcher: ['/((?!api|images|_next|doctor|patient).*)']
};