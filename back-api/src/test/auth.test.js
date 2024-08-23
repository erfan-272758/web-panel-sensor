import request from "supertest";
import app from "../app"; // Assuming your Express app is in app.js
import { getEnv } from "../config";

describe("Auth", () => {
  it("POST /api/v1/auth/login should return status code 200 and admin token => login with user-pass", async () => {
    const username = getEnv("admin-user");
    const password = getEnv("admin-pass");

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ username, password });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("data.token");
  });
  it("POST /api/v1/auth/login wrong password should return status code 401 => wrong login with user-pass", async () => {
    const username = getEnv("admin-user");
    const password = getEnv("admin-pass");

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ username, password: password + "-wrong" });

    expect(res.status).toEqual(401);
    expect(res.body).not.toHaveProperty("data");
    expect(res.body).not.toHaveProperty("data.token");
    expect(res.body).toHaveProperty("message");
  });
  it("GET /api/v1/auth/login should return status code 200 => login with token", async () => {
    const token = getEnv("admin-token");

    const res = await request(app)
      .get("/api/v1/auth/login")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("data.token");
  });
});
