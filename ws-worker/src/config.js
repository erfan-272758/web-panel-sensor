import { config } from "dotenv";
import { InfluxDB } from "@influxdata/influxdb-client";

config({
  path: ".env.local",
});

export function getEnv(key = "") {
  return process.env[key.toUpperCase().replace("-", "_")];
}
export const db = new InfluxDB({
  url: getEnv("influx-url"),
  token: getEnv("influx-token"),
});
