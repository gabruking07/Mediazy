import Image from "next/image";
import { cn } from "@/shared/utils";

export function BrandMark({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-semibold tracking-tight", className)}>
      <span className="relative grid size-9 place-items-center overflow-hidden rounded-lg bg-white shadow-premium">
        <Image src="/assets/mediazy-logo.png" alt="Mediazy" width={36} height={36} className="size-full object-contain" priority />
      </span>
      {compact ? null : <span>Mediazy</span>}
    </span>
  );
}
