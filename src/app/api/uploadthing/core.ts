import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const uploadRouter = {
  mediaUploader: f({
    image: { maxFileSize: "8MB", maxFileCount: 4 },
    pdf: { maxFileSize: "16MB", maxFileCount: 4 }
  })
    .middleware(async () => ({ uploadedBy: "mediazy" }))
    .onUploadComplete(async ({ file }) => ({
      url: file.ufsUrl,
      name: file.name
    }))
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
