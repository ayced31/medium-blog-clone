import { Hono } from "hono";
import { Env, Variables } from "../types";
import { zValidator } from "@hono/zod-validator";
import { signinSchema, signupSchema } from "../validators/schemas";
import { createPrismaClient } from "../service/prismaService";
import { signup, signin } from "../controllers/authController";
import { rateLimits } from "../middlewares/rateLimitMiddleware";

export const authRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

authRoutes.post(
  "/signup",
  rateLimits.auth,
  zValidator("json", signupSchema, (result, c) => {
    if (!result.success) {
      return c.json({ message: "Incorrect inputs" }, 411);
    }
  }),
  async (c) => {
    const input = c.req.valid("json");
    const prisma = createPrismaClient(c.env);
    return await signup(c, input, prisma);
  }
);

authRoutes.post(
  "/signin",
  rateLimits.auth,
  zValidator("json", signinSchema, (result, c) => {
    if (!result.success) {
      return c.json({ message: "Incorrect inputs" }, 411);
    }
  }),
  async (c) => {
    const input = c.req.valid("json");
    const prisma = createPrismaClient(c.env);
    return await signin(c, input, prisma);
  }
);
