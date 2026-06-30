import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { FileText, Link2, NotebookPen, PanelsTopLeft } from "lucide-react";
import { ModuleShell, EmptyModuleState } from "@/client/components/module-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/client/components/ui/card";
import { authOptions } from "@/server/lib/auth";
import { getProductivityDashboard } from "@/server/mediazy/productivity-service";

export const metadata: Metadata = {
  title: "Productivity"
};

export default async function ProductivityPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const productivity = await getProductivityDashboard(session.user.id);

  return (
    <ModuleShell title="Productivity" description="Create short links, build a link-in-bio page, save notes, publish pastes, and draft markdown from your account.">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={Link2} label="URL Shortener" value={productivity.shortLinks.length} />
        <Metric icon={PanelsTopLeft} label="Link in Bio" value={productivity.bioPage ? "Ready" : "Draft"} />
        <Metric icon={NotebookPen} label="Notes" value={productivity.notes.length} />
        <Metric icon={FileText} label="Pastebin" value={productivity.pastes.length} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <List title="Short Links" empty="Create short links through /api/productivity/short-links.">
          {productivity.shortLinks.map((link) => (
            <Row key={link.id} title={link.title ?? link.slug} detail={`${link.slug} · ${link.clicks} clicks`} />
          ))}
        </List>
        <List title="Notes">
          {productivity.notes.map((note) => <Row key={note.id} title={note.title} detail={note.updatedAt.toLocaleDateString()} />)}
        </List>
        <List title="Pastebin">
          {productivity.pastes.map((paste) => <Row key={paste.id} title={paste.title} detail={paste.language ?? "plain text"} />)}
        </List>
        <Card>
          <CardHeader>
            <CardTitle>Markdown Editor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-dashed border-border p-5 text-sm text-muted-foreground">
              Markdown drafts are stored as notes. Use the notes API with markdown content to keep the editor data in the database.
            </div>
          </CardContent>
        </Card>
      </div>
    </ModuleShell>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Link2; label: string; value: string | number }) {
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

function List({ title, empty, children }: { title: string; empty?: string; children: React.ReactNode }) {
  const hasChildren = Array.isArray(children) ? children.length > 0 : Boolean(children);
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {hasChildren ? children : <EmptyModuleState title={`No ${title.toLowerCase()} yet`} description={empty ?? "Your saved items will appear here."} />}
      </CardContent>
    </Card>
  );
}

function Row({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}
