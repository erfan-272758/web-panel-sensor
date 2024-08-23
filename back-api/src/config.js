import { config } from "dotenv";
import { InfluxDB } from "@influxdata/influxdb-client";

export const isTest = process.env.NODE_ENV === "TEST";

config({
  path: isTest ? ".env.test" : ".env.local",
});

export function getEnv(key = "") {
  return process.env[key.toUpperCase().replace("-", "_")];
}
export const db = new InfluxDB({
  url: getEnv("influx-url"),
  token: getEnv("influx-token"),
});
