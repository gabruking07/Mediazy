"use client";

import { Copy, RefreshCw } from "lucide-react";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import { Button } from "@/client/components/ui/button";

export function UuidGeneratorTool() {
  const [items, setItems] = useState(() => Array.from({ length: 5 }, () => uuid()));

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-border bg-muted p-3 font-mono text-sm">
        {items.map((item) => (
          <div key={item} className="flex items-center justify-between gap-3 border-b border-border py-2 last:border-0">
            <span className="truncate">{item}</span>
            <Button type="button" variant="ghost" size="icon" onClick={() => void navigator.clipboard.writeText(item)}>
              <Copy className="size-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button type="button" onClick={() => setItems(Array.from({ length: 5 }, () => uuid()))}>
        <RefreshCw className="size-4" />
        Generate
      </Button>
    </div>
  );
}
