"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { Input } from "@/client/components/ui/input";
import { Label } from "@/client/components/ui/label";
import { DownloadButton } from "@/client/tools/shared/tool-panel";

export function QrGeneratorTool() {
  const [value, setValue] = useState("https://mediazy.xyz");
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    void QRCode.toDataURL(value || "https://mediazy.xyz", { width: 640, margin: 2 }).then(setUrl);
  }, [value]);

  return (
    <div className="grid gap-5 md:grid-cols-[1fr_240px]">
      <div className="space-y-2">
        <Label htmlFor="qr-value">URL or text</Label>
        <Input id="qr-value" value={value} onChange={(event) => setValue(event.target.value)} />
        <DownloadButton href={url} fileName="mediazy-qr.png" />
      </div>
      <div className="flex aspect-square items-center justify-center rounded-md border border-border bg-white p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {url ? <img src={url} alt="Generated QR code" className="size-full" /> : null}
      </div>
    </div>
  );
}
