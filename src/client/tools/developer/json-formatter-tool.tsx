"use client";

import { useState } from "react";
import { Button } from "@/client/components/ui/button";
import { Textarea } from "@/client/components/ui/textarea";

export function JsonFormatterTool() {
  const [input, setInput] = useState('{"mediazy":"built by Aurex Technologies"}');
  const [status, setStatus] = useState("Valid JSON");

  function transform(type: "format" | "minify") {
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed, null, type === "format" ? 2 : 0));
      setStatus("Valid JSON");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Invalid JSON");
    }
  }

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={(event) => setInput(event.target.value)} className="min-h-72 font-mono" />
      <p className="text-sm text-muted-foreground">{status}</p>
      <div className="flex gap-2">
        <Button type="button" onClick={() => transform("format")}>
          Format
        </Button>
        <Button type="button" variant="outline" onClick={() => transform("minify")}>
          Minify
        </Button>
      </div>
    </div>
  );
}
