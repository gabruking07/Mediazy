import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/server/auth/guards";
import { createShortLink } from "@/server/mediazy/productivity-service";
import { prisma } from "@/server/lib/prisma";

const schema = z.object({
  destination: z.string().url(),
  title: z.string().optional(),
  slug: z.string().min(3).max(40).regex(/^[a-zA-Z0-9_-]+$/).optional()
});

export async function GET() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const links = await prisma.shortLink.findMany({ where: { ownerId: user.id }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ links });
}

export async function POST(request: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid short link payload" }, { status: 400 });

  const link = await createShortLink(user.id, parsed.data.destination, parsed.data.title, parsed.data.slug);
  return NextResponse.json({ link }, { status: 201 });
}
