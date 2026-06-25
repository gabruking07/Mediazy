import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, Coins, Flame, Search, Sparkles, Zap } from "lucide-react";
import { Button } from "@/client/components/ui/button";
import { Card, CardContent } from "@/client/components/ui/card";
import { MarketingShell } from "@/client/components/marketing-shell";
import { MotionSection } from "@/client/components/motion-section";
import { ToolCard } from "@/client/components/tool-card";
import { categories, tools } from "@/shared/tools/registry";

const features = [
  "Private browser-first workflows",
  "XP, coins, streaks, and quests",
  "Favorites, recents, search, and dashboard",
  "Modular architecture for future AI and games"
];

const faqs = [
  ["Who owns Mediazy?", "Mediazy is created, owned, and operated by Aurex Technologies."],
  ["Can I add new tools?", "Yes. Each tool is registered as an independent module, so new tools can be added without changing existing pages."],
  ["Is Mediazy built for teams?", "The foundation supports authenticated dashboards, profiles, favorites, recents, and SaaS growth features."]
];

export default function Home() {
  const popularTools = tools.filter((tool) => tool.popular);

  return (
    <MarketingShell>
      <main>
        <section className="relative overflow-hidden border-b border-slate-800 bg-dark text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(37,99,235,0.24),transparent_28%),radial-gradient(circle_at_78%_12%,rgba(20,184,166,0.16),transparent_24%)]" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
          <div className="relative mx-auto grid min-h-[720px] max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.02fr_0.98fr]">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300 backdrop-blur">
                <Sparkles className="size-4 text-primary" />
                A premium tools suite by Aurex Technologies
              </div>
              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
                Mediazy turns everyday tools into a daily workspace.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Convert files, format developer data, generate secure utilities, earn XP, collect coins, and keep momentum inside one polished ecosystem.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/tools">
                    Explore tools <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" className="border-white/15 bg-white/10 text-white hover:bg-white/15">
                  <Link href="/dashboard">Open dashboard</Link>
                </Button>
              </div>
              <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
                <HeroMetric icon={Zap} label="14+" value="Tools" />
                <HeroMetric icon={Flame} label="Daily" value="Quests" />
                <HeroMetric icon={Coins} label="XP" value="Rewards" />
              </div>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3 shadow-premium backdrop-blur-xl">
              <div className="rounded-md border border-white/10 bg-slate-950/80">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Search className="size-4" />
                    Command center
                  </div>
                  <span className="rounded-md border border-white/10 px-2 py-1 text-xs text-slate-400">Mediazy Pro</span>
                </div>
                <div className="grid gap-2 p-3">
                  {popularTools.map((tool, index) => (
                    <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group flex items-center justify-between rounded-md border border-white/10 bg-white/[0.03] p-4 hover:bg-white/[0.07]">
                      <span className="flex items-center gap-3">
                        <span className="grid size-9 place-items-center rounded-md bg-primary/15 text-sm text-primary">{index + 1}</span>
                        <span>
                          <span className="block font-medium text-white">{tool.name}</span>
                          <span className="text-sm text-slate-400">{tool.shortDescription}</span>
                        </span>
                      </span>
                      <ArrowRight className="size-4 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-primary" />
                    </Link>
                  ))}
                </div>
                <div className="grid grid-cols-3 border-t border-white/10 text-center text-xs text-slate-400">
                  <div className="p-4"><span className="block text-lg font-semibold text-white">99ms</span>Search</div>
                  <div className="border-x border-white/10 p-4"><span className="block text-lg font-semibold text-white">30d</span>Rewards</div>
                  <div className="p-4"><span className="block text-lg font-semibold text-white">24/7</span>Tools</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <MotionSection className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-medium text-primary">Features</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">Built for speed, clarity, and repeat work.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature} className="bg-card/70 shadow-sm transition hover:-translate-y-0.5 hover:shadow-premium">
                <CardContent className="flex gap-3 p-5">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                  <p className="text-sm text-muted-foreground">{feature}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </MotionSection>

        <MotionSection className="border-y border-border bg-muted/45 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-10 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-primary">Categories</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight">Everything organized.</h2>
              </div>
              <Button asChild variant="outline">
                <Link href="/tools">View all</Link>
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-5">
              {categories.map((category) => (
                <Link key={category.slug} href={category.href} className="rounded-lg border border-border bg-background p-5 transition hover:-translate-y-0.5 hover:shadow-premium">
                  <h3 className="font-semibold">{category.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{category.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </MotionSection>

        <MotionSection className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="mb-10">
            <p className="text-sm font-medium text-primary">Popular Tools</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">High-use workflows, ready now.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {popularTools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}
          </div>
        </MotionSection>

        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
          <div className="rounded-lg border border-border bg-dark px-6 py-12 text-white shadow-premium sm:px-10">
            <h2 className="text-3xl font-semibold tracking-tight">Start with the tool you need.</h2>
            <p className="mt-3 max-w-2xl text-slate-300">Mediazy keeps the product front and center, with professional Aurex Technologies ownership visible where it matters.</p>
            <Button asChild className="mt-6 bg-white text-dark hover:bg-slate-200">
              <Link href="/tools">Browse tools</Link>
            </Button>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6">
          <h2 className="text-3xl font-semibold tracking-tight">FAQ</h2>
          <div className="mt-6 divide-y divide-border rounded-lg border border-border">
            {faqs.map(([question, answer]) => (
              <div key={question} className="p-5">
                <h3 className="font-medium">{question}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </MarketingShell>
  );
}

function HeroMetric({ icon: Icon, label, value }: { icon: typeof Zap; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
      <Icon className="size-4 text-primary" />
      <p className="mt-4 text-xl font-semibold">{value}</p>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  );
}
