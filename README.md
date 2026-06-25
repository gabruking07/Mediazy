# Mediazy — Built by Aurex Technologies

Mediazy is a modern SaaS web application for fast PDF, image, developer, text, and utility tools.

Mediazy is created and owned by Aurex Technologies.

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style components
- Framer Motion
- Prisma and MongoDB Atlas
- NextAuth
- UploadThing
- Zustand
- React Hook Form
- Zod

## Project Structure

- `src/app` - Next.js App Router pages and API route entrypoints
- `src/client` - UI components, client state, and browser tool modules
- `src/server` - Auth, Prisma, and email/server-only code
- `src/shared` - Brand constants, shared utilities, and tool metadata
- `prisma` - MongoDB Atlas Prisma schema

## Getting Started

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:push
npm run dev
```

Set `DATABASE_URL`, `NEXTAUTH_SECRET`, Google OAuth values, and UploadThing credentials before deploying.

Environment files are split by responsibility:

- `src/server/.env.example` - server-only secrets such as database, auth, Google OAuth, and UploadThing.
- `src/client/.env.example` - public browser-safe values. Only put `NEXT_PUBLIC_*` variables here.
- `.env.example` - combined local template for Next.js local development.

For local development, copy the combined file:

```bash
cp .env.example .env
```

For Vercel and Render, add the same values in the platform Environment Variables UI.

For MongoDB Atlas, `DATABASE_URL` should look like:

```bash
mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/mediazy?retryWrites=true&w=majority
```

## Deployment

### Vercel

Import `https://github.com/gabruking07/Mediazy` in Vercel and set:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `NEXT_PUBLIC_APP_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `UPLOADTHING_TOKEN`

Build command: `npm run build`

### Render

Create a normal Web Service connected to `https://github.com/gabruking07/Mediazy`.

Use these settings:

- Runtime: `Node`
- Build command: `npm install && npm run build`
- Start command: `npm run start`
- Root directory: leave empty

Set the same environment variables listed above. For Render, `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` should use the Render service URL or your custom domain.
