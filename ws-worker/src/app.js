import { WebSocketServer } from "ws";
import url from "url";
import { getEnv } from "./config.js";
import initialController from "./controller/initialController.js";
import dataController from "./controller/dataController.js";

const port = +(getEnv("port") || "3000");
const token = getEnv("token");

const io = new WebSocketServer({ port });

console.log(`ws server listen on :${port}`);

// Socket.IO event handlers
io.on("connection", (socket, req) => {
  // Parse the URL to extract query parameters
  const parameters = url.parse(req.url, true).query;

  // Get the authorization token from the query parameters
  const t = parameters.authorization;
  if (t !== token) {
    return socket.close(4401, "Not Authorized");
  }
  console.log(`socket connected.`);

  const controllers = {
    initial: initialController(socket),
    data: dataController(socket),
  };

  // Handle "initial" and "data" events
  socket.onmessage = (event) => {
    try {
      const msg = event.data.toString();

      const message = JSON.parse(msg);
      switch (message.event) {
        case "initial":
          return controllers.initial(message.data, (data) => {
            console.log("ack initial: ", data);
          });
        case "data":
          return controllers.data(message.data, (data) => {
            console.log("ack data: ", data);
          });
      }
    } catch (err) {
      console.log("message error: ", err);
    }
  };
  socket.onerror = (ev) => {
    console.log("error: ", ev);
  };
  socket.onclose = () => {
    console.log(`socket disconnected.`);
  };
});
