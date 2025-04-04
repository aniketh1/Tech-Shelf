import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
};

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    },
    log: ['error', 'warn']
  }).$extends({
    query: {
      $allOperations({ operation, model, args, query }) {
        return query(args).catch((error) => {
          console.error(`Database operation failed: ${operation} on ${model}`, error);
          throw error;
        });
      }
    }
  });
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;