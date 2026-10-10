"use client";

import { useMemo, useState } from "react";
import { Textarea } from "@/client/components/ui/textarea";

export function JwtDecoderTool() {
  const [token, setToken] = useState("");
  const decoded = useMemo(() => decodeJwt(token), [token]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Textarea
        value={token}
        onChange={(event) => setToken(event.target.value)}
        placeholder="Paste JWT token"
        className="min-h-72 font-mono"
      />
      <pre className="min-h-72 overflow-auto rounded-md border border-border bg-muted p-4 text-xs">
        {decoded}
      </pre>
    </div>
  );
}

function decodeJwt(token: string) {
  const [header, payload] = token.split(".");
  if (!header || !payload) return "Paste a JWT to decode its header and payload.";

  try {
    return JSON.stringify(
      {
        header: JSON.parse(atob(normalize(header))),
        payload: JSON.parse(atob(normalize(payload)))
      },
      null,
      2
    );
  } catch {
    return "Invalid JWT.";
  }
}

function normalize(value: string) {
  return value.replace(/-/g, "+").replace(/_/g, "/");
}
