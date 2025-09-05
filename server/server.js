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
        origin: [
            process.env.FRONTEND_URL || "http://localhost:3000",
            "https://w6wx6d25-3000.inc1.devtunnels.ms"
        ],
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.use(express.json());

const port = process.env.PORT || 5000;

app.use(cors({
    origin: [
        process.env.FRONTEND_URL || "http://localhost:3000",
        "https://w6wx6d25-3000.inc1.devtunnels.ms"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use("/api", Routes);

app.get("/health", (req, res) => {
    res.json({ message: "Server is running with sliding expiration enabled" });
});

const waitingUsers = [];

// Add FastAPI recommendation service URL
const RECOMMENDATION_API_URL = process.env.RECOMMENDATION_API_URL || 'http://localhost:8000';

io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    socket.on("findMatch", async (userData) => {
        console.log("user finding match", socket.id, userData);
        
        // Check if user is already in waiting queue
        const existingIndex = waitingUsers.findIndex(s => s.id === socket.id);
        if (existingIndex !== -1) {
            console.log("User already in waiting queue");
            return;
        }
        
        // Store socket with user data attached
        socket.userData = userData || {};
        waitingUsers.push(socket);
        console.log(`User added to queue. Total waiting: ${waitingUsers.length}`);

        // Try intelligent matching first if we have user data
        if (waitingUsers.length >= 2 && userData?.userId) {
            console.log("Attempting intelligent matching...");
            
            try {
                // Get recommendations for this user
                const response = await fetch(`${RECOMMENDATION_API_URL}/api/users/matches`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: userData.userId,
                        limit: 10,
                        exclude_previous: true
                    }),
                    timeout: 5000
                });

                if (response.ok) {
                    const recommendations = await response.json();
                    console.log(`Found ${recommendations.matches.length} potential matches for user ${userData.userId}`);
                    
                    // Look for any of the recommended users in the waiting queue
                    let bestMatch = null;
                    let bestScore = 0;
                    
                    for (const waitingUser of waitingUsers) {
                        if (waitingUser.userData?.userId && waitingUser.userData.userId !== userData.userId) {
                            const recommendedMatch = recommendations.matches.find(
                                match => match.user_id === waitingUser.userData.userId
                            );
                            
                            if (recommendedMatch && recommendedMatch.compatibility_score > bestScore) {
                                bestMatch = waitingUser;
                                bestScore = recommendedMatch.compatibility_score;
                            }
                        }
                    }
                    
                    if (bestMatch && bestScore > 0.3) { // Minimum compatibility threshold
                        console.log(`Intelligent match found! Score: ${bestScore}`);
                        
                        // Remove both users from queue
                        const user1Index = waitingUsers.findIndex(u => u.id === socket.id);
                        const user2Index = waitingUsers.findIndex(u => u.id === bestMatch.id);
                        
                        if (user1Index !== -1) waitingUsers.splice(user1Index, 1);
                        if (user2Index !== -1) waitingUsers.splice(user2Index, 1);
                        
                        // Create match
                        const roomId = uuidV4();
                        socket.join(roomId);
                        bestMatch.join(roomId);

                        console.log(`Intelligent match: ${socket.id} and ${bestMatch.id} in room ${roomId} (score: ${bestScore})`);
                        socket.emit("matchFound", { roomId, matchType: "intelligent", compatibilityScore: bestScore });
                        bestMatch.emit("matchFound", { roomId, matchType: "intelligent", compatibilityScore: bestScore });
                        
                        return;
                    }
                }
            } catch (error) {
                console.error("Error in intelligent matching:", error);
                // Fall back to random matching
            }
        }

        // Fall back to random matching if intelligent matching fails or not enough data
        if (waitingUsers.length >= 2) {
            const user1 = waitingUsers.shift();
            const user2 = waitingUsers.shift();

            if (user1 && user2 && user1.connected && user2.connected) {
                const roomId = uuidV4();
                user1.join(roomId);
                user2.join(roomId);

                console.log(`Random match: ${user1.id} and ${user2.id} in room ${roomId}`);
                user1.emit("matchFound", { roomId, matchType: "random" });
                user2.emit("matchFound", { roomId, matchType: "random" });
                console.log(`Clients should now request tokens for channel: ${roomId}`);
            } else {
                // If one of the users disconnected, put the remaining user back in queue
                if (user1 && user1.connected) waitingUsers.unshift(user1);
                if (user2 && user2.connected) waitingUsers.unshift(user2);
            }
        }
    });

    // Handle joining a room for chat
    socket.on("joinRoom", (roomId) => {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined room ${roomId}`);
        console.log(`Room ${roomId} now has ${io.sockets.adapter.rooms.get(roomId)?.size || 0} members`);
    });

    // Handle sending messages
    socket.on("sendMessage", (data) => {
        const { room, text, sender, timestamp } = data;
        console.log(`Message in room ${room} from ${socket.id}: ${text}`);
        console.log(`Broadcasting to ${io.sockets.adapter.rooms.get(room)?.size - 1 || 0} other users in room`);
        
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


