import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, guard } from "@/lib/http";

export async function GET() {
  const { error } = await guard("ADMIN");
  if (error) return error;
  const settings = await prisma.setting.findMany();
  const map: Record<string, string> = {};
  settings.forEach((s) => (map[s.key] = s.value));
  return ok(map);
}

export async function PUT(req: NextRequest) {
  const { error } = await guard("ADMIN");
  if (error) return error;
  const b = await req.json();
  const entries = Object.entries(b as Record<string, string>);
  for (const [key, value] of entries) {
    await prisma.setting.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    });
  }
  return ok();
}
