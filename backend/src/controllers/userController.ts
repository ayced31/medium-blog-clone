import { Context } from "hono";
import { Env, Variables } from "../types";
import { PrismaClientType } from "../service/prismaService";
import { UpdateProfileInput, ChangePasswordInput } from "../validators/schemas";
import { hashPassword, verifyPassword } from "../service/authService";
import { NotFoundError, ValidationError } from "../middlewares/errorMiddleware";

export async function getUserProfile(
  c: Context<{ Bindings: Env; Variables: Variables }>,
  prisma: PrismaClientType
): Promise<Response> {
  try {
    const userId = c.get("userId");

    const user = await prisma.user.findUnique({
      where: { id: String(userId) },
      select: {
        id: true,
        name: true,
        email: true,
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return c.json(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        blogCount: user._count.posts,
      },
      200
    );
  } catch (error) {
    throw error;
  }
}

export async function updateUserProfile(
  c: Context<{ Bindings: Env; Variables: Variables }>,
  input: UpdateProfileInput,
  prisma: PrismaClientType
): Promise<Response> {
  try {
    const userId = c.get("userId");

    if (input.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser && existingUser.id !== userId) {
        throw new ValidationError("Email already in use");
      }
    }

    const updateData: any = {};
    if (input.name !== undefined) updateData.name = input.name;
    if (input.email !== undefined) updateData.email = input.email;

    const updatedUser = await prisma.user.update({
      where: { id: String(userId) },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    return c.json(
      {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        blogCount: updatedUser._count.posts,
      },
      200
    );
  } catch (error) {
    throw error;
  }
}

export async function changePassword(
  c: Context<{ Bindings: Env; Variables: Variables }>,
  input: ChangePasswordInput,
  prisma: PrismaClientType
): Promise<Response> {
  try {
    const userId = c.get("userId");

    const user = await prisma.user.findUnique({
      where: { id: String(userId) },
      select: { password: true },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const isCurrentPasswordValid = await verifyPassword(
      input.currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      throw new ValidationError("Current password is incorrect");
    }

    const hashedNewPassword = await hashPassword(input.newPassword);

    await prisma.user.update({
      where: { id: String(userId) },
      data: { password: hashedNewPassword },
    });

    return c.json({ message: "Password updated successfully" }, 200);
  } catch (error) {
    throw error;
  }
}

export async function getUserBlogs(
  c: Context<{ Bindings: Env; Variables: Variables }>,
  prisma: PrismaClientType
): Promise<Response> {
  try {
    const userId = c.get("userId");

    const blogs = await prisma.post.findMany({
      where: { authorId: String(userId) },
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    return c.json(
      {
        blogs,
        count: blogs.length,
      },
      200
    );
  } catch (error) {
    throw error;
  }
}

export async function deleteUserAccount(
  c: Context<{ Bindings: Env; Variables: Variables }>,
  prisma: PrismaClientType
): Promise<Response> {
  try {
    const userId = c.get("userId");

    await prisma.user.delete({
      where: { id: String(userId) },
    });

    return c.json({ message: "Account deleted successfully" }, 200);
  } catch (error) {
    throw error;
  }
}
