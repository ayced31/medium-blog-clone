import { Context } from "hono";
import { Env, Variables } from "../types";
import { PrismaClientType } from "../service/prismaService";
import { PaginationInput, AuthorBlogsInput } from "../validators/schemas";
import { NotFoundError } from "../middlewares/errorMiddleware";

export async function getPublicBlogs(
  c: Context<{ Bindings: Env; Variables: Variables }>,
  input: PaginationInput,
  prisma: PrismaClientType
): Promise<Response> {
  try {
    const { page, limit, tags, search, sortBy, sortOrder } = input;
    const skip = (page - 1) * limit;

    const whereClause: any = {
      published: true,
    };

    if (tags) {
      const tagArray = tags.split(",").map((tag) => tag.trim());
      whereClause.tags = {
        hasSome: tagArray,
      };
    }

    if (search) {
      whereClause.OR = [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    // Build order by clause
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    const [blogs, totalCount] = await Promise.all([
      prisma.post.findMany({
        where: whereClause,
        select: {
          id: true,
          title: true,
          content: true,
          tags: true,
          createdAt: true,
          updatedAt: true,
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.post.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return c.json(
      {
        blogs: blogs.map((blog) => ({
          ...blog,
          content:
            blog.content.substring(0, 300) +
            (blog.content.length > 300 ? "..." : ""), // Truncate content for list view
        })),
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage,
          hasPreviousPage,
          limit,
        },
        filters: {
          tags,
          search,
          sortBy,
          sortOrder,
        },
      },
      200
    );
  } catch (error) {
    throw error;
  }
}

export async function getPublicBlog(
  c: Context<{ Bindings: Env; Variables: Variables }>,
  prisma: PrismaClientType
): Promise<Response> {
  try {
    const id = c.req.param("id");

    const blog = await prisma.post.findUnique({
      where: {
        id,
        published: true,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!blog) {
      throw new NotFoundError("Blog not found");
    }

    return c.json(blog, 200);
  } catch (error) {
    throw error;
  }
}

export async function getAuthorPublicBlogs(
  c: Context<{ Bindings: Env; Variables: Variables }>,
  input: AuthorBlogsInput,
  prisma: PrismaClientType
): Promise<Response> {
  try {
    const { authorId } = input;

    const author = await prisma.user.findUnique({
      where: { id: authorId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!author) {
      throw new NotFoundError("Author not found");
    }

    const blogs = await prisma.post.findMany({
      where: {
        authorId,
        published: true,
      },
      select: {
        id: true,
        title: true,
        content: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return c.json(
      {
        author,
        blogs: blogs.map((blog) => ({
          ...blog,
          content:
            blog.content.substring(0, 300) +
            (blog.content.length > 300 ? "..." : ""),
        })),
        count: blogs.length,
      },
      200
    );
  } catch (error) {
    throw error;
  }
}

export async function getPopularTags(
  c: Context<{ Bindings: Env; Variables: Variables }>,
  prisma: PrismaClientType
): Promise<Response> {
  try {
    const blogs = await prisma.post.findMany({
      where: { published: true },
      select: { tags: true },
    });

    const tagCount: Record<string, number> = {};

    blogs.forEach((blog) => {
      blog.tags.forEach((tag) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });

    const popularTags = Object.entries(tagCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([tag, count]) => ({ tag, count }));

    return c.json(
      {
        tags: popularTags,
        totalUniqueTags: Object.keys(tagCount).length,
      },
      200
    );
  } catch (error) {
    throw error;
  }
}
