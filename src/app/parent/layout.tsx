import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default async function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || session.role !== "PARENT") redirect("/login/parent");
  return (
    <DashboardShell role="PARENT" userName={session.name}>
      {children}
    </DashboardShell>
  );
}
