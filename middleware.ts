import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/auth"

export async function middleware(request: NextRequest) {
  const session = await auth()

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith("/dashboard") && !session) {
    return NextResponse.redirect(
      new URL("/login?callbackUrl=" + encodeURIComponent(request.nextUrl.pathname), request.url),
    )
  }

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith("/dashboard/admin") && session?.user?.email !== "pharmaciemozart@gmail.com") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Redirect to dashboard if already logged in and trying to access login page
  if (request.nextUrl.pathname === "/login" && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
}
