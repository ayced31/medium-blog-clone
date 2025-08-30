import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import type { Env } from "../types";

export function createPrismaClient(env: Env) {
  const prisma = new PrismaClient({
    datasourceUrl: env.DATABASE_URL,
  }).$extends(withAccelerate());

  return prisma;
}

export async function checkDbConnection(env: Env) {
  const prisma = createPrismaClient(env);
  try {
    await prisma.$connect();
    await prisma.$disconnect();
    return { healthy: true };
  } catch (error) {
    return { healthy: false, error };
  }
}

export type PrismaClientType = ReturnType<typeof createPrismaClient>;
