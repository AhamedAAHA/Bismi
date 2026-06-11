import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail, guard } from "@/lib/http";
import { sendEmail } from "@/lib/email";

export async function GET() {
  const { error } = await guard("ADMIN");
  if (error) return error;
  const emails = await prisma.emailNotification.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return ok(emails);
}

// Send a custom email to a parent / all parents
export async function POST(req: NextRequest) {
  const { error } = await guard("ADMIN");
  if (error) return error;
  try {
    const b = await req.json();
    if (!b.subject || !b.body) return fail("Subject and message are required.");

    let recipients: { email: string; name: string; parentId?: string }[] = [];
    if (b.target === "ALL") {
      const parents = await prisma.parent.findMany({ include: { user: true } });
      recipients = parents
        .filter((p) => p.user.email)
        .map((p) => ({ email: p.user.email!, name: p.user.name, parentId: p.id }));
    } else if (b.parentId) {
      const parent = await prisma.parent.findUnique({
        where: { id: b.parentId },
        include: { user: true },
      });
      if (parent?.user.email)
        recipients = [{ email: parent.user.email, name: parent.user.name, parentId: parent.id }];
    } else if (b.email) {
      recipients = [{ email: b.email, name: b.name || "" }];
    }

    if (!recipients.length) return fail("No valid recipients found (missing email).");

    for (const r of recipients) {
      await sendEmail({
        to: r.email,
        toName: r.name,
        subject: b.subject,
        html: `<p>${String(b.body).replace(/\n/g, "<br/>")}</p>`,
        category: "GENERAL",
        parentId: r.parentId,
      });
    }
    return ok({ count: recipients.length });
  } catch (e) {
    console.error(e);
    return fail("Failed to send email.", 500);
  }
}
