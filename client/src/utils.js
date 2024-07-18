import { createInterface } from "node:readline/promises";
import { randomUUID } from "crypto";

const rl = createInterface({ input: process.stdin, output: process.stdout });
export function question(q) {
  return rl.question(q);
}

export function generatePayload(c = "") {
  return [
    {
      nn: 5,
      at: "2024-05-07",
    },
  ];
}
export function generateInit(data = {}) {
  const uid = randomUUID();
  return {
    uid,
    name: "sensor-test",
    tZone: "+03:30",
    tSource: "GPS",
    inst_lat: 10,
    inst_lon: 20,
    inst_operator_id: 110,
    inst_time: "2024-05-07",
    inst_cellular_no: "0939",
    inst_cellular_operator: "2554",
    ...data,
  };
}
