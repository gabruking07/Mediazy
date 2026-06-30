import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { BarChart3, FileWarning, ShieldAlert, UsersRound } from "lucide-react";
import { ModuleShell } from "@/client/components/module-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/client/components/ui/card";
import { authOptions } from "@/server/lib/auth";
import { prisma } from "@/server/lib/prisma";

export const metadata: Metadata = {
  title: "Admin"
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const admin = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
  if (admin?.role !== "ADMIN") redirect("/dashboard");

  const [users, files, flaggedFiles, reports, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.uploadedFile.count({ where: { status: { not: "DELETED" } } }),
    prisma.uploadedFile.count({ where: { status: "FLAGGED" } }),
    prisma.linkEvent.count({ where: { type: "REPORT" } }),
    prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 8, select: { id: true, name: true, email: true, role: true, plan: true } })
  ]);

  return (
    <ModuleShell title="Admin" description="Admin dashboard for users, reports, file moderation, and operational metrics.">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={UsersRound} label="Users" value={users} />
        <Metric icon={BarChart3} label="Files" value={files} />
        <Metric icon={FileWarning} label="File Moderation" value={flaggedFiles} />
        <Metric icon={ShieldAlert} label="Reports" value={reports} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between gap-4 rounded-lg border border-border p-4">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{user.name ?? user.email}</p>
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                </div>
                <span className="rounded-full bg-muted px-2 py-1 text-xs font-semibold">{user.role} · {user.plan}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Reports</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Report events are stored in link analytics with type REPORT and can be expanded into a dedicated moderation queue.
          </CardContent>
        </Card>
      </div>
    </ModuleShell>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof UsersRound; label: string; value: number }) {
  return (
    <Card>
      <CardContent className="p-5">
        <Icon className="size-5 text-primary" />
        <p className="mt-4 text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 text-xl font-semibold">{value.toLocaleString()}</p>
      </CardContent>
    </Card>
  );
}
