import type { Metadata } from "next";
import { MarketingShell } from "@/client/components/marketing-shell";
import { ToolCard } from "@/client/components/tool-card";
import { tools } from "@/shared/tools/registry";

export const metadata: Metadata = {
  title: "Tools",
  description: "Browse all Mediazy tools for PDF, image, developer, text, and utility workflows.",
  authors: [{ name: "Aurex Technologies" }]
};

export default function ToolsPage() {
  return (
    <MarketingShell>
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h1 className="text-4xl font-semibold tracking-tight">All tools</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">Fast modular tools from Mediazy, a product by Aurex Technologies.</p>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}
        </div>
      </main>
    </MarketingShell>
  );
}
