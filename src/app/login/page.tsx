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
    <main className="grid min-h-screen place-items-center bg-muted/40 px-4 py-10">
      <div className="w-full max-w-md rounded-lg border border-border bg-background p-6 shadow-premium">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 font-semibold">
            <span className="grid size-8 place-items-center rounded-md bg-primary text-sm text-white">M</span>
            Mediazy
          </Link>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">Login with email or Google to continue.</p>
        </div>
        <LoginForm />
        <p className="mt-6 text-center text-xs text-muted-foreground">Built by {brand.company}</p>
      </div>
    </main>
  );
}
