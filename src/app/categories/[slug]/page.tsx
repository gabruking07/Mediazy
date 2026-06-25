import type { Metadata } from "next";
import { ArrowRight, FolderKanban } from "lucide-react";
import { notFound } from "next/navigation";
import { MarketingShell } from "@/client/components/marketing-shell";
import { ToolCard } from "@/client/components/tool-card";
import { categories, getCategory, getToolsByCategory } from "@/shared/tools/registry";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description,
    authors: [{ name: "Aurex Technologies" }]
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const categoryTools = getToolsByCategory(slug);

  return (
    <MarketingShell>
      <main>
        <section className="border-b border-border bg-muted/45">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
            <p className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1 text-sm text-muted-foreground">
              <FolderKanban className="size-4 text-primary" />
              Category
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight">{category.name}</h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">{category.description}</p>
            <p className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary">
              {categoryTools.length} tools ready <ArrowRight className="size-4" />
            </p>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categoryTools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}
        </div>
        </section>
      </main>
    </MarketingShell>
  );
}
