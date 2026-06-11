import { NextResponse } from "next/server";
import { getSession, Role, SessionPayload } from "./auth";

export function ok(data: unknown = {}, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, init);
}

export function fail(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function guard(roles: Role | Role[]): Promise<
  | { session: SessionPayload; error: null }
  | { session: null; error: NextResponse }
> {
  const session = await getSession();
  const allowed = Array.isArray(roles) ? roles : [roles];
  if (!session) {
    return { session: null, error: fail("Not authenticated", 401) };
  }
  if (!allowed.includes(session.role)) {
    return { session: null, error: fail("Forbidden", 403) };
  }
  return { session, error: null };
}
