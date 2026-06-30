import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Bell, Palette, Shield, UserRound } from "lucide-react";
import { ModuleShell } from "@/client/components/module-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/client/components/ui/card";
import { authOptions } from "@/server/lib/auth";
import { prisma } from "@/server/lib/prisma";

export const metadata: Metadata = {
  title: "Settings"
};

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const [user, settings] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id } }),
    prisma.userSettings.upsert({
      where: { userId: session.user.id },
      update: {},
      create: { userId: session.user.id }
    })
  ]);

  return (
    <ModuleShell title="User Settings" description="Manage profile, security, theme, and notification preferences for your authenticated Mediazy account.">
      <div className="grid gap-6 lg:grid-cols-2">
        <SettingsCard icon={UserRound} title="Profile" rows={[["Name", user?.name ?? "Not set"], ["Email", user?.email ?? "Not set"], ["Username", user?.username ?? "Not set"]]} />
        <SettingsCard icon={Shield} title="Security" rows={[["Two-factor authentication", settings.twoFactorEnabled ? "Enabled" : "Disabled"], ["Security alerts", settings.securityAlerts ? "On" : "Off"]]} />
        <SettingsCard icon={Palette} title="Theme" rows={[["Preference", settings.theme], ["Default file expiry", settings.defaultFileExpiryDays ? `${settings.defaultFileExpiryDays} days` : "No default"]]} />
        <SettingsCard icon={Bell} title="Notifications" rows={[["Email notifications", settings.emailNotifications ? "On" : "Off"], ["Product updates", settings.productUpdates ? "On" : "Off"]]} />
      </div>
    </ModuleShell>
  );
}

function SettingsCard({ icon: Icon, title, rows }: { icon: typeof UserRound; title: string; rows: Array<[string, string]> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="size-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 rounded-lg border border-border p-3 text-sm">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-semibold">{value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
