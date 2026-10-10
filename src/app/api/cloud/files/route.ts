import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/server/auth/guards";
import { createFile, listFiles } from "@/server/mediazy/cloud-service";
import { jsonReady } from "@/server/mediazy/serialization";

const fileSchema = z.object({
  name: z.string().min(1),
  url: z.string().url(),
  mimeType: z.string().min(1),
  sizeBytes: z.number().int().positive(),
  key: z.string().optional(),
  password: z.string().min(6).optional(),
  expiresInDays: z.number().int().positive().max(365).optional()
});

export async function GET() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const files = await listFiles(user.id);
  return NextResponse.json(jsonReady({ files }));
}

export async function POST(request: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = fileSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid file payload" }, { status: 400 });
  if (parsed.data.sizeBytes > Number(user.uploadLimitBytes)) {
    return NextResponse.json({ error: "File exceeds your current upload limit" }, { status: 403 });
  }

  const file = await createFile({ ownerId: user.id, ...parsed.data });
  return NextResponse.json(jsonReady({ file }), { status: 201 });
}
