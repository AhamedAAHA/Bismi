import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail, guard } from "@/lib/http";

export async function GET() {
  const { error } = await guard("ADMIN");
  if (error) return error;
  const list = await prisma.announcement.findMany({ orderBy: { createdAt: "desc" } });
  return ok(list);
}

export async function POST(req: NextRequest) {
  const { error } = await guard("ADMIN");
  if (error) return error;
  const b = await req.json();
  if (!b.title || !b.body) return fail("Title and message are required.");
  const a = await prisma.announcement.create({
    data: { title: b.title, body: b.body, audience: b.audience || "ALL" },
  });
  return ok(a);
}
