This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Authentication

This project uses [better-auth](https://www.better-auth.com/) for authentication with Prisma as the database adapter. The following environment variables are required:

- `BETTER_AUTH_SECRET` - A random string used to sign cookies and JWTs
- `BETTER_AUTH_URL` - The base URL of your application (e.g., https://ojasenhealingarts.com)
- `NEXT_PUBLIC_APP_URL` - The public URL of your application (e.g., https://ojasenhealingarts.com)
- `DATABASE_URL` - The URL to your PostgreSQL database (e.g., postgresql://user:password@host:port/database)

For production, you can use a `.env` file with the following content:

```
BETTER_AUTH_SECRET=your-super-secret-key-change-this-in-production
BETTER_AUTH_URL=https://ojasenhealingarts.com
NEXT_PUBLIC_APP_URL=https://ojasenhealingarts.com
DATABASE_URL=postgresql://neondb_owner:npg_i7sIUaB4LReT@ep-young-bar-a179rbv0-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

## Database Persistence

This project now uses PostgreSQL with Prisma ORM for full database persistence of all business data including:

- User authentication data (users, sessions, accounts)
- Bookings and booking history
- Facilitator information and earnings

All data is persisted in the database rather than using in-memory storage, making it suitable for production use.

## Prisma Setup

This project uses Prisma as the database ORM. To set up the database:

1. Make sure you have the required environment variables set up
2. Run `npx prisma generate` to generate the Prisma client
3. Run `npx prisma migrate dev` to create the database and tables
4. Run `npx tsx scripts/seed.ts` to populate initial facilitator data

For production, you should use proper migrations instead of `db push`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
