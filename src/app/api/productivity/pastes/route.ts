import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/server/auth/guards";
import { createPaste } from "@/server/mediazy/productivity-service";
import { prisma } from "@/server/lib/prisma";

const schema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  language: z.string().optional(),
  visibility: z.enum(["private", "unlisted", "public"]).optional(),
  expiresInDays: z.number().int().positive().max(365).optional()
});

export async function GET() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const pastes = await prisma.paste.findMany({ where: { ownerId: user.id, status: { not: "DELETED" } }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ pastes });
}

export async function POST(request: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid paste payload" }, { status: 400 });

  const paste = await createPaste({ ownerId: user.id, ...parsed.data });
  return NextResponse.json({ paste }, { status: 201 });
}
