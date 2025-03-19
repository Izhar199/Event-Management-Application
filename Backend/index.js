const express = require('express');
const http = require("http");
const cors = require('cors');
const { Server } = require("socket.io");
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Allow frontend requests
        methods: ["GET", "POST"],
        allowedHeaders: ["Authorization"],
        credentials: true
    }, transports: ["websocket", "polling"],
});
// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', require('./routes/eventRoutes'));

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("sendMessage", (message) => {
        console.log("Message received:", message);
        io.emit("receiveMessage", message); // Broadcast message
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
