import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (pathname.startsWith('/spotify') || pathname.startsWith('/api/spotify')) {
    const res = NextResponse.next()
    res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet')
    return res
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/spotify/:path*', '/api/spotify/:path*'],
}
