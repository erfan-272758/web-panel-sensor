import { Server } from "socket.io";
import { getEnv } from "./config.js";
import initialController from "../controller/initialController.js";
import dataController from "../controller/dataController.js";

const port = +(getEnv("port") || "3000");
const token = getEnv("token");

const io = new Server(port, {
  transports: ["websocket", "polling"],
  path: "/ws",
});

console.log(`ws server listen on :${port}`);

// Socket.IO event handlers
io.on("connection", (socket) => {
  const t = socket.handshake.headers.authorization;
  if (t !== token) {
    return socket.disconnect(true);
  }

  console.log(`${socket.id} connected.`);

  // Handle "initial" and "data" event
  socket.on("initial", initialController(socket));
  socket.on("data", dataController(socket));

  // Handle disconnect event
  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected.`);
  });
});
