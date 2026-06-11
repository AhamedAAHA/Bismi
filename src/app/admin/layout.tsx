import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login/admin");
  return (
    <DashboardShell role="ADMIN" userName={session.name}>
      {children}
    </DashboardShell>
  );
}
