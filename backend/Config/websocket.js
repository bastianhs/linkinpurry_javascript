import { Server } from "socket.io";
import { verifyToken } from "../Util/jwt.js";
import prisma from "../database/prismaClient.js";

const formatMessage = (message) => ({
	id: message.id.toString(),
	from_id: message.from_id.toString(),
	to_id: message.to_id.toString(),
	message: message.message,
	timestamp: message.timestamp,
});

const setupWebSocket = (server) => {
	const io = new Server(server, {
		cors: {
			origin: "http://localhost:3000",
			methods: ["GET", "POST"],
			credentials: true,
		},
	});

	const userSockets = new Map();

	io.use(async (socket, next) => {
		try {
			const token = socket.handshake.headers.cookie?.split("token=")[1];
			if (!token) {
				throw new Error("Authentication error");
			}
			const decoded = verifyToken(token);
			socket.userId = decoded.userId;
			next();
		} catch (err) {
			next(new Error("Authentication error"));
		}
	});

	io.on("connection", (socket) => {
		console.log(`User connected: ${socket.userId}`);
		userSockets.set(socket.userId, socket);

		socket.on("message", async (data) => {
			try {
				const { to_id, message } = data;
				const from_id = socket.userId;
				if (BigInt(from_id) === BigInt(to_id)) {
					socket.emit("error", { message: "Cannot send message to self" });
					throw new Error("Cannot send message to self");
				}

				const connection = await prisma.connection.findFirst({
					where: {
						OR: [
							{
								AND: [{ from_id: BigInt(from_id) }, { to_id: BigInt(to_id) }],
							},
							{
								AND: [{ from_id: BigInt(to_id) }, { to_id: BigInt(from_id) }],
							},
						],
					},
				});

				if (!connection) {
					socket.emit("error", {
						message: "Cannot send message - users are not connected",
					});
					return;
				}

				const newMessage = await prisma.chat.create({
					data: {
						from_id: BigInt(from_id),
						to_id: BigInt(to_id),
						message: message,
					},
				});

				const formattedMessage = formatMessage(newMessage);

				const recipientSocket = userSockets.get(to_id);
				if (recipientSocket) {
					recipientSocket.emit("message", {
						message: formattedMessage,
					});
				}

				socket.emit("message", {
					message: formattedMessage,
				});
			} catch (error) {
				console.error("Message error:", error);
				socket.emit("error", { message: error.message });
			}
		});

		socket.on("disconnect", () => {
			userSockets.delete(socket.userId);
			console.log(`User disconnected: ${socket.userId}`);
		});
	});

	return io;
};

export default setupWebSocket;
