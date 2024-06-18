import { Server } from "socket.io";
import sockets from "./socket";

const chat = require("express")();
// const http = require("http").createServer(chat);
import http from "http";
// const io = require("socket.io")(http);
const PORT = process.env.PORT || 3003;
const httpServer = http.createServer(chat);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "*", "http://localhost:3000/chat"],
  },
});

const Chat = () => {
  io.on("connection", sockets);
  httpServer.listen(PORT, () => {
    console.log("Server is running at http://localhost:3003");
  });

  return chat;
};

export default Chat;
