import { Hono } from "hono";
import { Env, Variables } from "./types";
import { corsMiddleware } from "./middlewares/corsMiddleware";
import { errorHandler } from "./middlewares/errorMiddleware";
import { checkDbConnection } from "./service/prismaService";
import { authRoutes } from "./routes/authRoutes";
import { blogRoutes } from "./routes/blogRoutes";
import { userRoutes } from "./routes/userRoutes";
import { publicRoutes } from "./routes/publicRoutes";
import { rateLimits } from "./middlewares/rateLimitMiddleware";

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

app.use("*", corsMiddleware);
app.use("*", errorHandler);

// Health check endpoint
app.all("/", rateLimits.public, async (c) => {
  const dbStatus = await checkDbConnection(c.env);
  if (!dbStatus.healthy) {
    return c.json(
      { message: "Database connection error", status: "unhealthy" },
      500
    );
  }
  return c.json({
    message: "Medium Blog API - Cloudflare Workers",
    status: "healthy",
  });
});

// Route modules
app.route("api/v1", authRoutes);
app.route("api/v1", blogRoutes);
app.route("api/v1", userRoutes);
app.route("api/v1", publicRoutes);

export default app;
