import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MarketingShell } from "@/components/marketing-shell";
import { MotionSection } from "@/components/motion-section";
import { ToolCard } from "@/components/tool-card";
import { categories, tools } from "@/lib/tools/registry";

const features = [
  "Privacy-friendly browser workflows",
  "Modular tools that are easy to extend",
  "Favorites, recents, search, and dashboard",
  "SEO-ready pages with modern metadata"
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
        <section className="relative overflow-hidden border-b border-border">
          <div className="mx-auto grid min-h-[640px] max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.08fr_0.92fr]">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-border bg-muted px-3 py-1 text-sm text-muted-foreground">
                <Sparkles className="size-4 text-primary" />
                A premium tools suite by Aurex Technologies
              </div>
              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-dark dark:text-white sm:text-6xl lg:text-7xl">
                Mediazy
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                Convert files, format developer data, generate secure utilities, and keep everyday work moving with a fast modern SaaS toolkit.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/tools">
                    Explore tools <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/dashboard">Open dashboard</Link>
                </Button>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-3 shadow-premium">
              <div className="grid gap-3">
                {popularTools.map((tool) => (
                  <Link key={tool.slug} href={`/tools/${tool.slug}`} className="flex items-center justify-between rounded-md border border-border bg-background p-4 hover:bg-muted">
                    <span>
                      <span className="block font-medium">{tool.name}</span>
                      <span className="text-sm text-muted-foreground">{tool.shortDescription}</span>
                    </span>
                    <ArrowRight className="size-4 text-primary" />
                  </Link>
                ))}
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
              <Card key={feature}>
                <CardContent className="flex gap-3 p-5">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                  <p className="text-sm text-muted-foreground">{feature}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </MotionSection>

        <MotionSection className="border-y border-border bg-muted/40 py-20">
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
                <Link key={category.slug} href={category.href} className="rounded-lg border border-border bg-background p-5 hover:shadow-premium">
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
