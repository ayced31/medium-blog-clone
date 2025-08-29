import { Hono } from "hono";
import { Env, Variables } from "../types";
// import { 
//   getBlogController, 
//   createBlogController, 
//   updateBlogController 
// } from "../controllers/blogController";

export const blogRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

// blogRoutes.get("/blog/:id", getBlogController);
// blogRoutes.post("/blog", createBlogController);
// blogRoutes.put("/blog/:id", updateBlogController); 
