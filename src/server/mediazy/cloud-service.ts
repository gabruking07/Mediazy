import bcrypt from "bcryptjs";
import { prisma } from "@/server/lib/prisma";
import { addDays, createToken, serializeBigInt } from "@/server/mediazy/serialization";

export async function getStorageUsage(ownerId: string) {
  const activeFiles = await prisma.uploadedFile.findMany({
    where: { ownerId, status: "ACTIVE" },
    select: { sizeBytes: true }
  });

  return activeFiles.reduce((total, file) => total + serializeBigInt(file.sizeBytes), 0);
}

export async function listFiles(ownerId: string) {
  return prisma.uploadedFile.findMany({
    where: { ownerId, status: { not: "DELETED" } },
    include: { shareLinks: { orderBy: { createdAt: "desc" }, take: 3 } },
    orderBy: { createdAt: "desc" }
  });
}

export async function createFile(input: {
  ownerId: string;
  name: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  key?: string;
  password?: string;
  expiresInDays?: number;
}) {
  const passwordHash = input.password ? await bcrypt.hash(input.password, 10) : undefined;

  return prisma.uploadedFile.create({
    data: {
      ownerId: input.ownerId,
      name: input.name,
      key: input.key,
      url: input.url,
      mimeType: input.mimeType,
      sizeBytes: BigInt(input.sizeBytes),
      passwordHash,
      expiresAt: input.expiresInDays ? addDays(input.expiresInDays) : undefined
    }
  });
}

export async function createShareLink(input: {
  ownerId: string;
  fileId: string;
  password?: string;
  expiresInDays?: number;
  maxDownloads?: number;
}) {
  const passwordHash = input.password ? await bcrypt.hash(input.password, 10) : undefined;

  return prisma.shareLink.create({
    data: {
      ownerId: input.ownerId,
      fileId: input.fileId,
      token: createToken("s_"),
      access: passwordHash ? "PASSWORD" : "PUBLIC",
      passwordHash,
      expiresAt: input.expiresInDays ? addDays(input.expiresInDays) : undefined,
      maxDownloads: input.maxDownloads
    },
    include: { file: true }
  });
}

export async function getCloudDashboard(ownerId: string) {
  const [files, links, usage, analytics] = await Promise.all([
    listFiles(ownerId),
    prisma.shareLink.findMany({
      where: { ownerId },
      include: { file: true },
      orderBy: { createdAt: "desc" },
      take: 12
    }),
    getStorageUsage(ownerId),
    prisma.linkEvent.groupBy({
      by: ["type"],
      where: { ownerId },
      _count: { _all: true }
    })
  ]);

  return { files, links, usage, analytics };
}
