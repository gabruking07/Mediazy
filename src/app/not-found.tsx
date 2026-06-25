import Link from "next/link";
import { Button } from "@/client/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <p className="text-sm font-medium text-primary">404</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Mediazy by Aurex Technologies</h1>
        <p className="mt-4 text-muted-foreground">The page you are looking for does not exist.</p>
        <Button asChild className="mt-6">
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </main>
  );
}
