// middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Example: Protect /dashboard route (only for logged-in users)
  if (pathname.startsWith("/dashboard")) {
    const token = req.cookies.get("sb-access-token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Example: Re-route API calls to Supabase
  if (pathname.startsWith("/api/")) {
    const url = req.nextUrl.clone();
    url.hostname = "YOUR-SUPABASE-PROJECT-REF.supabase.co";
    url.protocol = "https";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

// Specify routes where middleware should run
export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
