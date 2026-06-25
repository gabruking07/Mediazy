import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing-shell";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Mediazy privacy policy by Aurex Technologies.",
  authors: [{ name: "Aurex Technologies" }]
};

export default function PrivacyPage() {
  return (
    <MarketingShell>
      <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <h1 className="text-4xl font-semibold tracking-tight">Privacy Policy</h1>
        <p className="mt-4 text-muted-foreground">{brand.legalOwnership}</p>
        <div className="prose prose-slate mt-8 max-w-none dark:prose-invert">
          <p>
            Aurex Technologies is the legal company responsible for Mediazy. We collect only the information required to provide accounts, authentication, dashboard preferences, support, analytics, and secure application operations.
          </p>
          <p>
            Uploaded files and tool inputs are processed according to the tool workflow. Browser-based tools keep processing local whenever possible. Production deployments should configure database, authentication, upload, and analytics providers with appropriate data retention settings.
          </p>
          <p>
            For privacy requests, contact {brand.supportEmail}.
          </p>
        </div>
      </main>
    </MarketingShell>
  );
}
