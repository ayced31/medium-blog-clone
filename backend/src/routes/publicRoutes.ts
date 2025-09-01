import { Hono } from "hono";
import { Env, Variables } from "../types";
import { zValidator } from "@hono/zod-validator";
import {
  paginationSchema,
  authorBlogsSchema,
  getBlogSchema,
} from "../validators/schemas";
import {
  getPublicBlogs,
  getPublicBlog,
  getAuthorPublicBlogs,
  getPopularTags,
} from "../controllers/publicController";
import { createPrismaClient } from "../service/prismaService";
import { rateLimits } from "../middlewares/rateLimitMiddleware";

export const publicRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

publicRoutes.get(
  "/public/blogs",
  rateLimits.public,
  zValidator("query", paginationSchema, (result, c) => {
    if (!result.success) {
      return c.json({ message: "Invalid query parameters" }, 400);
    }
  }),
  async (c) => {
    const prisma = createPrismaClient(c.env);
    const input = c.req.valid("query");
    return await getPublicBlogs(c, input, prisma);
  }
);

publicRoutes.get(
  "/public/blog/:id",
  rateLimits.public,
  zValidator("param", getBlogSchema, (result, c) => {
    if (!result.success) {
      return c.json({ message: "Invalid blog ID" }, 400);
    }
  }),
  async (c) => {
    const prisma = createPrismaClient(c.env);
    return await getPublicBlog(c, prisma);
  }
);

publicRoutes.get(
  "/public/author/:authorId/blogs",
  rateLimits.public,
  zValidator("param", authorBlogsSchema, (result, c) => {
    if (!result.success) {
      return c.json({ message: "Invalid author ID" }, 400);
    }
  }),
  async (c) => {
    const prisma = createPrismaClient(c.env);
    const input = { authorId: c.req.param("authorId") };
    return await getAuthorPublicBlogs(c, input, prisma);
  }
);

publicRoutes.get("/public/tags", rateLimits.public, async (c) => {
  const prisma = createPrismaClient(c.env);
  return await getPopularTags(c, prisma);
});
