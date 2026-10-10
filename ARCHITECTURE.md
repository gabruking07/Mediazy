# Mediazy Architecture

Mediazy uses a disciplined Next.js App Router structure with clear client, server, and shared domains.

## Folders

- `src/app` - Next.js routing, pages, layouts, metadata, API route entrypoints.
- `src/client` - Browser UI, client components, Zustand state, and interactive tool modules.
- `src/server` - Server-only auth, Prisma database access, and email templates.
- `src/shared` - Brand constants, utilities, and tool registry metadata shared by pages.
- `prisma` - Prisma schema for MongoDB Atlas.
- `.agents` - Local automation/agent workspace marker.
- `.vscode` - Workspace presentation settings that hide generated build folders and logs.

## Deployment

Vercel and Render both build from the repository root. The app keeps Next.js routing in `src/app` because App Router requires that convention, while the application code around it is split into client/server/shared domains.