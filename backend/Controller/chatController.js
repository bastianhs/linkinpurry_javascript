import prisma from "../database/prismaClient.js";

const formatUser = (user) => ({
	id: user.id.toString(),
	username: user.username,
	full_name: user.full_name || "",
	profile_photo_path: user.profile_photo_path,
});

const getChatsByUser = async (req, res) => {
	try {
		const userId = BigInt(req.user.userId);
		// console.log("UserId (BigInt):", userId.toString());

		// Simplified query
		const chats = await prisma.chat.findMany({
			where: {
				OR: [{ from_id: userId }, { to_id: userId }],
			},
			include: {
				users_chat_from_idTousers: true,
				users_chat_to_idTousers: true,
			},
			orderBy: {
				timestamp: "desc",
			},
		});

		// console.log(
		// 	"Raw chats found:",
		// 	chats.map((c) => ({
		// 		id: c.id.toString(),
		// 		from_id: c.from_id.toString(),
		// 		to_id: c.to_id.toString(),
		// 		message: c.message,
		// 	}))
		// );

		const uniqueChats = chats.reduce((acc, chat) => {
			const otherUserId = chat.from_id === userId ? chat.to_id : chat.from_id;

			if (
				!acc[otherUserId.toString()] ||
				new Date(chat.timestamp) >
					new Date(acc[otherUserId.toString()].timestamp)
			) {
				acc[otherUserId.toString()] = {
					id: chat.id.toString(),
					message: chat.message,
					timestamp: chat.timestamp,
					otherUser: formatUser(
						chat.from_id === userId
							? chat.users_chat_to_idTousers
							: chat.users_chat_from_idTousers
					),
				};
			}
			return acc;
		}, {});

		const formattedChats = Object.values(uniqueChats).sort(
			(a, b) => new Date(b.timestamp) - new Date(a.timestamp)
		);
		res.json({ chats: formattedChats, userId: userId.toString() });
	} catch (error) {
		console.error("Error in getChatsByUser:", error);
		res.status(500).json({ error: "Failed to fetch chats" });
	}
};
const getMessages = async (req, res) => {
	try {
		const userId = req.user.userId;
		const { to_userId } = req.body;

		const messages = await prisma.chat.findMany({
			where: {
				AND: [
					{
						OR: [
							{ AND: [{ from_id: userId }, { to_id: to_userId }] },
							{ AND: [{ from_id: to_userId }, { to_id: userId }] },
						],
					},
					{
						NOT: {
							AND: [{ from_id: userId }, { to_id: userId }],
						},
					},
				],
			},
			orderBy: {
				timestamp: "asc",
			},
		});

		const formattedMessages = messages.map((msg) => ({
			id: msg.id.toString(),
			from_id: msg.from_id.toString(),
			to_id: msg.to_id.toString(),
			message: msg.message,
			timestamp: msg.timestamp,
		}));
		res.json({ messages: formattedMessages, userId: userId });
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch messages" });
	}
};

const createChat = async (req, res) => {
	try {
		const fromId = req.user.userId;
		const { to_id } = req.body;

		if (!to_id) {
			return res.status(400).json({ error: "Recipient ID is required" });
		}

		// console.log(existingChat);

		const newChat = await prisma.chat.create({
			data: {
				from_id: fromId,
				to_id: to_id,
				message: "Started a conversation",
			},
			include: {
				users_chat_from_idTousers: true,
				users_chat_to_idTousers: true,
			},
		});

		const formattedNewChat = {
			id: newChat.id.toString(),
			message: newChat.message,
			timestamp: newChat.timestamp,
			otherUser: {
				...newChat.users_chat_to_idTousers,
				id: newChat.users_chat_to_idTousers.id.toString(),
			},
		};

		res.status(201).json(formattedNewChat);
	} catch (error) {
		console.error("Create chat error:", error);
		res.status(500).json({ error: "Failed to create chat" });
	}
};

export { getChatsByUser, getMessages, createChat };
