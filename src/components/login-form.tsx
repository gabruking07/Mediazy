"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Chrome } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Enter a valid email."),
  password: z.string().min(8, "Use at least 8 characters.")
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [message, setMessage] = useState("");
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
        setMessage(data.message ?? "Could not create account.");
        return;
      }
    }

    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false
    });

    if (result?.error) {
      setMessage("Invalid email or password.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
      {mode === "register" ? (
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...form.register("name")} />
        </div>
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
        {form.formState.errors.email ? <p className="text-xs text-red-500">{form.formState.errors.email.message}</p> : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} {...form.register("password")} />
        {form.formState.errors.password ? <p className="text-xs text-red-500">{form.formState.errors.password.message}</p> : null}
      </div>
      {message ? <p className="text-sm text-red-500">{message}</p> : null}
      <Button type="submit" className="w-full">
        {mode === "login" ? "Login with email" : "Create account"}
      </Button>
      <Button type="button" variant="outline" className="w-full" onClick={() => void signIn("google", { callbackUrl: "/dashboard" })}>
        <Chrome className="size-4" />
        Continue with Google
      </Button>
      <Button type="button" variant="link" className="w-full" onClick={() => setMode(mode === "login" ? "register" : "login")}>
        {mode === "login" ? "Create an account" : "Already have an account? Login"}
      </Button>
    </form>
  );
}
