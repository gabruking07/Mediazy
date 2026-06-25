"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function Base64Tool() {
  const [value, setValue] = useState("Mediazy by Aurex Technologies");

  function encode() {
    setValue(btoa(unescape(encodeURIComponent(value))));
  }

  function decode() {
    try {
      setValue(decodeURIComponent(escape(atob(value))));
    } catch {
      setValue("Invalid Base64 input");
    }
  }

  return (
    <div className="space-y-4">
      <Textarea value={value} onChange={(event) => setValue(event.target.value)} className="min-h-56 font-mono" />
      <div className="flex gap-2">
        <Button type="button" onClick={encode}>
          Encode
        </Button>
        <Button type="button" variant="outline" onClick={decode}>
          Decode
        </Button>
      </div>
    </div>
  );
}
