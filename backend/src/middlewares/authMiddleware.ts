import { Context, Next } from "hono";
import { Env, Variables } from "../types";
import { verifyToken } from "../service/authService";

export async function authMiddleware(
  c: Context<{ Bindings: Env; Variables: Variables }>,
  next: Next
) {
  try {
    const authHeader = c.req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer "))
      return c.json({ message: "Unauthorized" }, 401);

    const token = authHeader.split(" ")[1];

    if (!token) return c.json({ message: "Unauthorized" }, 401);

    const payload = await verifyToken(token, c.env.JWT_SECRET);

    c.set("userId", payload.userId);

    await next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return c.json({ message: "Error while authorizing" }, 403);
  }
}
