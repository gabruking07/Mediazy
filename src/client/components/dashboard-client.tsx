"use client";

import { motion } from "framer-motion";
import { Bell, Coins, Flame, LogOut, Medal, Search, Shield, Sparkles, Star, Trophy, Zap } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { EcosystemDashboard } from "@/server/ecosystem/dashboard-service";
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

export function DashboardClient({ user, ecosystem }: { user: DashboardUser; ecosystem: EcosystemDashboard }) {
  const [query, setQuery] = useState("");
  const { favorites, recent } = useToolStore();
  const results = useMemo(() => searchTools(query), [query]);
  const favoriteTools = tools.filter((tool) => favorites.includes(tool.slug));
  const recentTools = recent.map((slug) => tools.find((tool) => tool.slug === slug)).filter(Boolean);
  const maxWeekly = Math.max(...ecosystem.weekly.map((item) => item.value), 1);

  return (
    <>
      <header className="border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="grid size-8 place-items-center rounded-md bg-primary text-sm text-white">M</span>
            Mediazy
          </Link>
          <span className="hidden text-sm text-muted-foreground sm:inline">Mediazy Admin / {brand.company}</span>
          <Button type="button" variant="ghost" size="icon" className="ml-auto" aria-label="Notifications">
            <Bell className="size-4" />
          </Button>
          <Button type="button" variant="outline" onClick={() => void signOut({ callbackUrl: "/" })}>
            <LogOut className="size-4" />
            Logout
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          <aside className="space-y-4">
            <Card className="overflow-hidden bg-dark text-white shadow-premium">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="grid size-12 place-items-center rounded-md bg-white/10 text-lg font-semibold">
                    {(user.name ?? user.email ?? "M").slice(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{user.name ?? "Mediazy user"}</p>
                    <p className="truncate text-xs text-slate-300">{user.email}</p>
                  </div>
                </div>
                <div className="mt-5">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>{ecosystem.level.current.name}</span>
                    <span>{ecosystem.level.next?.name ?? "Max"}</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-white/10">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${ecosystem.level.progress}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-slate-300">{ecosystem.level.xpToNextLevel} XP to next level</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>Rank: <span className="font-medium text-foreground">{ecosystem.rank}</span></p>
                <p>Achievements: <span className="font-medium text-foreground">{ecosystem.achievementCount}</span></p>
                <p>Favorites: <span className="font-medium text-foreground">{ecosystem.favoriteCount}</span></p>
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
                <Link href="/settings" className="block text-muted-foreground hover:text-foreground">Settings roadmap</Link>
              </CardContent>
            </Card>
          </aside>

          <section className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6 shadow-premium">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="flex items-center gap-2 text-sm font-medium text-primary">
                    <Sparkles className="size-4" />
                    Welcome back
                  </p>
                  <h1 className="mt-2 text-3xl font-semibold tracking-tight">Your Mediazy ecosystem is waking up.</h1>
                  <p className="mt-2 max-w-2xl text-muted-foreground">
                    Earn XP, collect coins, complete quests, unlock achievements, and keep your favorite tools one click away.
                  </p>
                </div>
                <Button asChild>
                  <Link href="/tools">Use a tool</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard icon={Zap} label="XP" value={ecosystem.totalXp.toLocaleString()} caption={`${ecosystem.level.progress}% level progress`} />
              <MetricCard icon={Coins} label="Coins" value={ecosystem.coins.toLocaleString()} caption="Virtual currency balance" />
              <MetricCard icon={Flame} label="Daily Streak" value={`${ecosystem.streak.current} days`} caption={`Best: ${ecosystem.streak.longest} days`} />
              <MetricCard icon={Trophy} label="Rank" value={ecosystem.rank} caption={`${ecosystem.achievementCount} achievements`} />
            </div>

            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search tools, categories, pages, and future AI modules"
                className="pl-9"
              />
            </div>

            {query ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {results.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}
              </div>
            ) : (
              <>
                <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
                  <Card>
                    <CardHeader>
                      <CardTitle>Weekly Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex h-44 items-end gap-3">
                        {ecosystem.weekly.map((item) => (
                          <div key={item.day} className="flex flex-1 flex-col items-center gap-2">
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${Math.max(12, (item.value / maxWeekly) * 144)}px` }}
                              transition={{ duration: 0.45, ease: "easeOut" }}
                              className="w-full rounded-md bg-primary/85"
                            />
                            <span className="text-xs text-muted-foreground">{item.day}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Daily Quests</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {ecosystem.quests.slice(0, 3).map((quest) => (
                        <div key={quest.slug}>
                          <div className="flex items-center justify-between gap-3 text-sm">
                            <span className="font-medium">{quest.title}</span>
                            <span className="text-muted-foreground">{quest.progress}/{quest.target}</span>
                          </div>
                          <div className="mt-2 h-2 rounded-full bg-muted">
                            <div className="h-2 rounded-full bg-primary" style={{ width: `${Math.round((quest.progress / quest.target) * 100)}%` }} />
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">+{quest.xpReward} XP / +{quest.coinReward} coins</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <MiniStat label="Tools used" value={ecosystem.statistics.toolsUsed} />
                  <MiniStat label="Images converted" value={ecosystem.statistics.imagesConverted} />
                  <MiniStat label="PDF files" value={ecosystem.statistics.pdfFilesProcessed} />
                  <MiniStat label="QR generated" value={ecosystem.statistics.qrGenerated} />
                </div>

                <DashboardSection title="Favorites" empty="Favorite a tool to keep it here.">
                  {favoriteTools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}
                </DashboardSection>

                <DashboardSection title="Recently used" empty="Open a tool and it will appear here.">
                  {recentTools.map((tool) => tool ? <ToolCard key={tool.slug} tool={tool} /> : null)}
                </DashboardSection>

                <DashboardSection title="Recent Activity" empty="Your activity stream will appear here as you use Mediazy.">
                  {ecosystem.recentActivity.map((activity) => (
                    <Card key={activity.id}>
                      <CardContent className="flex items-center gap-3 p-4">
                        <Shield className="size-4 text-primary" />
                        <div>
                          <p className="text-sm font-medium">{activity.label}</p>
                          <p className="text-xs text-muted-foreground">{activity.type.toLowerCase().replaceAll("_", " ")}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </DashboardSection>
              </>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

function MetricCard({ icon: Icon, label, value, caption }: { icon: typeof Zap; label: string; value: string; caption: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="grid size-10 place-items-center rounded-md bg-primary/10 text-primary">
            <Icon className="size-5" />
          </span>
          <Medal className="size-4 text-muted-foreground" />
        </div>
        <p className="mt-5 text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{caption}</p>
      </CardContent>
    </Card>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 text-xl font-semibold">{value.toLocaleString()}</p>
      </CardContent>
    </Card>
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
