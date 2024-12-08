// backend/app.js
import express from "express";
import router from "./Router/router.js";
import database from "./database/db_connector.js";
import errorHandler from "./Middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import authRoutes from "./Router/authRoutes.js";
import userRouter from "./Router/userRouter.js";
import connectionRequestRouter from "./Router/connectionRequestRouter.js";
import connectionRouter from "./Router/connectionRouter.js";
import chatRouter from "./Router/chatRouter.js";
import dotenv from "dotenv";
import cors from "cors";
import http from 'http';
import setupWebSocket from './Config/websocket.js';

dotenv.config();

const app = express();
const server = http.createServer(app); 
const io = setupWebSocket(server);

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Connect database
database.connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/', router);
app.use("/api/auth", authRoutes);
app.use("/api/profile", router);
app.use("/api/users", userRouter);
app.use("/api/connection-requests", connectionRequestRouter);
app.use("/api/connections", connectionRouter);
app.use("/api/chats", chatRouter);

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 4001;
server.listen(PORT, () => { // Use server.listen instead of app.listen
  console.log(`Server is running on port ${PORT}`);
});

export default app;