import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || session.role !== "STUDENT") redirect("/login/student");
  return (
    <DashboardShell role="STUDENT" userName={session.name}>
      {children}
    </DashboardShell>
  );
}
