"use client";

import { PDFDocument } from "pdf-lib";
import { useState } from "react";
import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import { Label } from "@/client/components/ui/label";
import { DownloadButton, ResetButton } from "@/client/tools/shared/tool-panel";

type Mode = "merge" | "split" | "compress";

export function PdfUtilityTool({ mode }: { mode: Mode }) {
  const [files, setFiles] = useState<FileList | null>(null);
  const [range, setRange] = useState("1-3");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  async function run() {
    if (!files?.length) return;

    if (mode === "merge") {
      const output = await PDFDocument.create();
      for (const file of Array.from(files)) {
        const source = await PDFDocument.load(await file.arrayBuffer());
        const copied = await output.copyPages(source, source.getPageIndices());
        copied.forEach((page) => output.addPage(page));
      }
      const bytes = await output.save({ useObjectStreams: true });
      setDownloadUrl(URL.createObjectURL(createPdfBlob(bytes)));
      return;
    }

    const source = await PDFDocument.load(await files[0].arrayBuffer());
    const output = await PDFDocument.create();
    const indices =
      mode === "split"
        ? parseRange(range, source.getPageCount())
        : source.getPageIndices();
    const copied = await output.copyPages(source, indices);
    copied.forEach((page) => output.addPage(page));
    const bytes = await output.save({ useObjectStreams: true, addDefaultPage: false });
    setDownloadUrl(URL.createObjectURL(createPdfBlob(bytes)));
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="pdf-file">PDF file{mode === "merge" ? "s" : ""}</Label>
        <Input
          id="pdf-file"
          type="file"
          accept="application/pdf"
          multiple={mode === "merge"}
          onChange={(event) => setFiles(event.target.files)}
        />
      </div>
      {mode === "split" ? (
        <div className="space-y-2">
          <Label htmlFor="range">Page range</Label>
          <Input id="range" value={range} onChange={(event) => setRange(event.target.value)} placeholder="1-3,5" />
        </div>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={run}>
          {mode === "merge" ? "Merge PDFs" : mode === "split" ? "Split PDF" : "Compress PDF"}
        </Button>
        <DownloadButton href={downloadUrl} fileName={`mediazy-${mode}.pdf`} />
        <ResetButton onClick={() => setDownloadUrl(null)} />
      </div>
    </div>
  );
}

function parseRange(value: string, pageCount: number) {
  const indices = new Set<number>();
  value.split(",").forEach((part) => {
    const [startRaw, endRaw] = part.trim().split("-");
    const start = Number(startRaw);
    const end = endRaw ? Number(endRaw) : start;
    if (!Number.isFinite(start) || !Number.isFinite(end)) return;
    for (let page = start; page <= end; page += 1) {
      if (page >= 1 && page <= pageCount) indices.add(page - 1);
    }
  });
  return [...indices];
}

function createPdfBlob(bytes: Uint8Array) {
  const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
  return new Blob([buffer], { type: "application/pdf" });
}
