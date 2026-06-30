import Link from "next/link";
import { Icon } from "@iconify/react";
import githubIcon from "@iconify-icons/simple-icons/github";
import xIcon from "@iconify-icons/simple-icons/x";
import linkedinIcon from "@iconify-icons/simple-icons/linkedin";
import { BrandMark } from "@/client/components/brand-mark";
import { brand } from "@/shared/brand";

export function SiteFooter() {
  return (
    <footer className="bg-[#071225] text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 text-sm sm:px-6 lg:grid-cols-[1.2fr_0.7fr_0.8fr_0.9fr_1.4fr]">
        <div>
          <BrandMark className="text-white" />
          <p className="mt-4 max-w-xs leading-6">All your online tools. One beautiful place. Fast, free and secure tools for everyone.</p>
          <div className="mt-5 flex gap-2">
            <SocialIcon icon={githubIcon} label="GitHub" />
            <SocialIcon icon={xIcon} label="X" />
            <SocialIcon icon={linkedinIcon} label="LinkedIn" />
          </div>
        </div>

        <FooterNav title="Quick Links" links={[["Home", "/"], ["Tools", "/tools"], ["Cloud", "/cloud"], ["Productivity", "/productivity"], ["About", "/about"], ["Blog", "/blog"], ["Pricing", "/pricing"]]} />
        <FooterNav title="Popular Tools" links={[["PDF Merger", "/tools/merge-pdf"], ["Image Compressor", "/tools/image-compressor"], ["JPG to PNG", "/tools/jpg-to-png"], ["AI Writer", "/tools/text-case-converter"]]} />
        <FooterNav title="About" links={[["Company", "/about"], ["Help Center", "/contact"], ["Privacy Policy", "/privacy"], ["Terms of Service", "/terms"]]} />

        <div className="rounded-lg border border-white/10 bg-white/[0.06] p-5">
          <p className="font-bold text-white">Stay Updated</p>
          <p className="mt-2 text-sm leading-6">Subscribe to get the latest tools, updates and productivity tips.</p>
          <div className="mt-4 flex gap-2">
            <input className="min-w-0 flex-1 rounded-md border border-white/10 bg-white/10 px-3 text-sm text-white placeholder:text-slate-400" placeholder="Enter your email..." />
            <button className="rounded-md bg-gradient-to-r from-violet-600 to-blue-600 px-4 font-semibold text-white">Subscribe</button>
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-col gap-3 border-t border-white/10 px-4 py-5 text-xs text-slate-400 sm:px-6 md:flex-row md:items-center md:justify-between">
        <p>{brand.footer}</p>
        <div className="flex gap-8">
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/contact">Contact Us</Link>
        </div>
      </div>
    </footer>
  );
}

function FooterNav({ title, links }: { title: string; links: Array<[string, string]> }) {
  return (
    <nav className="grid content-start gap-2">
      <p className="mb-1 font-bold text-white">{title}</p>
      {links.map(([label, href]) => (
        <Link key={label} href={href} className="transition hover:text-white">{label}</Link>
      ))}
    </nav>
  );
}

function SocialIcon({ icon, label }: { icon: typeof githubIcon; label: string }) {
  return (
    <span className="grid size-9 place-items-center rounded-full bg-white/10 text-white">
      <Icon icon={icon} className="size-4" />
      <span className="sr-only">{label}</span>
    </span>
  );
}
