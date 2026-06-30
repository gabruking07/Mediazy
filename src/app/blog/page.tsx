import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, FileText, ImageIcon, Sparkles } from "lucide-react";
import { MarketingShell } from "@/client/components/marketing-shell";
import { tools } from "@/shared/tools/registry";
import { brand } from "@/shared/brand";

const posts = [
  {
    title: "How to choose the right image tool",
    description: "A practical guide to compression, resizing, and format conversion.",
    href: "/categories/image",
    icon: ImageIcon
  },
  {
    title: "Faster PDF workflows in the browser",
    description: "Merge, split, and compress PDFs without leaving your workspace.",
    href: "/categories/pdf",
    icon: FileText
  },
  {
    title: "Build a simple daily tool routine",
    description: "Use XP, coins, and favorites to keep your most-used tools close.",
    href: "/dashboard",
    icon: Sparkles
  }
];

export const metadata: Metadata = {
  title: "Blog",
  description: "Mediazy guides, workflow ideas, and productivity tips.",
  authors: [{ name: brand.company }]
};

export default function BlogPage() {
  const popularTools = tools.filter((tool) => tool.popular).slice(0, 4);

  return (
    <MarketingShell>
      <main className="bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-100">
        <section className="mediazy-spotlight border-b border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
            <p className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-sm font-semibold text-violet-700 ring-1 ring-violet-100 dark:bg-violet-500/10 dark:text-violet-200 dark:ring-violet-400/20">
              <BookOpen className="size-4" />
              Blog
            </p>
            <h1 className="mt-6 max-w-3xl text-5xl font-black tracking-tight sm:text-6xl">
              Guides for faster online work.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Read workflow notes and jump straight into the tools behind each guide.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_320px]">
          <div className="grid gap-5 md:grid-cols-2">
            {posts.map((post) => (
              <Link key={post.title} href={post.href} className="group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-premium dark:border-slate-800 dark:bg-slate-900 dark:hover:border-violet-500/40">
                <post.icon className="size-8 text-violet-600 dark:text-violet-300" />
                <h2 className="mt-5 text-xl font-black">{post.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{post.description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-violet-700 dark:text-violet-200">
                  Read guide <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>

          <aside className="rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="font-black">Popular tools</p>
            <div className="mt-4 grid gap-2">
              {popularTools.map((tool) => (
                <Link key={tool.slug} href={`/tools/${tool.slug}`} className="flex items-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold shadow-sm transition hover:text-violet-700 dark:bg-slate-950 dark:hover:text-violet-200">
                  <tool.icon className="size-4 text-violet-600 dark:text-violet-300" />
                  {tool.name}
                </Link>
              ))}
            </div>
          </aside>
        </section>
      </main>
    </MarketingShell>
  );
}
