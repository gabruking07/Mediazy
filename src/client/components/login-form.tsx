"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Chrome, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import { Label } from "@/client/components/ui/label";
import { useToast } from "@/client/components/ui/toast";

const loginSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Enter a valid email."),
  password: z.string().min(8, "Use at least 8 characters.")
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [message, setMessage] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { name: "", email: "", password: "" }
  });

  async function submit(values: LoginValues) {
    setMessage("");
    if (mode === "register") {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      if (!response.ok) {
        const data = (await response.json()) as { message?: string };
        const errorMessage = data.message ?? "Could not create account.";
        setMessage(errorMessage);
        toast({
          type: "error",
          title: "Account creation failed",
          description: errorMessage
        });
        return;
      }
      toast({
        type: "success",
        title: "Account created",
        description: "Signing you into your Mediazy workspace."
      });
    }

    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false
    });

    if (result?.error) {
      setMessage("Invalid email or password.");
      toast({
        type: "error",
        title: "Login failed",
        description: "Check your email and password, then try again."
      });
      return;
    }

    toast({
      type: "success",
      title: "Welcome to Mediazy",
      description: "Opening your dashboard."
    });
    setIsNavigating(true);
    router.push("/dashboard");
    router.refresh();
  }

  function continueWithGoogle() {
    setMessage("");
    setIsGoogleLoading(true);
    setIsNavigating(true);
    toast({
      type: "info",
      title: "Opening Google",
      description: "Secure sign-in can take a few seconds."
    });
    void signIn("google", { callbackUrl: "/dashboard" });
  }

  const isBusy = form.formState.isSubmitting || isGoogleLoading || isNavigating;

  return (
    <>
    {isNavigating ? <AuthLoadingOverlay mode={isGoogleLoading ? "google" : "email"} /> : null}
    <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
      {mode === "register" ? (
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" disabled={isBusy} {...form.register("name")} />
        </div>
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" disabled={isBusy} {...form.register("email")} />
        {form.formState.errors.email ? <p className="text-xs text-red-500">{form.formState.errors.email.message}</p> : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} disabled={isBusy} {...form.register("password")} />
        {form.formState.errors.password ? <p className="text-xs text-red-500">{form.formState.errors.password.message}</p> : null}
      </div>
      {message ? <p className="text-sm text-red-500">{message}</p> : null}
      {isBusy ? (
        <p className="rounded-md border border-border bg-muted px-3 py-2 text-center text-sm text-muted-foreground" aria-live="polite">
          {isGoogleLoading ? "Connecting to Google..." : mode === "login" ? "Signing in..." : "Creating your workspace..."}
        </p>
      ) : null}
      <Button type="submit" className="w-full" disabled={isBusy}>
        {form.formState.isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
        {form.formState.isSubmitting ? (mode === "login" ? "Signing in..." : "Creating account...") : mode === "login" ? "Login with email" : "Create account"}
      </Button>
      <Button type="button" variant="outline" className="w-full" onClick={continueWithGoogle} disabled={isBusy}>
        {isGoogleLoading ? <Loader2 className="size-4 animate-spin" /> : <Chrome className="size-4" />}
        {isGoogleLoading ? "Connecting to Google..." : "Continue with Google"}
      </Button>
      <Button type="button" variant="link" className="w-full" disabled={isBusy} onClick={() => setMode(mode === "login" ? "register" : "login")}>
        {mode === "login" ? "Create an account" : "Already have an account? Login"}
      </Button>
    </form>
    </>
  );
}

function AuthLoadingOverlay({ mode }: { mode: "email" | "google" }) {
  return (
    <div className="fixed inset-0 z-[120] grid place-items-center bg-slate-950/82 p-4 text-white backdrop-blur-xl">
      <div className="w-full max-w-sm rounded-xl border border-white/10 bg-white/[0.06] p-6 text-center shadow-premium">
        <div className="mx-auto grid size-14 place-items-center rounded-full border border-white/10 bg-primary/20">
          <Loader2 className="size-7 animate-spin text-primary" />
        </div>
        <h2 className="mt-5 text-xl font-semibold">{mode === "google" ? "Connecting to Google" : "Opening dashboard"}</h2>
        <p className="mt-2 text-sm text-slate-300">
          Secure sign-in is finishing. This can take a few seconds on the first request.
        </p>
        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
        </div>
      </div>
    </div>
  );
}
