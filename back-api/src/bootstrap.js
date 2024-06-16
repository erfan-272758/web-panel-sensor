import crypto from "crypto";
import { getEnv } from "./config.js";
import userModel from "./models/userModel.js";

export default async function bootstrap() {
  // init root user
  const adminUsername = getEnv("admin-user");
  const adminPassword = getEnv("admin-pass");

  const [user] = await userModel.readUser({ username: adminUsername });

  if (!user) {
    await userModel.writeUser({
      id: crypto.randomUUID(),
      username: adminUsername,
      password: adminPassword,
      role: "admin",
    });
    console.log("[prepare]", "create admin user");
  }
}
