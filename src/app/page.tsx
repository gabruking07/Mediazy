import Link from "next/link";
import { ArrowRight, BadgeCheck, Blocks, CheckCircle2, Coins, Flame, ImageIcon, Rocket, Search, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Button } from "@/client/components/ui/button";
import { Card, CardContent } from "@/client/components/ui/card";
import { AnimatedWorkflow } from "@/client/components/animated-workflow";
import { MarketingShell } from "@/client/components/marketing-shell";
import { MotionSection } from "@/client/components/motion-section";
import { PremiumBackground } from "@/client/components/premium-background";
import { ToolCard } from "@/client/components/tool-card";
import { categories, tools } from "@/shared/tools/registry";

const features = [
  { icon: ShieldCheck, title: "Private workflows", text: "Browser-first utilities for files, text, tokens, QR codes, and developer data." },
  { icon: Coins, title: "Reward engine", text: "XP, coins, streaks, quests, achievements, and daily return loops." },
  { icon: Search, title: "Command search", text: "A fast searchable library across tools, categories, pages, and future AI modules." },
  { icon: Blocks, title: "Modular system", text: "Every tool stays independent so Mediazy can grow into games, AI, and marketplace modules." }
];

const categoryIcons = [ImageIcon, Rocket, Blocks, BadgeCheck, Zap];

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
        <section className="relative overflow-hidden border-b border-slate-800 bg-slate-950 text-white">
          <PremiumBackground />
          <div className="relative mx-auto grid min-h-[720px] max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.02fr_0.98fr]">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/10 px-3 py-1 text-sm text-slate-200 shadow-2xl backdrop-blur">
                <Sparkles className="size-4 text-primary" />
                Beautiful tools, rewards, and workflows by Aurex Technologies
              </div>
              <h1 className="aurora-text max-w-4xl text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
                Mediazy turns everyday tools into a daily workspace.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Convert files, format developer data, generate secure utilities, earn XP, collect coins, and keep momentum inside one polished ecosystem.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="shine shadow-[0_20px_60px_-24px_rgba(37,99,235,0.9)]">
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
            <div className="magic-border rounded-xl">
            <div className="glass-panel rounded-xl p-3">
              <div className="overflow-hidden rounded-lg border border-white/10 bg-slate-950/82">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Search className="size-4" />
                    Command center
                  </div>
                  <span className="rounded-md border border-white/10 px-2 py-1 text-xs text-slate-400">Mediazy Pro</span>
                </div>
                <div className="p-3">
                  <AnimatedWorkflow />
                </div>
                <div className="grid grid-cols-3 gap-2 px-3 pb-3">
                  {[
                    ["Lucide", "UI Icons"],
                    ["Iconify", "Brand Logos"],
                    ["Lottie", "Motion"]
                  ].map(([value, label]) => (
                    <div key={value} className="rounded-md border border-white/10 bg-white/[0.04] p-3 text-center">
                      <p className="text-sm font-semibold text-white">{value}</p>
                      <p className="mt-1 text-[11px] text-slate-500">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="grid gap-2 p-3 pt-0">
                  {popularTools.slice(0, 4).map((tool, index) => (
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
          </div>
        </section>

        <MotionSection className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="absolute inset-x-4 top-10 -z-10 h-72 rounded-[32px] bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.10),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(20,184,166,0.10),transparent_35%)]" />
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-medium text-primary">Features</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">A toolkit that feels alive, not like a folder of links.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="overflow-hidden bg-card/80 shadow-sm transition hover:-translate-y-1 hover:shadow-premium">
                <CardContent className="p-5">
                  <span className="grid size-11 place-items-center rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="size-5" />
                  </span>
                  <h3 className="mt-5 font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </MotionSection>

        <MotionSection className="border-y border-border bg-[linear-gradient(180deg,hsl(var(--muted))_0%,transparent_100%)] py-20">
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
              {categories.map((category, index) => {
                const Icon = categoryIcons[index] ?? Blocks;
                return (
                <Link key={category.slug} href={category.href} className="group rounded-lg border border-border bg-background p-5 transition hover:-translate-y-1 hover:shadow-premium">
                  <span className="grid size-11 place-items-center rounded-lg bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-5 font-semibold">{category.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{category.description}</p>
                </Link>
              )})}
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
          <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950 px-6 py-12 text-white shadow-premium sm:px-10">
            <PremiumBackground className="opacity-80" />
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
            <h2 className="text-3xl font-semibold tracking-tight">Start with the tool you need. Return for the ecosystem.</h2>
            <p className="mt-3 max-w-2xl text-slate-300">Mediazy keeps the product front and center, with Aurex Technologies powering the platform quietly behind it.</p>
            <Button asChild className="mt-6 bg-white text-dark hover:bg-slate-200">
              <Link href="/tools">Browse tools</Link>
            </Button>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <HeroMetric icon={Zap} label="Actions" value="XP" />
                <HeroMetric icon={Flame} label="Return" value="Streaks" />
                <HeroMetric icon={Coins} label="Earn" value="Coins" />
              </div>
            </div>
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
