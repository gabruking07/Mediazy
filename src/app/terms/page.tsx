import type { Metadata } from "next";
import { MarketingShell } from "@/client/components/marketing-shell";
import { brand } from "@/shared/brand";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Mediazy terms of service by Aurex Technologies.",
  authors: [{ name: "Aurex Technologies" }]
};

export default function TermsPage() {
  return (
    <MarketingShell>
      <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <h1 className="text-4xl font-semibold tracking-tight">Terms of Service</h1>
        <p className="mt-4 text-muted-foreground">{brand.legalOwnership}</p>
        <div className="prose prose-slate mt-8 max-w-none dark:prose-invert">
          <p>
            Aurex Technologies is the owner and service provider for Mediazy. By using Mediazy, you agree to use the platform lawfully and avoid uploading content that infringes rights, contains malicious material, or violates applicable regulations.
          </p>
          <p>
            Mediazy tools are provided to simplify everyday digital workflows. Availability, limits, and features may evolve as Aurex Technologies improves the product.
          </p>
          <p>
            Support questions can be sent to {brand.supportEmail}.
          </p>
        </div>
      </main>
    </MarketingShell>
  );
}
