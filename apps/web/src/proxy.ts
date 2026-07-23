import { type NextRequest, NextResponse } from "next/server";

/**
 * Next.js 16 proxy handler (formerly middleware.ts).
 *
 * Sets security headers on all responses. This is the first
 * defense layer — authorization is always enforced at the
 * data layer (Server Actions / Route Handlers).
 */
export function proxy(_request: NextRequest): NextResponse {
  const response = NextResponse.next();
  const { headers } = response;

  // ─── Content Security Policy ────────────────────────────
  // Start with a restrictive CSP; loosen per-route as needed.
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Loosen for dev; tighten in prod
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");

  headers.set("Content-Security-Policy", csp);

  // ─── Security Headers ──────────────────────────────────
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("X-XSS-Protection", "1; mode=block");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  // HSTS — only in production
  if (process.env.NODE_ENV === "production") {
    headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, robots.txt, sitemap.xml
     * - public folder assets
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|public/).*)",
  ],
};
