import { prisma } from "@/server/lib/prisma";
import { addDays, createToken } from "@/server/mediazy/serialization";

export async function createShortLink(ownerId: string, destination: string, title?: string, slug?: string) {
  return prisma.shortLink.create({
    data: {
      ownerId,
      destination,
      title,
      slug: slug || createToken("m_").toLowerCase()
    }
  });
}

export async function createNote(ownerId: string, title: string, content: string) {
  return prisma.note.create({ data: { ownerId, title, content } });
}

export async function createPaste(input: {
  ownerId: string;
  title: string;
  content: string;
  language?: string;
  visibility?: string;
  expiresInDays?: number;
}) {
  return prisma.paste.create({
    data: {
      ownerId: input.ownerId,
      title: input.title,
      content: input.content,
      language: input.language,
      visibility: input.visibility ?? "private",
      slug: createToken("p_").toLowerCase(),
      expiresAt: input.expiresInDays ? addDays(input.expiresInDays) : undefined
    }
  });
}

export async function upsertBioPage(input: {
  ownerId: string;
  slug: string;
  title: string;
  bio?: string;
  avatarUrl?: string;
  theme?: string;
}) {
  return prisma.bioPage.upsert({
    where: { ownerId: input.ownerId },
    update: {
      slug: input.slug,
      title: input.title,
      bio: input.bio,
      avatarUrl: input.avatarUrl,
      theme: input.theme ?? "mediazy"
    },
    create: {
      ownerId: input.ownerId,
      slug: input.slug,
      title: input.title,
      bio: input.bio,
      avatarUrl: input.avatarUrl,
      theme: input.theme ?? "mediazy"
    },
    include: { links: { orderBy: { position: "asc" } } }
  });
}

export async function getProductivityDashboard(ownerId: string) {
  const [shortLinks, notes, pastes, bioPage] = await Promise.all([
    prisma.shortLink.findMany({ where: { ownerId }, orderBy: { createdAt: "desc" }, take: 12 }),
    prisma.note.findMany({ where: { ownerId, status: { not: "DELETED" } }, orderBy: { updatedAt: "desc" }, take: 12 }),
    prisma.paste.findMany({ where: { ownerId, status: { not: "DELETED" } }, orderBy: { createdAt: "desc" }, take: 12 }),
    prisma.bioPage.findUnique({ where: { ownerId }, include: { links: { orderBy: { position: "asc" } } } })
  ]);

  return { shortLinks, notes, pastes, bioPage };
}
