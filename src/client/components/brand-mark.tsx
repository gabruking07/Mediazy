import Image from "next/image";
import { cn } from "@/shared/utils";

export function BrandMark({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-xl font-black tracking-tight text-slate-950 dark:text-white", className)}>
      <span className="relative grid size-9 place-items-center overflow-hidden rounded-md bg-white">
        <Image src="/assets/mediazy-logo.png" alt="Mediazy" width={36} height={36} className="size-full object-contain" priority />
      </span>
      {compact ? null : <span className="uppercase">Mediazy</span>}
    </span>
  );
}
