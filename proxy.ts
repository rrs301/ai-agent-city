import { NextResponse, type NextRequest } from "next/server";

// Fast optimistic check only; app/dashboard/page.tsx verifies the session with CloudHike.
export function proxy(request: NextRequest) {
  if (!request.cookies.has("session")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*"] };
