import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, setSession, Role } from "@/lib/auth";
import { ok, fail } from "@/lib/http";

export async function POST(req: NextRequest) {
  try {
    const { identifier, password, role } = await req.json();
    if (!identifier || !password || !role) {
      return fail("Please provide all required fields.");
    }

    const wantRole = role as Role;
    let user;
    if (wantRole === "ADMIN") {
      user = await prisma.user.findFirst({
        where: { email: String(identifier).toLowerCase().trim(), role: "ADMIN" },
      });
    } else {
      user = await prisma.user.findFirst({
        where: { code: String(identifier).toUpperCase().trim(), role: wantRole },
        include: { student: true, parent: true },
      });
    }

    if (!user || !user.active) {
      return fail("Invalid credentials or inactive account.", 401);
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) return fail("Invalid credentials.", 401);

    const pid =
      wantRole === "STUDENT"
        ? (user as any).student?.id
        : wantRole === "PARENT"
        ? (user as any).parent?.id
        : undefined;

    await setSession({
      uid: user.id,
      role: user.role as Role,
      name: user.name,
      pid,
    });

    return ok({ role: user.role, name: user.name });
  } catch (e) {
    console.error(e);
    return fail("Something went wrong. Please try again.", 500);
  }
}
