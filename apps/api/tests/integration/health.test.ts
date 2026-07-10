import { describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../../src/app";

describe("GET /api/v1/health", () => {
  it("returns 200 with a healthy status payload", async () => {
    const app = createApp();

    const res = await request(app).get("/api/v1/health");

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      status: "healthy",
      database: "not_configured",
      storage: "not_configured",
    });
    expect(res.body.version).toBeDefined();
    expect(res.body.timestamp).toBeDefined();
  });

  it("echoes a request ID header", async () => {
    const app = createApp();

    const res = await request(app).get("/api/v1/health");

    expect(res.headers["x-request-id"]).toBeDefined();
  });
});