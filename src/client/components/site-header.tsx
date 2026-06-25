"use client";

import { Command, Moon, Search, Sun } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useMemo, useState } from "react";
import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import { BrandMark } from "@/client/components/brand-mark";
import { searchTools } from "@/shared/tools/registry";

export function SiteHeader() {
  const { theme, setTheme } = useTheme();
  const [query, setQuery] = useState("");
  const matches = useMemo(() => searchTools(query).slice(0, 5), [query]);

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/82 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="Mediazy home">
          <BrandMark />
        </Link>
        <nav className="hidden items-center gap-1 rounded-lg border border-border bg-muted/50 p-1 text-sm text-muted-foreground md:flex">
          <NavLink href="/tools">Tools</NavLink>
          <NavLink href="/categories/image">Categories</NavLink>
          <NavLink href="/about">About</NavLink>
          <NavLink href="/contact">Contact</NavLink>
        </nav>
        <div className="relative ml-auto hidden w-full max-w-sm md:block">
          <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Command className="pointer-events-none absolute right-3 top-2.5 size-4 text-muted-foreground" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Mediazy" className="pl-9 pr-9" />
          {query ? (
            <div className="absolute mt-2 w-full overflow-hidden rounded-lg border border-border bg-card shadow-premium">
              {matches.map((tool) => (
                <Link key={tool.slug} href={`/tools/${tool.slug}`} className="block px-3 py-2 text-sm hover:bg-muted" onClick={() => setQuery("")}>
                  {tool.name}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
        <Button type="button" variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle dark mode">
          <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
        <Button asChild variant="outline" className="hidden sm:inline-flex">
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild>
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="rounded-md px-3 py-1.5 transition hover:bg-background hover:text-foreground hover:shadow-sm">
      {children}
    </Link>
  );
}
