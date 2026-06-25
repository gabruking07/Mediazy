"use client";

import { Moon, Search, Sun } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useMemo, useState } from "react";
import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import { searchTools } from "@/shared/tools/registry";

export function SiteHeader() {
  const { theme, setTheme } = useTheme();
  const [query, setQuery] = useState("");
  const matches = useMemo(() => searchTools(query).slice(0, 5), [query]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid size-8 place-items-center rounded-md bg-primary text-sm text-white">M</span>
          <span>Mediazy</span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-muted-foreground md:flex">
          <Link href="/tools" className="hover:text-foreground">Tools</Link>
          <Link href="/categories/image" className="hover:text-foreground">Categories</Link>
          <Link href="/about" className="hover:text-foreground">About</Link>
          <Link href="/contact" className="hover:text-foreground">Contact</Link>
        </nav>
        <div className="relative ml-auto hidden w-full max-w-sm md:block">
          <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tools" className="pl-9" />
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
