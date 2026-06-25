"use client";

import { LogOut, Search, Star } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/client/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/client/components/ui/card";
import { Input } from "@/client/components/ui/input";
import { ToolCard } from "@/client/components/tool-card";
import { brand } from "@/shared/brand";
import { searchTools, tools } from "@/shared/tools/registry";
import { useToolStore } from "@/client/store/use-tool-store";

type DashboardUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export function DashboardClient({ user }: { user: DashboardUser }) {
  const [query, setQuery] = useState("");
  const { favorites, recent } = useToolStore();
  const results = useMemo(() => searchTools(query), [query]);
  const favoriteTools = tools.filter((tool) => favorites.includes(tool.slug));
  const recentTools = recent.map((slug) => tools.find((tool) => tool.slug === slug)).filter(Boolean);

  return (
    <>
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="grid size-8 place-items-center rounded-md bg-primary text-sm text-white">M</span>
            Mediazy
          </Link>
          <span className="hidden text-sm text-muted-foreground sm:inline">Admin Panel: Mediazy • {brand.company}</span>
          <Button type="button" variant="outline" className="ml-auto" onClick={() => void signOut({ callbackUrl: "/" })}>
            <LogOut className="size-4" />
            Logout
          </Button>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">{user.name ?? "Mediazy user"}</p>
                <p>{user.email}</p>
                <p>Product by {brand.company}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Workspace</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <Link href="/tools" className="block text-muted-foreground hover:text-foreground">All tools</Link>
                <Link href="/about" className="block text-muted-foreground hover:text-foreground">About Aurex Technologies</Link>
              </CardContent>
            </Card>
          </aside>
          <section className="space-y-6">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
              <p className="mt-2 text-muted-foreground">Search, pin favorites, and return to recently used Mediazy tools.</p>
            </div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tools" className="pl-9" />
            </div>
            {query ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {results.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}
              </div>
            ) : (
              <>
                <DashboardSection title="Favorites" empty="Favorite a tool to keep it here.">
                  {favoriteTools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}
                </DashboardSection>
                <DashboardSection title="Recently used" empty="Open a tool and it will appear here.">
                  {recentTools.map((tool) => tool ? <ToolCard key={tool.slug} tool={tool} /> : null)}
                </DashboardSection>
              </>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

function DashboardSection({ title, empty, children }: { title: string; empty: string; children: React.ReactNode }) {
  const hasChildren = Array.isArray(children) ? children.some(Boolean) : Boolean(children);

  return (
    <section>
      <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
        <Star className="size-5 text-primary" />
        {title}
      </h2>
      {hasChildren ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{children}</div>
      ) : (
        <Card>
          <CardContent className="p-5 text-sm text-muted-foreground">{empty}</CardContent>
        </Card>
      )}
    </section>
  );
}
