import amqp from "amqplib";
import { getEnv } from "./config.js";
import initialController from "../controller/initialController.js";
import dataController from "../controller/dataController.js";

async function startConsumer() {
  const host = getEnv("host");
  const port = getEnv("port");
  const username = getEnv("username");
  const password = getEnv("password");
  try {
    // Connect to RabbitMQ server
    const connection = await amqp.connect({
      hostname: host,
      port,
      username,
      password,
    });
    const channel = await connection.createChannel();

    // Declare a queue
    const initQ = "initial";
    const dataQ = "data";
    await channel.assertQueue(initQ, { durable: false });
    await channel.assertQueue(dataQ, { durable: false });

    console.log("Consumer started. Waiting for messages...");

    // Consume messages from the queue
    channel.consume(
      initQ,
      (m) => {
        m.content.toString("utf-8");
      },
      initialController(channel)
    );
    channel.consume(dataQ, dataController(channel));
  } catch (error) {
    console.error("Error:", error);
  }
}

startConsumer();
