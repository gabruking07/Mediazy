import type { Metadata } from "next";
import Link from "next/link";
import { Blocks, Code2, FileText, ImageIcon, Lock, Search, Sparkles, Video, Wand2, Zap } from "lucide-react";
import { MarketingShell } from "@/client/components/marketing-shell";
import { ToolCard } from "@/client/components/tool-card";
import { tools } from "@/shared/tools/registry";
import { brand } from "@/shared/brand";

export const metadata: Metadata = {
  title: "Tools",
  description: "Browse all Mediazy tools for PDF, image, developer, text, and utility workflows.",
  authors: [{ name: brand.company }]
};

const categoryLinks = [
  ["All Tools", Blocks, "120"],
  ["AI Tools", Sparkles, "18"],
  ["Image Tools", ImageIcon, "25"],
  ["PDF Tools", FileText, "15"],
  ["Converters", Zap, "20"],
  ["Utilities", Lock, "18"],
  ["Developer", Code2, "12"],
  ["Video Tools", Video, "7"]
] as const;

const heroTiles = [
  { label: "Image", icon: ImageIcon, className: "left-8 top-8 bg-violet-100 text-violet-600" },
  { label: "Text", icon: Wand2, className: "left-36 top-0 bg-fuchsia-100 text-fuchsia-600" },
  { label: "PDF", icon: FileText, className: "right-8 top-12 bg-rose-100 text-rose-600" },
  { label: "Video", icon: Video, className: "left-20 bottom-8 bg-pink-100 text-pink-600" },
  { label: "Code", icon: Code2, className: "left-44 bottom-2 bg-blue-100 text-blue-600" },
  { label: "Secure", icon: Lock, className: "right-16 bottom-10 bg-emerald-100 text-emerald-600" }
];

export default function ToolsPage() {
  return (
    <MarketingShell>
      <main className="bg-white text-slate-950">
        <section className="mediazy-spotlight border-b border-slate-200">
          <div className="mediazy-dot-grid mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_420px] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-sm font-semibold text-violet-700 ring-1 ring-violet-100">
                <Blocks className="size-4" />
                Tools
              </p>
              <h1 className="mt-6 text-5xl font-black tracking-tight sm:text-6xl">
                100+ Free Online <span className="text-gradient-purple">Tools</span>
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                All the tools you need in one place. Fast, secure and easy to use.
              </p>
              <div className="mt-7 flex h-14 max-w-xl items-center gap-3 rounded-lg border border-slate-200 bg-white px-5 shadow-sm">
                <Search className="size-5 text-slate-500" />
                <span className="text-slate-500">Search any tool...</span>
                <span className="ml-auto rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500">⌘ K</span>
              </div>
            </div>
            <div className="hidden justify-center lg:flex">
              <div className="relative h-64 w-96">
                {heroTiles.map((tile) => (
                  <div key={tile.label} className={`absolute grid size-24 rotate-6 place-items-center rounded-2xl shadow-[0_24px_60px_-38px_rgba(79,70,229,0.8)] ${tile.className}`}>
                    <tile.icon className="size-10" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-4 py-4 sm:px-6">
            {categoryLinks.map(([label, Icon], index) => (
              <Link key={label} href="/tools" className={`inline-flex h-11 shrink-0 items-center gap-2 rounded-md px-4 text-sm font-semibold ${index === 0 ? "bg-violet-100 text-violet-700" : "text-slate-600 hover:bg-slate-50 hover:text-violet-700"}`}>
                <Icon className="size-4" />
                {label}
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[220px_1fr]">
          <aside className="hidden rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:block">
            <p className="mb-4 font-black">Categories</p>
            <div className="grid gap-1">
              {categoryLinks.map(([label, Icon, count], index) => (
                <Link key={label} href="/tools" className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold ${index === 0 ? "bg-violet-100 text-violet-700" : "text-slate-600 hover:bg-slate-50"}`}>
                  <Icon className="size-4" />
                  <span className="flex-1">{label}</span>
                  <span className="rounded-full bg-slate-100 px-2 text-xs text-slate-600">{count}</span>
                </Link>
              ))}
            </div>
          </aside>

          <div>
            <div className="mb-5 flex items-center justify-between gap-4">
              <p className="text-sm text-slate-600">Showing {tools.length} tools</p>
              <button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold shadow-sm">Sort by: Popular</button>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {tools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}
            </div>
          </div>
        </section>
      </main>
    </MarketingShell>
  );
}
