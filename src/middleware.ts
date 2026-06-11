import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-change-me"
);

async function getRole(req: NextRequest): Promise<string | null> {
  const token = req.cookies.get("edu_session")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return (payload as any).role as string;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const role = await getRole(req);

  const guards: { prefix: string; role: string; login: string }[] = [
    { prefix: "/admin", role: "ADMIN", login: "/login/admin" },
    { prefix: "/student", role: "STUDENT", login: "/login/student" },
    { prefix: "/parent", role: "PARENT", login: "/login/parent" },
  ];

  for (const g of guards) {
    if (pathname.startsWith(g.prefix)) {
      if (role !== g.role) {
        const url = req.nextUrl.clone();
        url.pathname = g.login;
        url.searchParams.set("from", pathname);
        return NextResponse.redirect(url);
      }
    }
  }

  // Keep the generic login entry smart, but allow role-specific login pages
  // so an existing/stale session can be replaced by signing in again.
  if (pathname === "/login" && role) {
    const dest =
      role === "ADMIN" ? "/admin" : role === "STUDENT" ? "/student" : "/parent";
    const url = req.nextUrl.clone();
    url.pathname = dest;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/student/:path*", "/parent/:path*", "/login/:path*"],
};
