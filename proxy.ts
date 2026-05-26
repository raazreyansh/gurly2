import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Admin protection — redirect to login if not authenticated
  // Full auth check requires server-side Supabase session validation
  if (pathname.startsWith("/admin")) {
    // In production: validate session cookie here
    // const session = await getServerSession(request)
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.redirect(new URL('/login', request.url))
    // }
  }

  // Security headers
  const response = NextResponse.next()
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

  return response
}

export const config = {
  matcher: ["/admin/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
}
