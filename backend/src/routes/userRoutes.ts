import { Hono } from "hono";
import { Env, Variables } from "../types";
import { authMiddleware } from "../middlewares/authMiddleware";
import { zValidator } from "@hono/zod-validator";
import {
  updateProfileSchema,
  changePasswordSchema,
} from "../validators/schemas";
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  getUserBlogs,
  deleteUserAccount,
} from "../controllers/userController";
import { createPrismaClient } from "../service/prismaService";

export const userRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

userRoutes.use("*", authMiddleware);

userRoutes.get("/user/profile", async (c) => {
  const prisma = createPrismaClient(c.env);
  return await getUserProfile(c, prisma);
});

userRoutes.put(
  "/user/profile",
  zValidator("json", updateProfileSchema, (result, c) => {
    if (!result.success) {
      return c.json({ message: "Invalid input data" }, 400);
    }
  }),
  async (c) => {
    const prisma = createPrismaClient(c.env);
    const input = c.req.valid("json");
    return await updateUserProfile(c, input, prisma);
  }
);

userRoutes.put(
  "/user/password",
  zValidator("json", changePasswordSchema, (result, c) => {
    if (!result.success) {
      return c.json({ message: "Invalid password data" }, 400);
    }
  }),
  async (c) => {
    const prisma = createPrismaClient(c.env);
    const input = c.req.valid("json");
    return await changePassword(c, input, prisma);
  }
);

userRoutes.get("/user/blogs", async (c) => {
  const prisma = createPrismaClient(c.env);
  return await getUserBlogs(c, prisma);
});

userRoutes.delete("/user/account", async (c) => {
  const prisma = createPrismaClient(c.env);
  return await deleteUserAccount(c, prisma);
});
