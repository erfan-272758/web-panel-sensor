import { io } from "socket.io-client";
import amqp from "amqplib";
import { getEnv } from "./config.js";
import { generateInit, generatePayload, validateClass } from "./utils.js";

const token = getEnv("token");
const ws_port = getEnv("ws-port");
const ws_host = getEnv("ws-host") ?? "localhost";
const mqtt_port = getEnv("rabbit-port");
const mqtt_host = getEnv("rabbit-host") ?? "localhost";
const mqtt_user = getEnv("rabbit-user");

export async function handleCmd(cmd = "") {
  const sCmd = cmd.split(" ");
  switch (sCmd[0]?.toLowerCase()) {
    case "help":
    case "h":
      getHelp();
      break;
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
    case "mqtt":
      switch (sCmd[1]?.toLowerCase()) {
        case "initial":
          await mqttInitHandler(...sCmd.slice(2));
          break;
        case "data":
          await mqttDataHandler(...sCmd.slice(2));
          break;
        default:
          console.log(
            "Invalid command, your action must must be 'initial' or 'data'"
          );
          break;
      }
      break;

    default:
      console.log("Invalid command, your protocol must be 'ws' or 'mqtt'");
      break;
  }
}
let wsSocket = null;
let rabbitChan = null;
function getWsSocket() {
  if (wsSocket != null) return wsSocket;

  wsSocket = io(`ws://${ws_host}:${ws_port}`, {
    path: "/ws",
    transports: ["websocket", "polling"],
    extraHeaders: {
      authorization: token,
    },
  });

  return wsSocket;
}
async function getRabbitChan() {
  if (rabbitChan !== null) return rabbitChan;

  const conn = await amqp.connect({
    hostname: mqtt_host,
    port: mqtt_port,
    username: mqtt_user,
    password: token,
  });
  rabbitChan = await conn.createConfirmChannel();

  return rabbitChan;
}

async function wsInitHandler(device = "", c = "") {
  if (!validateClass(c)) {
    return console.error(
      "Invalid class received, it must be in 'Env','Acc','Info'"
    );
  }
  const s = generateInit({ device, class: c });

  const socket = getWsSocket();
  try {
    const response = await socket.timeout(5000).emitWithAck("initial", s);
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
  if (!validateClass(c)) {
    return console.error(
      "Invalid class received, it must be in 'Env','Acc','Info'"
    );
  }

  const socket = getWsSocket();
  const payloads = generatePayload(c);
  if (payloads == null) return;

  try {
    for (const payload of payloads) {
      const response = await socket.timeout(5000).emitWithAck("data", {
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
async function mqttInitHandler(device = "", c = "") {
  if (!validateClass(c)) {
    return console.error(
      "Invalid class received, it must be in 'Env','Acc','Info'"
    );
  }

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
    console.log(`initial message for sensor '${s.uid}' send to queue`);
  } catch (err) {
    console.log("Error:", err.message);
  }
}
async function mqttDataHandler(uid, c = "") {
  if (!validateClass(c)) {
    return console.error(
      "Invalid class received, it must be in 'Env','Acc','Info'"
    );
  }

  try {
    const channel = await getRabbitChan();
    const payloads = generatePayload(c);
    if (payloads == null) return;

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
    console.log(`${payloads.length} messages send to queue`);
  } catch (err) {
    console.log("Error:", err.message);
  }
}

function getHelp() {
  const h = `
    <protocol> <action> <data>
    
    ------------------------------------------------------------------------------
    | Protocols:                                                                 |
    |              'ws' => communicate to ws-worker with ws protocol             |
    |              'mqtt' => communicate to rabbitmq server with amqp protocol |
    ------------------------------------------------------------------------------

    ------------------------------------------------------------------------------
    | Actions:                                                                   |
    |              'initial' => initial sensor to server                         |
    |              'data'    => send some sample data base on sensor class       |
    ------------------------------------------------------------------------------

    ------------------------------------------------------------------------------
    | Data:                                                                      |
    |              <device-id> <class-name> => use this pattern when you have    |
    |                                          'initial' action                  |
    |              <sensor-uid> <class-name> => use this pattern when you have   |
    |                                          'data' action                     |
    ------------------------------------------------------------------------------

    ------------------------------------------------------------------------------
    | Example:                                                                   |
    |              ws initial abc Env => communicate with protocol 'ws' to       |
    |                                    initial sensor to device 'abc', with    |
    |                                    class 'Env'                             |
    ------------------------------------------------------------------------------
    `;
  console.log(h);
}
