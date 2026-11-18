import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Enable query logging in development or if explicitly requested in production for profiling
const logLevels: any = process.env.NODE_ENV === "development" || process.env.LOG_PRISMA_QUERIES === "true" 
  ? ['query', 'warn', 'error'] 
  : ['warn', 'error'];

export const prisma =
  globalForPrisma.prisma ??
  // The connection string comes from DATABASE_URL via prisma/schema.prisma.
  // Prisma connects lazily on the first query, so builds work without a database.
  new PrismaClient({
    log: logLevels,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
