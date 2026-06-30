import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { CalendarClock, Cloud, HardDrive, Upload } from "lucide-react";
import { ModuleShell } from "@/client/components/module-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/client/components/ui/card";
import { authOptions } from "@/server/lib/auth";
import { prisma } from "@/server/lib/prisma";
import { serializeBigInt } from "@/server/mediazy/serialization";

export const metadata: Metadata = {
  title: "Premium"
};

export default async function PremiumPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true, storageLimitBytes: true, uploadLimitBytes: true, settings: true }
  });

  return (
    <ModuleShell title="Premium" description="Premium controls define storage limits, upload limits, and file expiry behavior for cloud sharing.">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <PremiumMetric icon={Cloud} label="Current plan" value={user?.plan ?? "FREE"} />
        <PremiumMetric icon={HardDrive} label="Storage limit" value={formatBytes(serializeBigInt(user?.storageLimitBytes))} />
        <PremiumMetric icon={Upload} label="Upload limit" value={formatBytes(serializeBigInt(user?.uploadLimitBytes))} />
        <PremiumMetric icon={CalendarClock} label="Expiry default" value={user?.settings?.defaultFileExpiryDays ? `${user.settings.defaultFileExpiryDays} days` : "Manual"} />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>File expiry controls</CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-6 text-muted-foreground">
          Free accounts can set expiry per file or link. Premium plans can raise storage and upload limits, then apply default expiry windows through user settings.
        </CardContent>
      </Card>
    </ModuleShell>
  );
}

function PremiumMetric({ icon: Icon, label, value }: { icon: typeof Cloud; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <Icon className="size-5 text-primary" />
        <p className="mt-4 text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 text-xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}
