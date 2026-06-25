import Link from "next/link";
import { brand } from "@/lib/brand";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm text-muted-foreground sm:px-6 md:grid-cols-[1fr_auto]">
        <div>
          <p className="font-medium text-foreground">Mediazy</p>
          <p className="mt-2 max-w-lg">A premium toolkit by Aurex Technologies for fast everyday file, developer, and utility workflows.</p>
          <p className="mt-4">{brand.footer}</p>
        </div>
        <nav className="grid grid-cols-2 gap-x-10 gap-y-2">
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </nav>
      </div>
    </footer>
  );
}
