import type { PrismaClient } from "@prisma/client/edge";

export interface Env {
  DATABASE_URL: string;
  JWT_SECRET: string;
}

export interface Variables {
  userId: String;
  prisma: PrismaClient;
}

export interface JWTPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

export interface SignupResponse {
  message: string;
  token: string;
}
