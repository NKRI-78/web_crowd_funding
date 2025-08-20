import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // const userCookie = request.cookies.get("user")?.value;

  // const { pathname } = request.nextUrl;

  // if (userCookie && pathname === "/") {
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }

  // if (!userCookie && pathname.startsWith("/dashboard")) {
  //   return NextResponse.redirect(new URL("/", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/users", "/dashboard/:path*", "/auth/login"],
};
