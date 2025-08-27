import { Hono } from "hono";

const app = new Hono();

app.post("/api/v1/signup", (c) => {
  return c.text("signup route");
});

app.post("/api/v1/sigin", (c) => {
  return c.text("signin route");
});

app.get("/api/v1/blog/:id", (c) => {
  const id = c.req.param("id");
  console.log(id);
  return c.text("get blog route");
});

app.post("/api/v1/blog", (c) => {
  return c.text("blog post route");
});

app.put("/api/v1/blog", (c) => {
  return c.text("blog update route");
});

export default app;
