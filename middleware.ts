import { NextResponse } from "next/server";
export function middleware() {
  const response = NextResponse.next();
  const vary = response.headers.get("Vary");
  if (vary) {
    if (!vary.includes("Cookie"))
      response.headers.set("Vary", `${vary}, Cookie`);
  } else {
    response.headers.set("Vary", "Cookie");
  }
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
