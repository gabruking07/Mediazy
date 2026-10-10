import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/server/auth/guards";
import { upsertBioPage } from "@/server/mediazy/productivity-service";
import { prisma } from "@/server/lib/prisma";

const schema = z.object({
  slug: z.string().min(3).max(40).regex(/^[a-zA-Z0-9_-]+$/),
  title: z.string().min(1),
  bio: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  theme: z.string().optional()
});

export async function GET() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const bioPage = await prisma.bioPage.findUnique({ where: { ownerId: user.id }, include: { links: { orderBy: { position: "asc" } } } });
  return NextResponse.json({ bioPage });
}

export async function PUT(request: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid bio page payload" }, { status: 400 });

  const bioPage = await upsertBioPage({ ownerId: user.id, ...parsed.data });
  return NextResponse.json({ bioPage });
}
