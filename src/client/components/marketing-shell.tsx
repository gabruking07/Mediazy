import { SiteFooter } from "@/client/components/site-footer";
import { SiteHeader } from "@/client/components/site-header";

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
