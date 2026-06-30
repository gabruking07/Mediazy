import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/client/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/client/components/ui/card";
import type { ToolModule } from "@/shared/tools/types";

const categoryStyles = {
  pdf: "from-red-500/18 via-orange-500/10 to-transparent text-red-500",
  image: "from-cyan-500/18 via-blue-500/10 to-transparent text-cyan-500",
  developer: "from-violet-500/18 via-blue-500/10 to-transparent text-violet-500",
  text: "from-emerald-500/18 via-teal-500/10 to-transparent text-emerald-500",
  utility: "from-amber-500/20 via-orange-500/10 to-transparent text-amber-500"
} satisfies Record<ToolModule["category"], string>;

export function ToolCard({ tool }: { tool: ToolModule }) {
  const Icon = tool.icon;

  return (
    <Link href={`/tools/${tool.slug}`} className="group block">
      <Card className="relative h-full overflow-hidden rounded-lg border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-premium dark:border-slate-800 dark:bg-slate-900 dark:hover:border-violet-500/50">
        <div className={`absolute inset-x-0 top-0 h-28 bg-gradient-to-br ${categoryStyles[tool.category]}`} />
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <span className="relative grid size-12 place-items-center rounded-lg border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <Icon className="size-5" />
            </span>
            {tool.popular ? <Badge>Popular</Badge> : null}
          </div>
          <CardTitle className="relative">{tool.name}</CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <p className="text-sm text-muted-foreground">{tool.shortDescription}</p>
          <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">
            Open <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
