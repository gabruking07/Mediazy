import type { Metadata } from "next";
import Link from "next/link";
import { Check, Sparkles, Zap } from "lucide-react";
import { MarketingShell } from "@/client/components/marketing-shell";
import { brand } from "@/shared/brand";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "For everyday file, image, text, and developer tasks.",
    features: ["Core browser tools", "Local-first processing", "Basic XP and coins", "Community updates"],
    cta: "Start free",
    href: "/tools"
  },
  {
    name: "Pro",
    price: "$9",
    description: "For creators and teams who want higher limits and premium workflows.",
    features: ["Everything in Free", "Premium workspace themes", "Higher daily rewards", "Priority tool requests"],
    cta: "Contact sales",
    href: "/contact"
  }
];

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple Mediazy pricing for free and premium online tools.",
  authors: [{ name: brand.company }]
};

export default function PricingPage() {
  return (
    <MarketingShell>
      <main className="bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-100">
        <section className="mediazy-spotlight border-b border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
            <p className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-sm font-semibold text-violet-700 ring-1 ring-violet-100 dark:bg-violet-500/10 dark:text-violet-200 dark:ring-violet-400/20">
              <Sparkles className="size-4" />
              Pricing
            </p>
            <h1 className="mt-6 max-w-3xl text-5xl font-black tracking-tight sm:text-6xl">
              Use Mediazy free, upgrade when your workflow grows.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Start with fast online tools today. Pro options are built for heavier usage, team workflows, and premium rewards.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-5 px-4 py-12 sm:px-6 lg:grid-cols-2">
          {plans.map((plan) => (
            <article key={plan.name} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black">{plan.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{plan.description}</p>
                </div>
                <div className="rounded-lg bg-violet-50 px-4 py-3 text-right dark:bg-violet-500/10">
                  <p className="text-3xl font-black text-violet-700 dark:text-violet-200">{plan.price}</p>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">per month</p>
                </div>
              </div>
              <ul className="mt-6 grid gap-3 text-sm text-slate-700 dark:text-slate-300">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="size-4 text-emerald-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href={plan.href} className="mt-8 inline-flex h-11 items-center gap-2 rounded-md bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-violet-700 dark:bg-white dark:text-slate-950 dark:hover:bg-violet-200">
                <Zap className="size-4" />
                {plan.cta}
              </Link>
            </article>
          ))}
        </section>
      </main>
    </MarketingShell>
  );
}
