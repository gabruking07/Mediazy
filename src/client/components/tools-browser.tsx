"use client";

import { useMemo, useState } from "react";
import { Blocks, Code2, FileText, ImageIcon, Lock, Search, Sparkles, Video, Wand2, Zap } from "lucide-react";
import { ToolCard } from "@/client/components/tool-card";
import { tools } from "@/shared/tools/registry";
import type { ToolCategory } from "@/shared/tools/types";

type CategoryFilter = "all" | ToolCategory | "ai" | "converter" | "video";

const categoryLinks: Array<{
  label: string;
  icon: typeof Blocks;
  filter: CategoryFilter;
  categories?: ToolCategory[];
}> = [
  { label: "All Tools", icon: Blocks, filter: "all" },
  { label: "AI Tools", icon: Sparkles, filter: "ai", categories: ["developer", "text"] },
  { label: "Image Tools", icon: ImageIcon, filter: "image", categories: ["image"] },
  { label: "PDF Tools", icon: FileText, filter: "pdf", categories: ["pdf"] },
  { label: "Converters", icon: Zap, filter: "converter", categories: ["image", "text"] },
  { label: "Utilities", icon: Lock, filter: "utility", categories: ["utility"] },
  { label: "Developer", icon: Code2, filter: "developer", categories: ["developer"] },
  { label: "Video Tools", icon: Video, filter: "video", categories: [] }
];

const heroTiles = [
  { label: "Image", icon: ImageIcon, className: "left-8 top-8 bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-200" },
  { label: "Text", icon: Wand2, className: "left-36 top-0 bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-500/15 dark:text-fuchsia-200" },
  { label: "PDF", icon: FileText, className: "right-8 top-12 bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-200" },
  { label: "Video", icon: Video, className: "left-20 bottom-8 bg-pink-100 text-pink-600 dark:bg-pink-500/15 dark:text-pink-200" },
  { label: "Code", icon: Code2, className: "left-44 bottom-2 bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-200" },
  { label: "Secure", icon: Lock, className: "right-16 bottom-10 bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-200" }
];

export function ToolsBrowser() {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>("all");
  const activeCategory = categoryLinks.find((category) => category.filter === activeFilter) ?? categoryLinks[0];
  const visibleTools = useMemo(() => {
    if (activeFilter === "all") return tools;
    const selectedCategories = activeCategory.categories ?? [activeFilter as ToolCategory];
    return tools.filter((tool) => selectedCategories.includes(tool.category));
  }, [activeCategory.categories, activeFilter]);

  return (
    <main className="bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <section className="mediazy-spotlight border-b border-slate-200 dark:border-slate-800">
        <div className="mediazy-dot-grid mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_420px] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-sm font-semibold text-violet-700 ring-1 ring-violet-100 dark:bg-violet-500/10 dark:text-violet-200 dark:ring-violet-400/20">
              <Blocks className="size-4" />
              Tools
            </p>
            <h1 className="mt-6 text-5xl font-black tracking-tight sm:text-6xl">
              100+ Free Online <span className="text-gradient-purple">Tools</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              All the tools you need in one place. Fast, secure and easy to use.
            </p>
            <div className="mt-7 flex h-14 max-w-xl items-center gap-3 rounded-lg border border-slate-200 bg-white px-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <Search className="size-5 text-slate-500 dark:text-slate-400" />
              <span className="text-slate-500 dark:text-slate-400">Search any tool...</span>
              <span className="ml-auto rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500">Cmd K</span>
            </div>
          </div>
          <div className="hidden justify-center lg:flex">
            <div className="relative h-64 w-96">
              {heroTiles.map((tile) => (
                <div key={tile.label} className={`absolute grid size-24 rotate-6 place-items-center rounded-lg shadow-[0_24px_60px_-38px_rgba(79,70,229,0.8)] ${tile.className}`}>
                  <tile.icon className="size-10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-4 py-4 sm:px-6">
          {categoryLinks.map(({ label, icon: Icon, filter }) => (
            <button key={label} type="button" onClick={() => setActiveFilter(filter)} className={`inline-flex h-11 shrink-0 items-center gap-2 rounded-md px-4 text-sm font-semibold ${activeFilter === filter ? "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-200" : "text-slate-600 hover:bg-slate-50 hover:text-violet-700 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-violet-200"}`}>
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[220px_1fr]">
        <aside className="hidden rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:block">
          <p className="mb-4 font-black">Categories</p>
          <div className="grid gap-1">
            {categoryLinks.map(({ label, icon: Icon, filter, categories }) => {
              const count = filter === "all" ? tools.length : tools.filter((tool) => (categories ?? [filter as ToolCategory]).includes(tool.category)).length;
              return (
                <button key={label} type="button" onClick={() => setActiveFilter(filter)} className={`flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-semibold ${activeFilter === filter ? "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-200" : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"}`}>
                  <Icon className="size-4" />
                  <span className="flex-1">{label}</span>
                  <span className="rounded-full bg-slate-100 px-2 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">{count}</span>
                </button>
              );
            })}
          </div>
        </aside>

        <div>
          <div className="mb-5 flex items-center justify-between gap-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">Showing {visibleTools.length} tools</p>
            <button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold shadow-sm dark:border-slate-800 dark:bg-slate-900">Sort by: Popular</button>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleTools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}
          </div>
          {visibleTools.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
              No tools are available in this category yet.
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
