import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        const { pathname } = req.nextUrl;

        // Allow public routes
        if (
          pathname.startsWith("/api/auth") ||
          pathname.startsWith("/login") ||
          pathname === "/register"
        ) {
          return true;
        }

        // Protect API routes
        if (
          pathname.startsWith("/api/videos") ||
          pathname === "/"
        ) {
          return !!token; 
        }

        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
