import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'hi', 'mr'],
  defaultLocale: 'en'
});

export const config = {
  // Skip all paths that should not be internationalized. This example skips the
  // folders "api", "images" and "_next" (that contain static assets)
  matcher: ['/((?!api|images|_next).*)']
};