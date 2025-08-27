import { Hono } from "hono";

const app = new Hono();

app.post("/api/v1/signup", (c) => {});

app.post("/api/v1/sigin", (c) => {});

app.post("/api/v1/blog", (c) => {});

app.put("/api/v1/blog", (c) => {});

app.get("/api/v1/blog/:id", (c) => {});

export default app;
