import { getServerSession } from "next-auth";
import { authOptions } from "@/server/lib/auth";
import { prisma } from "@/server/lib/prisma";

export async function requireUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  return prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      plan: true,
      storageLimitBytes: true,
      uploadLimitBytes: true
    }
  });
}

export async function requireAdmin() {
  const user = await requireUser();
  if (!user || user.role !== "ADMIN") return null;
  return user;
}
