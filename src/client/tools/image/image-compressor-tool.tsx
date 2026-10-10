"use client";

import { useState } from "react";
import { Input } from "@/client/components/ui/input";
import { Label } from "@/client/components/ui/label";
import { DownloadButton, ResetButton } from "@/client/tools/shared/tool-panel";

export function ImageCompressorTool() {
  const [quality, setQuality] = useState(0.72);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [stats, setStats] = useState("");

  async function compress(file: File) {
    const image = new Image();
    image.src = URL.createObjectURL(file);
    await image.decode();

    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.drawImage(image, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        setDownloadUrl(URL.createObjectURL(blob));
        const saved = Math.max(0, Math.round((1 - blob.size / file.size) * 100));
        setStats(`${(file.size / 1024).toFixed(1)} KB to ${(blob.size / 1024).toFixed(1)} KB, ${saved}% smaller`);
      },
      "image/jpeg",
      quality
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-[1fr_220px]">
        <div className="space-y-2">
          <Label htmlFor="compress-file">Image file</Label>
          <Input
            id="compress-file"
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void compress(file);
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="quality">Quality {Math.round(quality * 100)}%</Label>
          <Input
            id="quality"
            type="range"
            min="0.3"
            max="0.95"
            step="0.05"
            value={quality}
            onChange={(event) => setQuality(Number(event.target.value))}
          />
        </div>
      </div>
      {stats ? <p className="text-sm text-muted-foreground">{stats}</p> : null}
      <div className="flex gap-2">
        <DownloadButton href={downloadUrl} fileName="mediazy-compressed.jpg" />
        <ResetButton onClick={() => setDownloadUrl(null)} />
      </div>
    </div>
  );
}
