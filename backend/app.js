import express from "express";
import database from "./database/db_connector.js";
import {errorHandler} from "./Middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import http from 'http';
import setupWebSocket from './Config/websocket.js';
import notificationRouter from './Router/notificationRouter.js';
import path from 'path';
import { fileURLToPath } from 'url';
import http from "http";
import setupWebSocket from "./Config/websocket.js";

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import path from "path";
import { fileURLToPath } from "url";

// const __dirname = path.dirname(fileURLToPath(import.meta.url));

import indexRouter from "./Router/indexRouter.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = setupWebSocket(server);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

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

// Swagger
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
app.use('/', router);
app.use("/api/auth", authRoutes);
app.use("/api/profile", router);
app.use("/api/users", userRouter);
app.use("/api/connection-requests", connectionRequestRouter);
app.use("/api/connections", connectionRouter);
app.use("/api/chats", chatRouter);
app.use("/api/notifications", notificationRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api", indexRouter);


app.get('/health', async (req, res) => {
  try {
    await database.client.query('SELECT 1');
    
    res.status(200).json({ 
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message 
    });
  }
});



// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 4001;
server.listen(PORT, () => {
	// Use server.listen instead of app.listen
	console.log(`Server is running on port ${PORT}`);
});

export default app;
