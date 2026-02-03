import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const userStatus = request.cookies.get("userStatus")?.value;
  const { pathname } = request.nextUrl;

  // Rutas públicas de autenticación (no requieren token)
  const publicAuthPaths = ["/login", "/register", "/forgot-password", "/reset-password"];
  const isPublicAuthPath = publicAuthPaths.some(path => pathname === path || pathname.startsWith(`${path}/`));

  // Rutas de estado especial
  const _isAuthPending = pathname === "/pending";
  const _isAuthSuspended = pathname === "/suspended";

  // Rutas protegidas (requieren token)
  const protectedPaths = ["/dashboard", "/academy", "/challenges", "/classes", "/jobs", "/profile"];
  const isProtectedPath = protectedPaths.some(path => pathname === path || pathname.startsWith(`${path}/`));

  // 1. Sin token intentando acceder a ruta protegida → login
  if (!token && isProtectedPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. Con token y activo intentando acceder a login/register → dashboard
  if (token && userStatus === "ACTIVE" && isPublicAuthPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 3. Con token pero PENDING, no en /pending → redirigir
  if (token && userStatus === "PENDING" && isProtectedPath) {
    return NextResponse.redirect(new URL("/pending", request.url));
  }

  // 4. Con token pero SUSPENDED, no en /suspended → redirigir
  if (token && userStatus === "SUSPENDED" && isProtectedPath) {
    return NextResponse.redirect(new URL("/suspended", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/academy/:path*",
    "/challenges/:path*",
    "/classes/:path*",
    "/jobs/:path*",
    "/profile/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/pending",
    "/suspended",
  ],
};
