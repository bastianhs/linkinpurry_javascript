import express from "express";
import router from "./Router/router.js";
import database from "./database/db_connector.js";
import {errorHandler} from "./Middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import authRouter from "./Router/authRouter.js";
import userRouter from "./Router/userRouter.js";
import connectionRequestRouter from "./Router/connectionRequestRouter.js";
import connectionRouter from "./Router/connectionRouter.js";
import chatRouter from "./Router/chatRouter.js";
import feedRouter from "./Router/feedRouter.js";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import setupWebSocket from "./Config/websocket.js";

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import indexRouter from "./Router/indexRouter.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = setupWebSocket(server);

app.use(
	cors({
		origin: "http://localhost:3000",
		methods: ["GET", "POST", "PUT", "DELETE"],
		credentials: true,
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);

// Connect database
database.connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());

// app.js
const swaggerOptions = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Chat API",
			version: "1.0.0",
			description: "API documentation for chat application",
		},
		servers: [
			{
				url: "http://localhost:4001",
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
			schemas: {
				User: {
					type: "object",
					properties: {
						id: { type: "string" },
						username: { type: "string" },
						email: { type: "string" },
						full_name: { type: "string" },
					},
				},
				Error: {
					type: "object",
					properties: {
						success: { type: "boolean" },
						message: { type: "string" },
						error: { type: "string" },
					},
				},
			},
		},
	},
	apis: ["./Router/*.js"],
};

const specs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Routes

// app.use("/", router);
app.use("/api", indexRouter);
app.use("/api/profile", router);
app.use("/api/users", userRouter);
app.use("/api/connection-requests", connectionRequestRouter);
app.use("/api/connections", connectionRouter);
app.use("/api/chats", chatRouter);
app.use("/api/feed", feedRouter);



// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 4001;
server.listen(PORT, () => {
	// Use server.listen instead of app.listen
	console.log(`Server is running on port ${PORT}`);
});

export default app;
