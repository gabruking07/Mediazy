import { ArrowLeft, ShieldCheck, Sparkles, Zap } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/client/components/login-form";
import { brand } from "@/shared/brand";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your Mediazy dashboard.",
  authors: [{ name: "Aurex Technologies" }]
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-dark px-4 py-8 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(37,99,235,0.25),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(20,184,166,0.15),transparent_26%)]" />
      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] shadow-premium backdrop-blur-xl lg:grid-cols-[1fr_460px]">
        <section className="hidden p-8 lg:flex lg:flex-col lg:justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white">
            <ArrowLeft className="size-4" />
            Back to Mediazy
          </Link>
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300">
              <Sparkles className="size-4 text-primary" />
              Built by {brand.company}
            </div>
            <h1 className="max-w-xl text-5xl font-semibold tracking-tight">Your tools, rewards, and workflow in one calm command center.</h1>
            <div className="mt-8 grid max-w-lg grid-cols-2 gap-3">
              <LoginStat icon={Zap} label="Earn XP for meaningful actions" />
              <LoginStat icon={ShieldCheck} label="Private browser-first utilities" />
            </div>
          </div>
          <p className="text-sm text-slate-400">Mediazy is owned and operated by {brand.company}.</p>
        </section>
        <section className="flex items-center justify-center bg-background px-4 py-10 text-foreground sm:px-8">
          <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-premium">
            <div className="mb-6">
              <Link href="/" className="inline-flex items-center gap-2 font-semibold">
                <span className="grid size-8 place-items-center rounded-md bg-primary text-sm text-white">M</span>
                Mediazy
              </Link>
              <h2 className="mt-6 text-2xl font-semibold tracking-tight">Welcome back</h2>
              <p className="mt-2 text-sm text-muted-foreground">Login with email or Google to continue.</p>
            </div>
            <LoginForm />
            <p className="mt-6 text-center text-xs text-muted-foreground">Built by {brand.company}</p>
          </div>
        </section>
      </div>
    </main>
  );
}

function LoginStat({ icon: Icon, label }: { icon: typeof Zap; label: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
      <Icon className="size-5 text-primary" />
      <p className="mt-4 text-sm text-slate-300">{label}</p>
    </div>
  );
}
