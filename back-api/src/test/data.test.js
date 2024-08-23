import request from "supertest";
import app from "../app"; // Assuming your Express app is in app.js
import { getEnv } from "../config";

let deviceTestId = "";

describe("Data", () => {
  it("GET /api/v1/data/:sensorClass/:sensorId should return status code 401 => get sensor data without authentication", async () => {
    const sensorClass = getEnv("sensor-test-class");
    const sensorId = getEnv("sensor-test-id");
    const res = await request(app).get(
      `/api/v1/data/${sensorClass}/${sensorId}`
    );

    expect(res.status).toEqual(401);
    expect(res.body).toHaveProperty("message");
  });

  it("GET /api/v1/data/:sensorClass/:sensorId should return status code 200 => get sensor data", async () => {
    const token = getEnv("admin-token");
    const sensorClass = getEnv("sensor-test-class");
    const sensorId = getEnv("sensor-test-id");

    const res = await request(app)
      .get(`/api/v1/data/${sensorClass}/${sensorId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("data");
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
