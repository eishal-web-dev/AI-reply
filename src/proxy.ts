import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");
  if (isDashboard && !req.auth) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
