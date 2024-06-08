import { config } from "dotenv";

config({
  path: ".env.local",
});

export function getEnv(key = "") {
  return process.env[key.toUpperCase().replace("-", "_")];
}
