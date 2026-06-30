import type { Metadata } from "next";
import { MarketingShell } from "@/client/components/marketing-shell";

export const metadata: Metadata = {
  title: "About",
  description: "About Mediazy and KenoraTech.",
  authors: [{ name: "KenoraTech" }]
};

export default function AboutPage() {
  return (
    <MarketingShell>
      <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <h1 className="text-4xl font-semibold tracking-tight">About Mediazy</h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Mediazy is proudly developed by KenoraTech, a software company focused on building modern digital products, AI solutions, SaaS platforms, and web applications for creators, developers, businesses, and startups.
        </p>
        <section className="mt-12 rounded-lg border border-border bg-card p-6">
          <h2 className="text-2xl font-semibold tracking-tight">About KenoraTech</h2>
          <p className="mt-4 leading-8 text-muted-foreground">
            KenoraTech is an Indian software company dedicated to building innovative digital products, AI-powered applications, SaaS platforms, and custom software solutions. Our mission is to simplify technology through fast, reliable, and user-friendly products that empower creators, developers, businesses, and startups worldwide.
          </p>
        </section>
      </main>
    </MarketingShell>
  );
}
