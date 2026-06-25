import { Sparkles } from "lucide-react";
import { cn } from "@/shared/utils";

export function BrandMark({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-semibold tracking-tight", className)}>
      <span className="relative grid size-9 place-items-center overflow-hidden rounded-lg bg-dark text-white shadow-premium">
        <span className="absolute inset-0 bg-[linear-gradient(135deg,#2563EB_0%,#14B8A6_52%,#F97316_100%)]" />
        <Sparkles className="relative size-4" />
      </span>
      {compact ? null : <span>Mediazy</span>}
    </span>
  );
}
