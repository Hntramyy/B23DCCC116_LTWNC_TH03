import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { can } from "@/lib/authorization";

export default auth((request) => {
  const role = request.auth?.user?.role ?? "guest";
  const path = request.nextUrl.pathname;

  if (path === "/" && role !== "guest") {
    return NextResponse.redirect(new URL("/deadlines", request.url));
  }

  if (path.startsWith("/admin") && !can(role, "access_admin")) {
    if (role === "guest") {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", `${path}${request.nextUrl.search}`);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.redirect(new URL("/403", request.url));
  }

  if (path.startsWith("/dashboard") && !can(role, "access_dashboard")) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", `${path}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/", "/dashboard/:path*", "/admin/:path*"],
};
