"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const transforms = {
  Uppercase: (value: string) => value.toUpperCase(),
  Lowercase: (value: string) => value.toLowerCase(),
  "Title Case": (value: string) => value.toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase()),
  "Sentence case": (value: string) => value.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (letter) => letter.toUpperCase()),
  "Slug case": (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, ""),
  camelCase: (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+(.)/g, (_, character: string) => character.toUpperCase())
};

export function TextCaseTool() {
  const [input, setInput] = useState("Mediazy is built by Aurex Technologies");
  const [mode, setMode] = useState<keyof typeof transforms>("Title Case");
  const output = useMemo(() => transforms[mode](input), [input, mode]);

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={(event) => setInput(event.target.value)} />
      <div className="flex flex-wrap gap-2">
        {Object.keys(transforms).map((item) => (
          <Button
            key={item}
            type="button"
            size="sm"
            variant={mode === item ? "default" : "outline"}
            onClick={() => setMode(item as keyof typeof transforms)}
          >
            {item}
          </Button>
        ))}
      </div>
      <Textarea value={output} readOnly className="bg-muted" />
    </div>
  );
}
