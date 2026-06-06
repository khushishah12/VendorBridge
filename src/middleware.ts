import { NextRequest, NextResponse } from 'next/server'

// Edge-compatible JWT verification helper using Web Crypto API
async function verifyJWTHS256(token: string, secret: string): Promise<any | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;

    const encoder = new TextEncoder();
    const secretBytes = encoder.encode(secret);
    const key = await crypto.subtle.importKey(
      'raw',
      secretBytes,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const dataBytes = encoder.encode(`${headerB64}.${payloadB64}`);
    
    // Base64URL Decode helper
    const base64UrlDecode = (str: string) => {
      let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) {
        base64 += '=';
      }
      return atob(base64);
    };

    const sigBytes = (() => {
      const binaryString = base64UrlDecode(signatureB64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
    })();

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes,
      dataBytes
    );

    if (!isValid) return null;

    const payloadJson = base64UrlDecode(payloadB64);
    const payload = JSON.parse(payloadJson);

    // Check expiration
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return null;
    }

    return payload;
  } catch (err) {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if it is a protected route prefix
  const protectedPrefixes = [
    '/procurement',
    '/vendor',
    '/manager',
    '/admin',
    '/purchase-orders',
    '/invoices',
    '/quotations',
    '/rfqs',
    '/vendors',
    '/approvals',
    '/notifications',
  ]

  const isProtectedRoute = protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + '/')
  )

  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // Get token from cookie
  const token = request.cookies.get('token')?.value || null

  if (!token) {
    // Redirect unauthenticated user to login
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
  const payload = await verifyJWTHS256(token, secret)

  if (!payload) {
    // Clear invalid session cookie and redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('token')
    return response
  }

  // Enforce role-based dashboard routing protection
  const dbRole = payload.role // e.g. "PROCUREMENT_OFFICER", "VENDOR", "MANAGER", "ADMIN"
  const role = dbRole === 'PROCUREMENT_OFFICER' ? 'procurement' : dbRole.toLowerCase()

  if (pathname.startsWith('/procurement') && role !== 'procurement' && role !== 'admin') {
    return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url))
  }
  if (pathname.startsWith('/vendor') && role !== 'vendor' && role !== 'admin') {
    return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url))
  }
  if (pathname.startsWith('/manager') && role !== 'manager' && role !== 'admin') {
    return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url))
  }
  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
