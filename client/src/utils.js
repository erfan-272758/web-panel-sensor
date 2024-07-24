import { createInterface } from "node:readline/promises";
import { randomInt, randomUUID } from "crypto";

const rl = createInterface({ input: process.stdin, output: process.stdout });
export function question(q) {
  return rl.question(q);
}

export function generatePayload(c = "") {
  let data;
  switch (c) {
    case "Env":
      data = envData();
      break;
    case "Acc":
      data = accData();
      break;
    case "Info":
      data = infoData();
      break;

    default:
      console.log("Invalid class received, it must be in 'Env','Acc','Info'");
      return null;
  }

  const base = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return data.map((d) => {
    base.setSeconds(base.getSeconds() + 1);
    return { ...d, at: base.toISOString() };
  });
}

function envData() {
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      temp: i / (randomInt(4) + 1) + 25,
      hum: i / ((randomInt(4) + 1) * 100),
    });
  }
  return data;
}

function accData() {
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({ coordinate: `0,0,${i / (randomInt(3) + 1) + 10}` });
  }
  return data;
}

function infoData() {
  const data = [];
  data.push({ text: "This is my info" });
  data.push({ num: 12 });
  return data;
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

export function validateClass(c) {
  const validList = ["Env", "Acc", "Info"];
  return validList.includes(c);
}
