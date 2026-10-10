"use client";

import { Copy, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import { Label } from "@/client/components/ui/label";

const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}";

export function PasswordGeneratorTool() {
  const [length, setLength] = useState(18);
  const [nonce, setNonce] = useState(0);
  const password = useMemo(() => {
    void nonce;
    const values = new Uint32Array(length);
    if (typeof crypto !== "undefined") crypto.getRandomValues(values);
    return Array.from({ length }, (_, index) => alphabet[(values[index] || Math.floor(Math.random() * alphabet.length)) % alphabet.length]).join("");
  }, [length, nonce]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="length">Length {length}</Label>
        <Input id="length" type="range" min="8" max="64" value={length} onChange={(event) => setLength(Number(event.target.value))} />
      </div>
      <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-muted p-3 font-mono">
        <span className="break-all text-sm">{password}</span>
        <Button type="button" variant="ghost" size="icon" onClick={() => void navigator.clipboard.writeText(password)}>
          <Copy className="size-4" />
        </Button>
      </div>
      <Button type="button" onClick={() => setNonce((value) => value + 1)}>
        <RefreshCw className="size-4" />
        Generate
      </Button>
    </div>
  );
}
