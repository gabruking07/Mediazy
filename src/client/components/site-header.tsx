"use client";

import { ChevronDown, Coins, Command, Moon, Search, Star, Sun } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useMemo, useState } from "react";
import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import { BrandMark } from "@/client/components/brand-mark";
import { useToast } from "@/client/components/ui/toast";
import { searchTools } from "@/shared/tools/registry";

export function SiteHeader() {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const matches = useMemo(() => searchTools(query).slice(0, 5), [query]);
  const isLoggedIn = Boolean(session?.user);
  const promptLogin = () => {
    toast({
      type: "info",
      title: "Login required",
      description: "Please login first to view and manage your XP and coins."
    });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/90">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="Mediazy home">
          <BrandMark />
        </Link>

        <nav className="hidden items-center gap-3 text-sm font-semibold text-slate-950 dark:text-slate-100 lg:flex">
          <NavLink href="/" active={pathname === "/"}>Home</NavLink>
          <NavLink href="/tools" active={pathname.startsWith("/tools")}>Tools <ChevronDown className="size-3.5" /></NavLink>
          <NavLink href="/categories/image" active={pathname.startsWith("/categories")}>AI Tools</NavLink>
          <NavLink href="/about" active={pathname === "/about"}>About</NavLink>
          <NavLink href="/pricing" active={pathname === "/pricing"}>Pricing</NavLink>
          <NavLink href="/blog" active={pathname === "/blog"}>Blog</NavLink>
        </nav>

        <div className="relative ml-auto hidden w-full max-w-xs md:block">
          <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-slate-500 dark:text-slate-400" />
          <span className="pointer-events-none absolute right-2 top-2 inline-flex h-6 items-center gap-1 rounded-md bg-white px-2 text-xs font-semibold text-slate-500 shadow-sm dark:bg-slate-800 dark:text-slate-300">
            <Command className="size-3" /> K
          </span>
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tools..." className="h-10 rounded-2xl border-slate-200 bg-slate-50 pl-9 pr-16 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100" />
          {query ? (
            <div className="absolute mt-2 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-premium dark:border-slate-800 dark:bg-slate-900">
              {matches.map((tool) => (
                <Link key={tool.slug} href={`/tools/${tool.slug}`} className="block px-3 py-2 text-sm hover:bg-violet-50 dark:hover:bg-slate-800" onClick={() => setQuery("")}>
                  {tool.name}
                </Link>
              ))}
            </div>
          ) : null}
        </div>

        <Button type="button" variant="outline" size="icon" className="rounded-full border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle dark mode">
          <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
        {isLoggedIn ? (
          <>
            <Link href="/dashboard" className="hidden h-10 items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-4 text-sm font-bold text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-200 sm:inline-flex">
              <Star className="size-4 fill-amber-400 text-amber-400" /> 2450 XP
            </Link>
            <Link href="/dashboard" className="hidden h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-bold text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 sm:inline-flex">
              <Coins className="size-4 text-amber-500" /> 1250
            </Link>
          </>
        ) : (
          <>
            <button type="button" onClick={promptLogin} className="hidden h-10 items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-4 text-sm font-bold text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-200 sm:inline-flex">
              <Star className="size-4 fill-amber-400 text-amber-400" /> 0 XP
            </button>
            <button type="button" onClick={promptLogin} className="hidden h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-bold text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 sm:inline-flex">
              <Coins className="size-4 text-amber-500" /> 0
            </button>
          </>
        )}
        <Link href="/login" className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-blue-600 text-sm font-bold text-white shadow-sm">
          M
        </Link>
      </div>
    </header>
  );
}

function NavLink({ href, active, children }: { href: string; active?: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} className={`inline-flex items-center gap-1 rounded-full px-4 py-2 transition hover:bg-violet-50 hover:text-violet-700 dark:hover:bg-violet-500/10 dark:hover:text-violet-200 ${active ? "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-200" : ""}`}>
      {children}
    </Link>
  );
}
