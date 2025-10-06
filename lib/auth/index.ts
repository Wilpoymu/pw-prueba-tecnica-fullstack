import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '@prisma/client';

// En producción (Vercel) usar DATABASE_URL (pooler port 6543)
// En desarrollo local usar DIRECT_URL (direct port 5432)
const prisma = new PrismaClient({
  datasourceUrl: process.env.NODE_ENV === 'production' 
    ? process.env.DATABASE_URL 
    : process.env.DIRECT_URL,
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: true,
        defaultValue: 'ADMIN',
        returned: true,
      },
    },
  },
});
