import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Jika sudah login dan mencoba akses halaman auth
    if (token && path.startsWith("/auth")) {
      const url = req.nextUrl.clone();
      url.pathname = token.role === "ADMIN" ? "/admin" : "/dashboard";
      return NextResponse.redirect(url);
    }

    // Jika USER coba akses /admin
    if (path.startsWith("/admin") && token?.role !== "ADMIN") {
      // Redirect ke dashboard
      const url = req.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Biarkan lolos untuk route auth agar middleware utama bisa handle check session
        const path = req.nextUrl?.pathname;
        if (path && path.startsWith("/auth")) {
           return true; 
        }
        
        // Hanya izinkan jika ada token (sudah login)
        return !!token;
      },
    },
    pages: {
      signIn: "/auth/login",
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/mission/:path*",
    "/leaderboard",
    "/map",
    "/profile",
    "/province/:path*",
    "/auth/:path*",
  ],
};
