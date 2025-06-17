const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const httpServer = createServer(app);

app.use(cors());

const io = new Server(httpServer, {
  cors: {
    // Allow the frontend origin(s) defined via env var, fallback to all during development
    origin: process.env.CLIENT_ORIGIN?.split(",") || [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
    ],
    methods: ["GET", "POST"],
  },
});

// Store active users and messages
const users = new Map();
const messages = [];

// Generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join_room", (userData) => {
    const user = {
      id: socket.id,
      name: userData.name,
      color: userData.color,
      joinedAt: new Date(),
    };

    users.set(socket.id, user);

    // Create system message
    const systemMessage = {
      id: generateId(),
      userId: "system",
      userName: "System",
      userColor: "#6f6e69",
      content: `${userData.name} joined the chat`,
      timestamp: new Date(),
      type: "system",
    };

    messages.push(systemMessage);

    // Send current room state to the new user
    socket.emit("room_update", {
      users: Array.from(users.values()),
      messages: messages,
    });

    // Notify all other users about the new user
    socket.broadcast.emit("user_joined", user);
    socket.broadcast.emit("new_message", systemMessage);

    console.log(`${userData.name} joined the chat`);
  });

  socket.on("send_message", (content) => {
    const user = users.get(socket.id);
    if (!user) return;

    const message = {
      id: generateId(),
      userId: user.id,
      userName: user.name,
      userColor: user.color,
      content,
      timestamp: new Date(),
      type: "message",
    };

    messages.push(message);

    // Send message to all users including sender
    io.emit("new_message", message);

    console.log(`${user.name}: ${content}`);
  });

  socket.on("leave_room", () => {
    const user = users.get(socket.id);
    if (user) {
      const systemMessage = {
        id: generateId(),
        userId: "system",
        userName: "System",
        userColor: "#6f6e69",
        content: `${user.name} left the chat`,
        timestamp: new Date(),
        type: "system",
      };

      messages.push(systemMessage);
      users.delete(socket.id);

      // Notify remaining users
      socket.broadcast.emit("user_left", socket.id);
      socket.broadcast.emit("new_message", systemMessage);

      console.log(`${user.name} left the chat`);
    }
  });

  socket.on("disconnect", () => {
    const user = users.get(socket.id);
    if (user) {
      const systemMessage = {
        id: generateId(),
        userId: "system",
        userName: "System",
        userColor: "#6f6e69",
        content: `${user.name} left the chat`,
        timestamp: new Date(),
        type: "system",
      };

      messages.push(systemMessage);
      users.delete(socket.id);

      // Notify remaining users
      socket.broadcast.emit("user_left", socket.id);
      socket.broadcast.emit("new_message", systemMessage);

      console.log(`${user.name} disconnected`);
    }
  });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Chat server running on port ${PORT}`);
  console.log(`WebSocket server ready for connections from:`);
  console.log(`  - http://localhost:3000`);
  console.log(`  - http://192.168.2.15:3000`);
});
