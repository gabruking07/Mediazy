"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DownloadButton, ResetButton } from "@/tools/shared/tool-panel";

type Props = {
  from: "image/jpeg" | "image/png";
  to: "image/jpeg" | "image/png";
  label: string;
};

export function ImageConverterTool({ from, to, label }: Props) {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const extension = to === "image/png" ? "png" : "jpg";

  async function convert(file: File) {
    const image = new Image();
    image.src = URL.createObjectURL(file);
    await image.decode();

    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d");
    if (!context) return;

    if (to === "image/jpeg") {
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
    context.drawImage(image, 0, 0);
    setDownloadUrl(canvas.toDataURL(to, 0.92));
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="image-file">{label}</Label>
        <Input
          id="image-file"
          type="file"
          accept={from}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void convert(file);
          }}
        />
      </div>
      <div className="flex gap-2">
        <DownloadButton href={downloadUrl} fileName={`mediazy-converted.${extension}`} />
        <ResetButton onClick={() => setDownloadUrl(null)} />
      </div>
    </div>
  );
}
