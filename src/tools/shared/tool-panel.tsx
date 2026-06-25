"use client";

import { Download, Heart, RotateCcw } from "lucide-react";
import { ReactNode, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToolStore } from "@/store/use-tool-store";

type ToolPanelProps = {
  slug: string;
  title: string;
  description: string;
  children: ReactNode;
  actions?: ReactNode;
};

export function ToolPanel({ slug, title, description, children, actions }: ToolPanelProps) {
  const { favorites, markRecent, toggleFavorite } = useToolStore();
  const isFavorite = favorites.includes(slug);

  useEffect(() => {
    markRecent(slug);
  }, [markRecent, slug]);

  return (
    <Card className="shadow-premium">
      <CardHeader className="border-b border-border">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription className="mt-2 max-w-2xl">{description}</CardDescription>
          </div>
          <Button
            type="button"
            variant={isFavorite ? "default" : "outline"}
            size="sm"
            onClick={() => toggleFavorite(slug)}
            aria-label={isFavorite ? "Remove favorite" : "Add favorite"}
          >
            <Heart className="size-4" />
            Favorite
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pt-5">
        {children}
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </CardContent>
    </Card>
  );
}

export function DownloadButton({ href, fileName }: { href: string | null; fileName: string }) {
  if (!href) return null;

  return (
    <Button asChild>
      <a href={href} download={fileName}>
        <Download className="size-4" />
        Download
      </a>
    </Button>
  );
}

export function ResetButton({ onClick }: { onClick: () => void }) {
  return (
    <Button type="button" variant="outline" onClick={onClick}>
      <RotateCcw className="size-4" />
      Reset
    </Button>
  );
}
