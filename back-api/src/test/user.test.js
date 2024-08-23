import request from "supertest";
import app from "../app"; // Assuming your Express app is in app.js
import { getEnv } from "../config";

let userTestId = "";

describe("User", () => {
  it("GET /api/v1/user should return status code 401 => get all users without authentication", async () => {
    const res = await request(app).get("/api/v1/user");

    expect(res.status).toEqual(401);
    expect(res.body).toHaveProperty("message");
  });

  it("GET /api/v1/user should return status code 200 => get all users", async () => {
    const token = getEnv("admin-token");

    const res = await request(app)
      .get("/api/v1/user")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("data");
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("POST /api/v1/user should return status code 201 => create one user", async () => {
    const token = getEnv("admin-token");

    const res = await request(app)
      .post("/api/v1/user")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "test",
        username: `test-${Date.now()}`,
        password: "test",
      });
    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty("data");
    userTestId = res.body.data.id;
  });

  it("GET /api/v1/user/:id should return status code 200 => get one user", async () => {
    const token = getEnv("admin-token");

    const res = await request(app)
      .get(`/api/v1/user/${userTestId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("data");
  });

  it("PUT /api/v1/user/:id should return status code 200 and update user name => update user", async () => {
    const token = getEnv("admin-token");

    const res = await request(app)
      .put(`/api/v1/user/${userTestId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "test2" });

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data.name).toEqual("test2");
  });

  it("DELETE /api/v1/user/:id should return status code 204 => delete one user", async () => {
    const token = getEnv("admin-token");

    const res = await request(app)
      .delete(`/api/v1/user/${userTestId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toEqual(204);
  });
});
