"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { BrandMark } from "@/client/components/brand-mark";

export function SiteHeader() {
  return <header className="mz-header"><div className="mediazy-wrap mz-nav"><Link href="/" aria-label="Mediazy home"><BrandMark /></Link><nav><Link href="#tools">Features</Link><Link href="/pricing">Pricing</Link><Link href="/about">Docs</Link><Link href="/blog">Blog</Link></nav><div className="nav-actions"><Link href="/login" className="login-link">Login</Link><Link href="/signup" className="mz-button nav-cta">Start Creating</Link><button aria-label="Open menu" className="mobile-menu"><Menu size={21} /></button></div></div></header>;
}
