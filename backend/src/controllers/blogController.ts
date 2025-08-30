import { Context } from "hono";
import { Env, Variables } from "../types";
import { PrismaClientType } from "../service/prismaService";
import { CreateBlogInput, UpdateBlogInput } from "../validators/schemas";

export async function getBlog(
  c: Context<{ Bindings: Env; Variables: Variables }>,
  prisma: PrismaClientType
): Promise<Response> {
  try {
    const id = c.req.param("id");
    const userId = c.get("userId");

    const blog = await prisma.post.findUnique({
      where: { id },
      include: { author: { select: { id: true, name: true, email: true } } },
    });

    if (!blog) return c.json({ message: "Blog not found" }, 404);

    if (!blog.published && blog.authorId !== userId)
      return c.json({ message: "Blog not found" }, 404);

    return c.json(blog, 200);
  } catch (error) {
    console.error("Error fetching blog:", error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
}

export async function createBlog(
  c: Context<{ Bindings: Env; Variables: Variables }>,
  input: CreateBlogInput,
  prisma: PrismaClientType
): Promise<Response> {
  try {
    const userId = c.get("userId");

    const newBlog = await prisma.post.create({
      data: {
        title: input.title,
        content: input.content,
        published: input.published ?? false,
        tags: input.tags ?? [],
        authorId: String(userId),
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return c.json(newBlog, 201);
  } catch (error) {
    console.error("Error creating blog:", error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
}

export async function updateBlog(
  c: Context<{ Bindings: Env; Variables: Variables }>,
  input: UpdateBlogInput,
  prisma: PrismaClientType
): Promise<Response> {
  try {
    const id = c.req.param("id");
    const userId = c.get("userId");

    const existingBlog = await prisma.post.findUnique({
      where: { id },
      select: { id: true, authorId: true },
    });

    if (!existingBlog) {
      return c.json({ message: "Blog not found" }, 404);
    }

    if (existingBlog.authorId !== userId) {
      return c.json({ message: "Blog not found" }, 404);
    }

    const updateData: any = {};
    if (input.title !== undefined) updateData.title = input.title;
    if (input.content !== undefined) updateData.content = input.content;
    if (input.published !== undefined) updateData.published = input.published;
    if (input.tags !== undefined) updateData.tags = input.tags;

    const updatedBlog = await prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return c.json(updatedBlog, 200);
  } catch (error) {
    console.error("Error updating blog:", error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
}
