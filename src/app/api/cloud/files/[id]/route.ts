import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/server/auth/guards";
import { prisma } from "@/server/lib/prisma";
import { addDays, jsonReady } from "@/server/mediazy/serialization";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  expiresInDays: z.number().int().positive().max(365).nullable().optional(),
  status: z.enum(["ACTIVE", "EXPIRED", "FLAGGED", "DELETED"]).optional()
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid file update" }, { status: 400 });

  const file = await prisma.uploadedFile.updateMany({
    where: { id, ownerId: user.id },
    data: {
      name: parsed.data.name,
      status: parsed.data.status,
      expiresAt: parsed.data.expiresInDays === undefined ? undefined : parsed.data.expiresInDays === null ? null : addDays(parsed.data.expiresInDays)
    }
  });

  return NextResponse.json({ updated: file.count });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const file = await prisma.uploadedFile.updateMany({
    where: { id, ownerId: user.id },
    data: { status: "DELETED" }
  });

  return NextResponse.json(jsonReady({ deleted: file.count }));
}
