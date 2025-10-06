import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Manejar la desconexión adecuadamente
let isDisconnecting = false;

const gracefulShutdown = async () => {
  if (isDisconnecting) return;
  isDisconnecting = true;

  try {
    await prisma.$disconnect();
    console.log('Prisma disconnected successfully');
  } catch (error) {
    console.error('Error disconnecting Prisma:', error);
  } finally {
    isDisconnecting = false;
  }
};

if (process.env.NODE_ENV === 'development') {
  process.on('SIGINT', gracefulShutdown);
  process.on('SIGTERM', gracefulShutdown);
  process.on('beforeExit', gracefulShutdown);
}

export default prisma;
