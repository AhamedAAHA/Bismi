import { NextRequest } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getSession } from "@/lib/auth";
import { ok, fail } from "@/lib/http";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return fail("Not authenticated", 401);

  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return fail("No file provided.");
    if (file.size > 8 * 1024 * 1024) return fail("File too large (max 8MB).");

    const allowed = ["application/pdf", "image/png", "image/jpeg", "image/jpg", "image/webp", "text/plain"];
    if (file.type && !allowed.includes(file.type)) {
      return fail("Only PDF, image or text files are allowed.");
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    const safe = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const filename = `${Date.now()}-${Math.floor(Math.random() * 1e4)}-${safe}`;
    await writeFile(path.join(dir, filename), bytes);

    return ok({ url: `/uploads/${filename}`, name: file.name });
  } catch (e) {
    console.error(e);
    return fail("Upload failed.", 500);
  }
}
