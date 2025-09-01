import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(4, "First name must be at least 4 characters"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signinSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const getBlogSchema = z.object({
  id: z.uuid("Invalid blog ID"),
});

export const createBlogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  published: z.boolean().optional().default(false),
  tags: z.array(z.string()).optional().default([]),
});

export const updateBlogSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  content: z.string().min(1, "Content is required").optional(),
  published: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.email("Invalid email address").optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .default("1")
    .transform((val) => Math.max(1, parseInt(val, 10))),
  limit: z
    .string()
    .optional()
    .default("10")
    .transform((val) => Math.min(50, Math.max(1, parseInt(val, 10)))),
  tags: z.string().optional(),
  search: z.string().optional(),
  sortBy: z
    .enum(["createdAt", "updatedAt", "title"])
    .optional()
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export const authorBlogsSchema = z.object({
  authorId: z.uuid("Invalid author ID"),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type SigninInput = z.infer<typeof signinSchema>;
export type GetBlogInput = z.infer<typeof getBlogSchema>;
export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type AuthorBlogsInput = z.infer<typeof authorBlogsSchema>;
