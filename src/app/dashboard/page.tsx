import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { DashboardClient } from "@/client/components/dashboard-client";
import { brand } from "@/shared/brand";
import { authOptions } from "@/server/lib/auth";
import { getEcosystemDashboard } from "@/server/ecosystem/dashboard-service";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage Mediazy favorites, recently used tools, and your user profile.",
  authors: [{ name: "Aurex Technologies" }]
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const ecosystem = await getEcosystemDashboard(session.user.id);

  return (
    <main className="min-h-screen bg-muted/35">
      <DashboardClient user={session.user} ecosystem={ecosystem} />
      <footer className="border-t border-border px-4 py-6 text-center text-xs text-muted-foreground">
        {brand.dashboardFooter}
      </footer>
    </main>
  );
}
