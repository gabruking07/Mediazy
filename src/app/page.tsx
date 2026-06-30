import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  Blocks,
  Coins,
  FileText,
  Flame,
  ImageIcon,
  Lock,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Wand2,
  Zap
} from "lucide-react";
import { MarketingShell } from "@/client/components/marketing-shell";
import { Button } from "@/client/components/ui/button";
import { Card, CardContent } from "@/client/components/ui/card";
import { ToolCard } from "@/client/components/tool-card";
import { tools } from "@/shared/tools/registry";
import { brand } from "@/shared/brand";

const featureStrip = [
  { icon: Wand2, title: "Easy to Use", text: "Simple and intuitive interface" },
  { icon: Zap, title: "Blazing Fast", text: "Lightning fast performance" },
  { icon: BadgeCheck, title: "100% Free", text: "Core tools stay free forever" },
  { icon: ShieldCheck, title: "Secure", text: "Your data is safe with us" }
];

const categoryPills = [
  { label: "All Tools", icon: Blocks, href: "/tools" },
  { label: "AI Tools", icon: Sparkles, href: "/categories/developer" },
  { label: "Image Tools", icon: ImageIcon, href: "/categories/image" },
  { label: "PDF Tools", icon: FileText, href: "/categories/pdf" },
  { label: "Converters", icon: ArrowRight, href: "/categories/text" },
  { label: "Utilities", icon: Lock, href: "/categories/utility" }
] as const;

const rewardTasks = [
  ["Daily Quest", "Compress 3 images", "2/3", "70%"],
  ["Streak", "7 Days", "Keep it up", "100%"]
];

const earningWays = [
  { title: "Use Any Tool", value: "+10 XP", icon: Wand2 },
  { title: "Complete Daily Quest", value: "+50 XP", icon: Star },
  { title: "Maintain Streak", value: "+20 XP", icon: Flame }
];

const faqs = [
  ["Who owns Mediazy?", `Mediazy is created, owned, and operated by ${brand.company}.`],
  ["Can I add new tools?", "Yes. Each tool is registered as an independent module, so new tools can be added without changing existing pages."],
  ["Is Mediazy built for teams?", "The foundation supports authenticated dashboards, profiles, favorites, recents, and SaaS growth features."]
];

export default function Home() {
  const popularTools = tools.filter((tool) => tool.popular).slice(0, 5);

  return (
    <MarketingShell>
      <main className="overflow-hidden bg-white text-slate-950">
        <section className="relative border-b border-slate-200 bg-[radial-gradient(circle_at_18%_20%,rgba(99,102,241,0.13),transparent_34%),radial-gradient(circle_at_84%_18%,rgba(236,72,153,0.12),transparent_30%),linear-gradient(180deg,#fff,#f8fbff)]">
          <div className="absolute inset-0 mediazy-dot-grid opacity-70" />
          <div className="relative mx-auto grid min-h-[720px] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_330px]">
            <div className="text-center lg:text-left">
              <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-violet-100 lg:mx-0">
                <Sparkles className="size-4 text-violet-600" />
                Smart Tools for Smart People
              </div>
              <h1 className="mx-auto max-w-4xl text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:mx-0 lg:text-7xl">
                Everything You Need, <br className="hidden sm:block" />
                In <span className="text-gradient-purple">One</span> Place.
              </h1>
              <p className="mx-auto mt-7 max-w-3xl text-xl leading-8 text-slate-600 lg:mx-0">
                100+ free online tools to make your work easier, faster and smarter. No sign up required.
              </p>

              <div className="mx-auto mt-9 flex h-16 max-w-3xl items-center gap-4 rounded-[28px] border border-violet-300 bg-white px-6 shadow-[0_24px_70px_-42px_rgba(79,70,229,0.8)] lg:mx-0">
                <Search className="size-6 text-slate-500" />
                <span className="min-w-0 flex-1 text-left text-lg text-slate-500">Type a command or search any tool...</span>
                <span className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-bold text-slate-500">⌘ K</span>
              </div>

              <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
                {categoryPills.map((pill, index) => (
                  <Link
                    key={pill.label}
                    href={pill.href}
                    className={`inline-flex h-12 items-center gap-2 rounded-full border px-5 text-sm font-bold shadow-sm transition hover:-translate-y-0.5 ${index === 0 ? "border-transparent bg-gradient-to-r from-violet-600 to-blue-600 text-white" : "border-slate-200 bg-white text-slate-950 hover:border-violet-200 hover:text-violet-700"}`}
                  >
                    <pill.icon className="size-4" />
                    {pill.label}
                  </Link>
                ))}
              </div>
            </div>

            <aside className="relative mx-auto hidden w-full max-w-sm lg:block">
              <div className="absolute -top-28 left-16 grid size-36 place-items-center rounded-[32px] bg-gradient-to-br from-white to-violet-100 shadow-[0_35px_80px_-36px_rgba(79,70,229,0.9)]">
                <Image src="/assets/mediazy-logo.png" alt="Mediazy logo" width={104} height={104} className="size-24 object-contain" priority />
              </div>
              <div className="rounded-[28px] bg-white p-6 shadow-[0_28px_90px_-46px_rgba(15,23,42,0.45)] ring-1 ring-slate-100">
                {rewardTasks.map(([label, title, value, progress], index) => (
                  <div key={label} className={index === 0 ? "border-b border-slate-100 pb-7" : "pt-7"}>
                    <p className="font-bold text-slate-950">{label}</p>
                    <p className="mt-3 text-slate-700">{title}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-bold text-violet-600">{index === 0 ? "+50 XP" : <Flame className="size-7 text-orange-500" />}</span>
                      <span className="font-semibold text-slate-600">{value}</span>
                    </div>
                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-500" style={{ width: progress }} />
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 md:grid-cols-4">
          {featureStrip.map((feature) => (
            <div key={feature.title} className="flex items-start gap-4 border-slate-200 md:border-r md:pr-6 last:border-r-0">
              <span className="grid size-14 shrink-0 place-items-center rounded-full bg-violet-100 text-violet-600">
                <feature.icon className="size-6" />
              </span>
              <span>
                <span className="block font-bold">{feature.title}</span>
                <span className="mt-2 block leading-6 text-slate-600">{feature.text}</span>
              </span>
            </div>
          ))}
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_26px_90px_-58px_rgba(15,23,42,0.55)]">
            <div className="mb-7 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-black tracking-tight">Popular Tools</h2>
              <Button asChild variant="link" className="font-bold no-underline">
                <Link href="/tools">View all <ArrowRight className="size-4" /></Link>
              </Button>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
              {popularTools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-slate-50/80 py-16">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_360px]">
            <div>
              <p className="text-sm font-bold text-violet-600">Ways to Earn XP & Coins</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight">Progress that makes useful tools feel rewarding.</h2>
              <div className="mt-7 grid gap-4 md:grid-cols-3">
                {earningWays.map((way) => (
                  <Card key={way.title} className="shadow-sm">
                    <CardContent className="p-5 text-center">
                      <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-violet-100 text-violet-600">
                        <way.icon className="size-6" />
                      </span>
                      <p className="mt-4 font-bold">{way.title}</p>
                      <p className="mt-3 text-sm font-semibold text-violet-600">{way.value}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-black">XP Leaderboard</h3>
                  <Link href="/dashboard" className="text-sm font-bold text-violet-600">View All</Link>
                </div>
                <div className="mt-5 grid gap-4">
                  {["Mediazy Pro", "Aman Verma", "Riya Shah", "Saurav Patel"].map((name, index) => (
                    <div key={name} className="flex items-center gap-3">
                      <span className="w-5 text-sm font-bold text-slate-500">{index + 1}</span>
                      <span className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-blue-600 text-xs font-bold text-white">{name[0]}</span>
                      <span className="min-w-0 flex-1 font-semibold">{name}</span>
                      <span className="text-sm font-bold text-violet-600">{5600 - index * 600} XP</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <h2 className="text-3xl font-black tracking-tight">FAQ</h2>
          <div className="mt-6 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
            {faqs.map(([question, answer]) => (
              <div key={question} className="p-5">
                <h3 className="font-bold">{question}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </MarketingShell>
  );
}
