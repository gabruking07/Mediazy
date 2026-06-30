import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { FileArchive, Link2, LockKeyhole, Timer, UploadCloud } from "lucide-react";
import { ModuleShell, EmptyModuleState } from "@/client/components/module-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/client/components/ui/card";
import { authOptions } from "@/server/lib/auth";
import { prisma } from "@/server/lib/prisma";
import { getCloudDashboard } from "@/server/mediazy/cloud-service";
import { serializeBigInt } from "@/server/mediazy/serialization";

export const metadata: Metadata = {
  title: "Cloud"
};

export default async function CloudPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const [user, cloud] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id }, select: { storageLimitBytes: true, uploadLimitBytes: true, plan: true } }),
    getCloudDashboard(session.user.id)
  ]);
  const storageLimit = serializeBigInt(user?.storageLimitBytes);
  const usedPercent = storageLimit ? Math.min(100, Math.round((cloud.usage / storageLimit) * 100)) : 0;

  return (
    <ModuleShell title="Cloud" description="Upload files, create temporary share links, protect access with passwords, and control expiry from one authenticated workspace.">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <CloudMetric icon={UploadCloud} label="Files" value={cloud.files.length} />
        <CloudMetric icon={Link2} label="Share links" value={cloud.links.length} />
        <CloudMetric icon={FileArchive} label="Storage used" value={`${formatBytes(cloud.usage)}`} />
        <CloudMetric icon={LockKeyhole} label="Protected" value={cloud.links.filter((link) => link.access === "PASSWORD").length} />
        <CloudMetric icon={Timer} label="Upload limit" value={formatBytes(serializeBigInt(user?.uploadLimitBytes))} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <CardTitle>File Manager</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-5 h-2 rounded-full bg-muted">
              <div className="h-2 rounded-full bg-primary" style={{ width: `${usedPercent}%` }} />
            </div>
            {cloud.files.length ? (
              <div className="grid gap-3">
                {cloud.files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-4">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{file.mimeType} · {formatBytes(serializeBigInt(file.sizeBytes))}</p>
                    </div>
                    <span className="rounded-full bg-muted px-2 py-1 text-xs font-semibold">{file.status.toLowerCase()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyModuleState title="No uploads yet" description="Use the cloud file API or upload flow to register your first file." />
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Uploads</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              {cloud.files.slice(0, 5).map((file) => <span key={file.id}>{file.name}</span>)}
              {!cloud.files.length ? <span className="text-muted-foreground">No recent uploads.</span> : null}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Link Analytics</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              {cloud.analytics.map((item) => (
                <div key={item.type} className="flex justify-between">
                  <span>{item.type}</span>
                  <span className="font-semibold">{item._count._all}</span>
                </div>
              ))}
              {!cloud.analytics.length ? <span className="text-muted-foreground">Analytics will appear after link activity.</span> : null}
            </CardContent>
          </Card>
          <Link href="/premium" className="rounded-lg border border-violet-200 bg-violet-50 p-5 text-sm font-semibold text-violet-800 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-200">
            Current plan: {user?.plan ?? "FREE"} · Manage storage, upload limits, and expiry controls
          </Link>
        </div>
      </div>
    </ModuleShell>
  );
}

function CloudMetric({ icon: Icon, label, value }: { icon: typeof UploadCloud; label: string; value: string | number }) {
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
