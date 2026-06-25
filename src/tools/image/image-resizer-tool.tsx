"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DownloadButton, ResetButton } from "@/tools/shared/tool-panel";

export function ImageResizerTool() {
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState(1200);
  const [height, setHeight] = useState(800);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  async function resize() {
    if (!file) return;
    const image = new Image();
    image.src = URL.createObjectURL(file);
    await image.decode();

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.drawImage(image, 0, 0, width, height);
    setDownloadUrl(canvas.toDataURL("image/png"));
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2 sm:col-span-3">
          <Label htmlFor="resize-file">Image file</Label>
          <Input id="resize-file" type="file" accept="image/*" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="width">Width</Label>
          <Input id="width" type="number" min={1} value={width} onChange={(event) => setWidth(Number(event.target.value))} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="height">Height</Label>
          <Input id="height" type="number" min={1} value={height} onChange={(event) => setHeight(Number(event.target.value))} />
        </div>
        <div className="flex items-end">
          <Button type="button" className="w-full" onClick={resize}>
            Resize
          </Button>
        </div>
      </div>
      <div className="flex gap-2">
        <DownloadButton href={downloadUrl} fileName="mediazy-resized.png" />
        <ResetButton onClick={() => setDownloadUrl(null)} />
      </div>
    </div>
  );
}
