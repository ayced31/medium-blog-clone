import { cors } from "hono/cors";

export const corsMiddleware = cors({
  origin: ["http://localhost:5174"],
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
});
