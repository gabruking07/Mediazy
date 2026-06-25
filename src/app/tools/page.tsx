import type { Metadata } from "next";
import { Layers3, Sparkles, Wand2 } from "lucide-react";
import { MarketingShell } from "@/client/components/marketing-shell";
import { ToolCard } from "@/client/components/tool-card";
import { Card, CardContent } from "@/client/components/ui/card";
import { tools } from "@/shared/tools/registry";

export const metadata: Metadata = {
  title: "Tools",
  description: "Browse all Mediazy tools for PDF, image, developer, text, and utility workflows.",
  authors: [{ name: "Aurex Technologies" }]
};

export default function ToolsPage() {
  return (
    <MarketingShell>
      <main>
        <section className="mediazy-spotlight border-b border-slate-800 text-white">
          <div className="mediazy-grid mx-auto max-w-7xl px-4 py-16 sm:px-6">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300">
                <Sparkles className="size-4 text-primary" />
                Mediazy tool library
              </p>
              <h1 className="mt-6 text-5xl font-semibold tracking-tight">Every daily utility, organized like a premium workspace.</h1>
              <p className="mt-4 max-w-2xl text-slate-300">Fast modular tools from Mediazy, a product by Aurex Technologies.</p>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <LibraryStat icon={Layers3} label="Categories" value="5" />
              <LibraryStat icon={Wand2} label="Tools" value={tools.length.toString()} />
              <LibraryStat icon={Sparkles} label="Ecosystem" value="XP" />
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}
        </div>
        </section>
      </main>
    </MarketingShell>
  );
}

function LibraryStat({ icon: Icon, label, value }: { icon: typeof Layers3; label: string; value: string }) {
  return (
    <Card className="border-white/10 bg-white/[0.05] text-white">
      <CardContent className="flex items-center gap-3 p-4">
        <span className="grid size-10 place-items-center rounded-lg bg-white/10 text-primary">
          <Icon className="size-5" />
        </span>
        <span>
          <span className="block text-xl font-semibold">{value}</span>
          <span className="text-xs text-slate-400">{label}</span>
        </span>
      </CardContent>
    </Card>
  );
}
