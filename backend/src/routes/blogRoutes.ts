import { Hono } from "hono";
import { Env, Variables } from "../types";
import { authMiddleware } from "../middlewares/authMiddleware";
import { zValidator } from "@hono/zod-validator";
import {
  getBlogSchema,
  createBlogSchema,
  updateBlogSchema,
} from "../validators/schemas";
import { getBlog, createBlog, updateBlog } from "../controllers/blogController";
import { createPrismaClient } from "../service/prismaService";

export const blogRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

blogRoutes.use("*", authMiddleware);

blogRoutes.get(
  "/blog/:id",
  zValidator("param", getBlogSchema, (result, c) => {
    if (!result.success) return c.json({ message: "Invalid blog ID" }, 411);
  }),
  async (c) => {
    const prisma = createPrismaClient(c.env);
    return await getBlog(c, prisma);
  }
);

blogRoutes.post(
  "/blog",
  zValidator("json", createBlogSchema, (result, c) => {
    if (!result.success) {
      return c.json({ message: "Incorrect inputs" }, 411);
    }
  }),
  async (c) => {
    const prisma = createPrismaClient(c.env);
    const input = c.req.valid("json");
    return await createBlog(c, input, prisma);
  }
);

blogRoutes.put(
  "/blog/:id",
  zValidator("json", updateBlogSchema, (result, c) => {
    if (!result.success) {
      return c.json({ message: "Incorrect inputs" }, 411);
    }
  }),
  async (c) => {
    const prisma = createPrismaClient(c.env);
    const input = c.req.valid("json");
    return await updateBlog(c, input, prisma);
  }
);
