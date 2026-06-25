import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketingShell } from "@/components/marketing-shell";
import { Badge } from "@/components/ui/badge";
import { ToolPanel } from "@/tools/shared/tool-panel";
import { brand } from "@/lib/brand";
import { getTool, tools } from "@/lib/tools/registry";

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
      <main className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <div className="mb-6 flex items-center gap-3">
          <Badge>{tool.category}</Badge>
          <span className="text-sm text-muted-foreground">Mediazy by {brand.company}</span>
        </div>
        <ToolPanel slug={tool.slug} title={tool.name} description={tool.description}>
          <Tool />
        </ToolPanel>
      </main>
    </MarketingShell>
  );
}
