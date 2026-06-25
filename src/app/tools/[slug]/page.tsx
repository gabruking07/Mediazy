import type { Metadata } from "next";
import { ShieldCheck, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";
import { MarketingShell } from "@/client/components/marketing-shell";
import { Badge } from "@/client/components/ui/badge";
import { ToolPanel } from "@/client/tools/shared/tool-panel";
import { brand } from "@/shared/brand";
import { getTool, tools } from "@/shared/tools/registry";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};

  return {
    title: tool.name,
    description: tool.description,
    authors: [{ name: "Aurex Technologies" }],
    openGraph: {
      title: `${tool.name} - Mediazy`,
      description: tool.description,
      siteName: "Mediazy"
    }
  };
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  const Tool = tool.component;

  return (
    <MarketingShell>
      <main>
        <section className="border-b border-border bg-muted/45">
          <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
            <div className="flex flex-wrap items-center gap-3">
          <Badge>{tool.category}</Badge>
          <span className="text-sm text-muted-foreground">Mediazy by {brand.company}</span>
              <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                <ShieldCheck className="size-4 text-primary" />
                Browser-first workflow
              </span>
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight">{tool.name}</h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">{tool.description}</p>
            <p className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary">
              <Sparkles className="size-4" />
              Earn XP when this workflow is connected to your dashboard
            </p>
          </div>
        </section>
        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <ToolPanel slug={tool.slug} title={tool.name} description={tool.description}>
            <Tool />
          </ToolPanel>
        </section>
      </main>
    </MarketingShell>
  );
}
