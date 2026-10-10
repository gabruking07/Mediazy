import Image from "next/image";
import Link from "next/link";
import kenoraTech from "../../../assets/By Kenora Tech.png";
import { BrandMark } from "@/client/components/brand-mark";

export function SiteFooter() {
  return <footer className="mz-footer"><div className="mediazy-wrap footer-grid"><div><BrandMark /><p>AI chat, image generation and content creation in one focused creative workspace.</p><Image src={kenoraTech} alt="By KenoraTech" className="kenora-brand" /></div><FooterNav title="Product" links={[["AI Chat", "/chat"], ["AI Image", "/image"], ["AI Content", "/content"], ["Pricing", "/pricing"]]} /><FooterNav title="Company" links={[["About", "/about"], ["Contact", "/contact"], ["Blog", "/blog"]]} /><FooterNav title="Resources" links={[["Docs", "/about"], ["Help", "/contact"], ["FAQ", "/#pricing"], ["Privacy", "/privacy"]]} /></div><div className="mediazy-wrap footer-bottom"><span>© 2026 Mediazy. All rights reserved.</span><span>Built for creators, by KenoraTech.</span></div></footer>;
}

function FooterNav({ title, links }: { title: string; links: Array<[string, string]> }) { return <nav><h3>{title}</h3>{links.map(([label, href]) => <Link href={href} key={label}>{label}</Link>)}</nav>; }
