import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth/guards";
import { prisma } from "@/server/lib/prisma";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const [users, files, flaggedFiles, reports, links] = await Promise.all([
    prisma.user.count(),
    prisma.uploadedFile.count({ where: { status: { not: "DELETED" } } }),
    prisma.uploadedFile.count({ where: { status: "FLAGGED" } }),
    prisma.linkEvent.count({ where: { type: "REPORT" } }),
    prisma.shareLink.count()
  ]);

  return NextResponse.json({ users, files, flaggedFiles, reports, links });
}
