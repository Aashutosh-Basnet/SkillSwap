import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { v4 as uuidV4 } from "uuid";
import dbConnect from "./db/db.connection.js"

import Routes from "./routes/routes.js";
import cors from 'cors';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

app.use(express.json());

const port = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use("/api", Routes);

app.get("/health", (req, res) => {
    res.json({ message: "Server is running with sliding expiration enabled" });
});

const waitingUsers = [];

io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    socket.on("findMatch", () => {
        console.log("user finding match", socket.id);
        waitingUsers.push(socket);

        if (waitingUsers.length >= 2) {
            const user1 = waitingUsers.shift();
            const user2 = waitingUsers.shift();

            if (user1 && user2) {
                const roomId = uuidV4();
                user1.join(roomId);
                user2.join(roomId);

                user1.emit("matchFound", { roomId });
                user2.emit("matchFound", { roomId });
                console.log(`Match found for ${user1.id} and ${user2.id} in room ${roomId}`);
            }
        }
    });

    // Handle joining a room for chat
    socket.on("joinRoom", (roomId) => {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    // Handle sending messages
    socket.on("sendMessage", (data) => {
        const { room, text, sender, timestamp } = data;
        console.log(`Message in room ${room}: ${text}`);
        
        // Broadcast message to all other users in the room
        socket.to(room).emit("message", {
            text,
            sender,
            timestamp
        });
    });

    // Handle leaving a room
    socket.on("leaveRoom", (roomId) => {
        socket.leave(roomId);
        console.log(`Socket ${socket.id} left room ${roomId}`);
    });
    
    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
        const index = waitingUsers.findIndex(s => s.id === socket.id);
        if (index !== -1) {
            waitingUsers.splice(index, 1);
            console.log('user removed from waiting queue');
        }
    });
});


server.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
    console.log(`Sliding expiration enabled: tokens refresh automatically when < 15 minutes remaining`);
    dbConnect();
});


