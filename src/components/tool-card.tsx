import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ToolModule } from "@/lib/tools/types";

export function ToolCard({ tool }: { tool: ToolModule }) {
  const Icon = tool.icon;

  return (
    <Link href={`/tools/${tool.slug}`} className="group block">
      <Card className="h-full transition hover:-translate-y-0.5 hover:shadow-premium">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <span className="grid size-10 place-items-center rounded-md bg-primary/10 text-primary">
              <Icon className="size-5" />
            </span>
            {tool.popular ? <Badge>Popular</Badge> : null}
          </div>
          <CardTitle>{tool.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{tool.shortDescription}</p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
            Open <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
