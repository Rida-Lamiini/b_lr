import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard")
  const isOnSetup = req.nextUrl.pathname === "/setup"
  const isOnLogin = req.nextUrl.pathname === "/login"
  const isOnApi = req.nextUrl.pathname.startsWith("/api")

  if (isOnApi) {
    return NextResponse.next()
  }

  if (isLoggedIn && (isOnLogin || isOnSetup)) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
  }

  if (!isLoggedIn && isOnDashboard) {
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  }

  // Check if user exists, if not, redirect to setup
  // But since auth is called, and if no user, but for now, assume user exists or handle in pages

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
  runtime: 'nodejs',
}