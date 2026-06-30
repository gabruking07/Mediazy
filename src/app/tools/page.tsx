import type { Metadata } from "next";
import { MarketingShell } from "@/client/components/marketing-shell";
import { ToolsBrowser } from "@/client/components/tools-browser";
import { brand } from "@/shared/brand";

export const metadata: Metadata = {
  title: "Tools",
  description: "Browse all Mediazy tools for PDF, image, developer, text, and utility workflows.",
  authors: [{ name: brand.company }]
};

export default function ToolsPage() {
  return (
    <MarketingShell>
      <ToolsBrowser />
    </MarketingShell>
  );
}
