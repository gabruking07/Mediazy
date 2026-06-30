import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { MarketingShell } from "@/client/components/marketing-shell";
import { brand } from "@/shared/brand";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Mediazy support by KenoraTech.",
  authors: [{ name: "KenoraTech" }]
};

export default function ContactPage() {
  return (
    <MarketingShell>
      <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <h1 className="text-4xl font-semibold tracking-tight">Contact</h1>
        <p className="mt-4 text-muted-foreground">Mediazy support is managed by {brand.company}.</p>
        <div className="mt-8 rounded-lg border border-border bg-card p-6">
          <p className="text-sm font-medium text-muted-foreground">Company</p>
          <p className="mt-1 text-lg font-semibold">{brand.company}</p>
          <p className="mt-6 text-sm font-medium text-muted-foreground">Support Email</p>
          <a href={`mailto:${brand.supportEmail}`} className="mt-2 inline-flex items-center gap-2 text-primary">
            <Mail className="size-4" />
            {brand.supportEmail}
          </a>
        </div>
      </main>
    </MarketingShell>
  );
}
