import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/server/auth/guards";
import { createNote } from "@/server/mediazy/productivity-service";
import { prisma } from "@/server/lib/prisma";

const schema = z.object({
  title: z.string().min(1),
  content: z.string().default("")
});

export async function GET() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const notes = await prisma.note.findMany({ where: { ownerId: user.id, status: { not: "DELETED" } }, orderBy: { updatedAt: "desc" } });
  return NextResponse.json({ notes });
}

export async function POST(request: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid note payload" }, { status: 400 });

  const note = await createNote(user.id, parsed.data.title, parsed.data.content);
  return NextResponse.json({ note }, { status: 201 });
}
