import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/server/auth/guards";
import { createShareLink } from "@/server/mediazy/cloud-service";
import { prisma } from "@/server/lib/prisma";
import { jsonReady } from "@/server/mediazy/serialization";

const shareSchema = z.object({
  fileId: z.string().min(1),
  password: z.string().min(6).optional(),
  expiresInDays: z.number().int().positive().max(365).optional(),
  maxDownloads: z.number().int().positive().max(100000).optional()
});

export async function GET() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const links = await prisma.shareLink.findMany({
    where: { ownerId: user.id },
    include: { file: true },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(jsonReady({ links }));
}

export async function POST(request: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = shareSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid share link payload" }, { status: 400 });

  const file = await prisma.uploadedFile.findFirst({ where: { id: parsed.data.fileId, ownerId: user.id, status: "ACTIVE" } });
  if (!file) return NextResponse.json({ error: "File not found" }, { status: 404 });

  const link = await createShareLink({ ownerId: user.id, ...parsed.data });
  return NextResponse.json(jsonReady({ link }), { status: 201 });
}
