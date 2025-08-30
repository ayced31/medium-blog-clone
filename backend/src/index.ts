import { Hono } from "hono";
import { Env, Variables } from "./types";
import { corsMiddleware } from "./middlewares/corsMiddleware";
import { checkDbConnection } from "./service/prismaService";
import { authRoutes } from "./routes/authRoutes";
import { blogRoutes } from "./routes/blogRoutes";

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

app.use("*", corsMiddleware);

app.all("/", async (c) => {
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

app.route("api/v1", authRoutes);
app.route("api/v1", blogRoutes);

export default app;
