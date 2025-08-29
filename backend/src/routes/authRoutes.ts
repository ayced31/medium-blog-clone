import { Hono } from "hono";
import { Env, Variables } from "../types";
import { zValidator } from "@hono/zod-validator";
import { signupSchema } from "../validators/schemas";
import { createPrismaClient } from "../service/prismaService";
import { signup } from "../controllers/authController";

export const authRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

authRoutes.post(
  "/signup",
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

// authRoutes.post("/signin", signin);
