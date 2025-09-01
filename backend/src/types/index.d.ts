import type { PrismaClient } from "@prisma/client/edge";
import type { Context } from "hono";

export interface Env {
  DATABASE_URL: string;
  JWT_SECRET: string;
}

export interface Variables {
  userId: string;
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

export interface SigninResponse {
  message: string;
  name: string;
  token: string;
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (c: Context) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

export interface RateLimitEntry {
  count: number;
  resetTime: number;
}

export interface ApiError extends Error {
  status?: number;
  code?: string;
}
