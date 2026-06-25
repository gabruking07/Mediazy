import Link from "next/link";
import { Icon } from "@iconify/react";
import githubIcon from "@iconify-icons/simple-icons/github";
import xIcon from "@iconify-icons/simple-icons/x";
import linkedinIcon from "@iconify-icons/simple-icons/linkedin";
import { BrandMark } from "@/client/components/brand-mark";
import { brand } from "@/shared/brand";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/35">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 text-sm text-muted-foreground sm:px-6 md:grid-cols-[1fr_auto]">
        <div>
          <BrandMark className="text-foreground" />
          <p className="mt-2 max-w-lg">A premium toolkit by Aurex Technologies for fast everyday file, developer, and utility workflows.</p>
          <p className="mt-4">{brand.footer}</p>
          <div className="mt-5 flex gap-2">
            <SocialIcon icon={githubIcon} label="GitHub" />
            <SocialIcon icon={xIcon} label="X" />
            <SocialIcon icon={linkedinIcon} label="LinkedIn" />
          </div>
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

function SocialIcon({ icon, label }: { icon: typeof githubIcon; label: string }) {
  return (
    <span className="grid size-9 place-items-center rounded-md border border-border bg-background text-foreground">
      <Icon icon={icon} className="size-4" />
      <span className="sr-only">{label}</span>
    </span>
  );
}
