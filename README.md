# Mediazy — Built by Aurex Technologies

Mediazy is a modern SaaS web application for fast PDF, image, developer, text, and utility tools.

Mediazy is created and owned by Aurex Technologies.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style components
- Framer Motion
- Prisma and PostgreSQL
- NextAuth
- UploadThing
- Zustand
- React Hook Form
- Zod

## Getting Started

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run dev
```

Set `DATABASE_URL`, `NEXTAUTH_SECRET`, Google OAuth values, and UploadThing credentials before deploying.

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

Create a Blueprint from `render.yaml` or a Web Service connected to the same repository.

Build command: `npm install && npm run build`

Start command: `npm run start`

Set the same environment variables listed above. For Render, `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` should use the Render service URL or your custom domain.
