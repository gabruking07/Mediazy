import { cn } from "@/shared/utils";

export function PremiumBackground({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="absolute -left-28 top-10 size-80 rounded-full bg-blue-500/30 blur-3xl" />
      <div className="absolute right-0 top-24 size-96 rounded-full bg-cyan-400/18 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 size-80 rounded-full bg-fuchsia-500/16 blur-3xl" />
      <div className="mediazy-grid absolute inset-0 opacity-45" />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.11),transparent_18%,transparent_75%,rgba(255,255,255,0.07))]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}

export function AuroraBand({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-lg border border-border bg-card shadow-premium", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.22),transparent_34%),radial-gradient(circle_at_80%_30%,rgba(20,184,166,0.18),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(249,115,22,0.14),transparent_34%)]" />
      <div className="absolute inset-0 mediazy-grid opacity-30" />
      <div className="relative" />
    </div>
  );
}
