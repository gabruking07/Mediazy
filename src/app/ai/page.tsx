import type { Metadata } from "next";
import Link from "next/link";
import { Bot, Code2, Sparkles } from "lucide-react";
import { MarketingShell } from "@/client/components/marketing-shell";
import { Card, CardContent } from "@/client/components/ui/card";

export const metadata: Metadata = {
  title: "AI Tools",
  description: "Mediazy AI tools workspace."
};

export default function AiToolsPage() {
  return (
    <MarketingShell>
      <main className="bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-100">
        <section className="mediazy-spotlight border-b border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
            <p className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-sm font-semibold text-violet-700 ring-1 ring-violet-100 dark:bg-violet-500/10 dark:text-violet-200 dark:ring-violet-400/20">
              <Sparkles className="size-4" />
              AI Tools
            </p>
            <h1 className="mt-6 max-w-3xl text-5xl font-black tracking-tight sm:text-6xl">
              AI tools are not live yet.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Developer tools stay under Developer. This area is reserved for real AI modules when they are added.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-5 px-4 py-12 sm:px-6 md:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <Bot className="size-8 text-violet-600 dark:text-violet-300" />
              <p className="mt-5 text-xl font-black">Coming AI modules</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">AI tools will appear here only when backed by actual tool modules.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <Code2 className="size-8 text-blue-600 dark:text-blue-300" />
              <p className="mt-5 text-xl font-black">Developer tools</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">JSON, JWT, UUID, and Base64 utilities remain separate from AI.</p>
              <Link href="/categories/developer" className="mt-5 inline-flex text-sm font-bold text-primary">Open Developer Tools</Link>
            </CardContent>
          </Card>
        </section>
      </main>
    </MarketingShell>
  );
}
