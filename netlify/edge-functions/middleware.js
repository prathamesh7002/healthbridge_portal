// This file is used by Netlify Edge Functions
export default async function middleware(request) {
  try {
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    // Skip static files and API routes
    if (
      pathname.startsWith('/_next/') ||
      pathname.startsWith('/api/') ||
      pathname.startsWith('/static/') ||
      pathname.includes('.') ||
      pathname.includes('__next')
    ) {
      return new Response(null, { status: 200 });
    }

    // Handle locale detection and redirection
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = Object.fromEntries(
      cookieHeader.split(';').map(c => {
        const [key, ...values] = c.trim().split('=');
        return [key, values.join('=')];
      })
    );
    
    const locale = cookies.NEXT_LOCALE || 'en';
    const pathLocale = ['en', 'hi', 'mr'].find(loc => 
      pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`
    );

    // If no locale in path, redirect to include locale
    if (!pathLocale) {
      const newUrl = new URL(`/${locale}${pathname}`, request.url);
      return Response.redirect(newUrl, 307);
    }

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error('Edge Function error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export const config = {
  path: '/*',
};
