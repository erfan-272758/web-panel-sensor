import { io } from "socket.io-client";
import amqp from "amqplib";
import { getEnv } from "./config.js";
import { generateInit, generatePayload } from "./utils.js";

const token = getEnv("token");
const ws_port = getEnv("ws-port");
const ws_host = getEnv("ws-host") ?? "localhost";
const rabbit_port = getEnv("rabbit-port");
const rabbit_host = getEnv("rabbit-host") ?? "localhost";
const rabbit_user = getEnv("rabbit-user");

export async function handleCmd(cmd = "") {
  const sCmd = cmd.split(" ");
  switch (sCmd[0]?.toLowerCase()) {
    case "ws":
      switch (sCmd[1]?.toLowerCase()) {
        case "initial":
          await wsInitHandler(...sCmd.slice(2));
          break;
        case "data":
          await wsDataHandler(...sCmd.slice(2));
          break;
        default:
          console.log(
            "Invalid command, your action must must be 'initial' or 'data'"
          );
          break;
      }
      break;
    case "rabbit":
      switch (sCmd[1]?.toLowerCase()) {
        case "initial":
          await rabbitInitHandler(...sCmd.slice(2));
          break;
        case "data":
          await rabbitDataHandler(...sCmd.slice(2));
          break;
        default:
          console.log(
            "Invalid command, your action must must be 'initial' or 'data'"
          );
          break;
      }
      break;

    default:
      console.log("Invalid command, it must start with 'ws' or 'rabbit'");
      break;
  }
}

function getWsSocket() {
  return io(`ws://${ws_host}:${ws_port}`, {
    path: "/ws",
    transports: ["websocket", "polling"],
    extraHeaders: {
      authorization: token,
    },
  });
}
async function getRabbitChan() {
  const conn = await amqp.connect({
    hostname: rabbit_host,
    port: rabbit_port,
    username: rabbit_user,
    password: token,
  });
  return await conn.createConfirmChannel();
}

async function wsInitHandler(device = "", c = "") {
  const s = generateInit({ device, class: c });

  const socket = getWsSocket();
  try {
    const response = await socket.emitWithAck("initial", s);
    if (response.status !== "success") {
      throw new Error(response.message ?? "somethings went wrong");
    }
    console.log(
      `initial socket successfully by uid '${s.uid}' for device '${device}' with class '${c}'`
    );
  } catch (err) {
    console.log("Error:", err.message);
  }
}
async function wsDataHandler(uid, c = "") {
  const socket = getWsSocket();
  const payloads = generatePayload(c);
  try {
    for (const payload of payloads) {
      const response = await socket.emitWithAck("data", {
        uid,
        class: c,
        payload,
      });
      if (response.status !== "success") {
        throw new Error(response.message ?? "somethings went wrong");
      }
    }
    console.log(`insert ${payloads.length} data successfully`);
  } catch (err) {
    console.log("Error:", err.message);
  }
}
async function rabbitInitHandler(device = "", c = "") {
  try {
    const s = generateInit({ device, class: c });

    const channel = await getRabbitChan();
    const isSend = channel.sendToQueue(
      "initial",
      Buffer.from(JSON.stringify(s))
    );
    if (!isSend) {
      throw new Error("can not send");
    }
    await channel.waitForConfirms();
    await channel.close();
    await channel.connection.close();
    console.log(`initial message for sensor '${s.uid}' send to queue`);
  } catch (err) {
    console.log("Error:", err.message);
  }
}
async function rabbitDataHandler(uid, c = "") {
  try {
    const channel = await getRabbitChan();
    const payloads = generatePayload(c);
    for (const payload of payloads) {
      const isSend = channel.sendToQueue(
        "data",
        Buffer.from(
          JSON.stringify({
            uid,
            class: c,
            payload,
          })
        )
      );
      if (!isSend) {
        throw new Error("can not send");
      }
    }
    await channel.waitForConfirms();
    await channel.close();
    await channel.connection.close();
    console.log(`${payloads.length} messages send to queue`);
  } catch (err) {
    console.log("Error:", err.message);
  }
}
