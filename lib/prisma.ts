// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

// Create a single instance of Prisma Client
const prismaClientSingleton = () => {
  return new PrismaClient();
};

// TypeScript declaration for global prisma instance
declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Use existing prisma instance or create new one
const prisma = globalThis.prisma ?? prismaClientSingleton();

// In development, store prisma instance globally to prevent multiple instances
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

export { prisma };