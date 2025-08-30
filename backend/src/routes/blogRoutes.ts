import { Hono } from "hono";
import { Env, Variables } from "../types";
import { authMiddleware } from "../middlewares/authMiddleware";
import { zValidator } from "@hono/zod-validator";
import { createBlogSchema, updateBlogSchema } from "../validators/schemas";
import { getBlog, createBlog, updateBlog } from "../controllers/blogController";

export const blogRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

blogRoutes.use("*", authMiddleware);

blogRoutes.get("/blog/:id", getBlog);

blogRoutes.post(
  "/blog",
  zValidator("json", createBlogSchema, (result, c) => {
    if (!result.success) {
      return c.json({ message: "Incorrect inputs" }, 411);
    }
  }),
  createBlog
);

blogRoutes.put(
  "/blog/:id",
  zValidator("json", updateBlogSchema, (result, c) => {
    if (!result.success) {
      return c.json({ message: "Incorrect inputs" }, 411);
    }
  }),
  updateBlog
);
