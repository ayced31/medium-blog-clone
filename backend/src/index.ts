import { Hono } from "hono";
import { Env, Variables } from "./types";
import { corsMiddleware } from "./middlewares/corsMiddleware";
import { authRoutes } from "./routes/authRoutes";
import { blogRoutes } from "./routes/blogRoutes";

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

app.use("*", corsMiddleware);

app.all("/", (c) => {
  return c.json({
    message: "Medium Blog API - Cloudflare Worker",
    status: "heathy",
  });
});

app.route("api/v1", authRoutes);
app.route("api/v1", blogRoutes);

export default app;
