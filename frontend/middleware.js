import { NextResponse } from 'next/server'

export function middleware(request) {
  const response = NextResponse.next()

  // Set CSP headers for hCaptcha
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://newassets.hcaptcha.com https://*.hcaptcha.com blob:; style-src 'self' 'unsafe-inline' https://newassets.hcaptcha.com https://*.hcaptcha.com; frame-src 'self' https://newassets.hcaptcha.com https://*.hcaptcha.com; connect-src 'self' https://newassets.hcaptcha.com https://*.hcaptcha.com https://api.stripe.com; img-src 'self' data: https:; font-src 'self' data: https:;"
  )

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
