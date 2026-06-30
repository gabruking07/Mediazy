"use client";

import { Coins, Moon, Star, Sun } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@/client/components/ui/button";
import { BrandMark } from "@/client/components/brand-mark";
import { useToast } from "@/client/components/ui/toast";

export function SiteHeader() {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const { toast } = useToast();
  const pathname = usePathname();
  const isLoggedIn = Boolean(session?.user);
  const promptLogin = () => {
    toast({
      type: "info",
      title: "Login required",
      description: "Please login first to view and manage your XP and coins."
    });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl dark:bg-slate-950/90">
      <div className="mx-auto flex h-[86px] max-w-[1500px] items-center gap-5 px-6 sm:px-8">
        <Link href="/" aria-label="Mediazy home">
          <BrandMark />
        </Link>

        <nav className="mx-auto hidden items-center gap-4 text-base font-semibold text-slate-950 dark:text-slate-100 lg:flex">
          <NavLink href="/" active={pathname === "/"}>Home</NavLink>
          <NavLink href="/tools" active={pathname.startsWith("/tools")}>Tools</NavLink>
          <NavLink href="/ai" active={pathname === "/ai"}>AI Tools</NavLink>
          <NavLink href="/about" active={pathname === "/about"}>Resources</NavLink>
          <NavLink href="/blog" active={pathname === "/blog"}>Blog</NavLink>
          <NavLink href="/pricing" active={pathname === "/pricing"}>Pricing</NavLink>
        </nav>

        <Button type="button" variant="outline" size="icon" className="size-14 rounded-full border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle dark mode">
          <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
        {isLoggedIn ? (
          <>
            <Link href="/dashboard" className="hidden h-14 items-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-base font-bold text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 sm:inline-flex">
              <Star className="size-4 fill-amber-400 text-amber-400" /> 2450 XP
            </Link>
            <Link href="/dashboard" className="hidden h-14 items-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-base font-bold text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 sm:inline-flex">
              <Coins className="size-4 text-amber-500" /> 1250
            </Link>
          </>
        ) : (
          <>
            <button type="button" onClick={promptLogin} className="hidden h-14 items-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-base font-bold text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 sm:inline-flex">
              <Star className="size-4 fill-amber-400 text-amber-400" /> 0 XP
            </button>
            <button type="button" onClick={promptLogin} className="hidden h-14 items-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-base font-bold text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 sm:inline-flex">
              <Coins className="size-4 text-amber-500" /> 0
            </button>
          </>
        )}
        <Link href="/login" className="grid size-14 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-blue-600 text-xl font-bold text-white shadow-sm">
          M
        </Link>
      </div>
    </header>
  );
}

function NavLink({ href, active, children }: { href: string; active?: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} className={`inline-flex h-12 items-center rounded-full px-6 transition hover:bg-violet-50 hover:text-violet-700 dark:hover:bg-violet-500/10 dark:hover:text-violet-200 ${active ? "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-200" : ""}`}>
      {children}
    </Link>
  );
}
