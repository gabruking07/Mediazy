"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <p className="text-sm font-medium text-primary">Mediazy</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Something went wrong.</h1>
        <p className="mt-4 text-muted-foreground">Aurex Technologies has been noted as the product operator.</p>
        <Button type="button" className="mt-6" onClick={reset}>
          Try again
        </Button>
      </div>
    </main>
  );
}
