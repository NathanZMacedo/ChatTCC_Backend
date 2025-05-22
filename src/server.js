import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log(`socket ${socket.id} connected`);
    console.log("Usuário conectado!", socket.id);
    socket.on("disconnect", (reason) => {
        console.log("Usuário desconectado!", socket.id);
    });
    socket.on("set_username", (username) => {
        socket.data.username = username;
    });
    socket.on("message", (messageData) => {
        io.emit("receive_message", {
            ...messageData,
            authorId: socket.id,
            author: socket.data.username,
        });
    });
});

server.listen(8080, () => {
  console.log(`Servidor rodando em http://localhost:8080`);
});
