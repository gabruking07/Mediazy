import { getServerSession } from "next-auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { authOptions } from "@/server/lib/auth";
import { createFile } from "@/server/mediazy/cloud-service";

const f = createUploadthing();

export const uploadRouter = {
  mediaUploader: f({
    image: { maxFileSize: "8MB", maxFileCount: 4 },
    pdf: { maxFileSize: "16MB", maxFileCount: 4 }
  })
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) throw new UploadThingError("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ file, metadata }) => {
      const uploadedFile = await createFile({
        ownerId: metadata.userId,
        name: file.name,
        key: file.key,
        url: file.ufsUrl,
        mimeType: file.type || "application/octet-stream",
        sizeBytes: file.size
      });

      return {
        id: uploadedFile.id,
        url: file.ufsUrl,
        name: file.name
      };
    })
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
