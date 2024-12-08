import prisma from "../database/prismaClient.js";

const formatUser = (user) => ({
	id: user.id.toString(),
	username: user.username,
	profile_photo_path: user.profile_photo_path,
});

const getAllChats = async () => {
	return await prisma.chat.findMany();
};


const getChatsByUserId = async (userId) => {
	const chats = await prisma.chat.findMany({
		where: {
			OR: [{ from_id: BigInt(userId) }, { to_id: BigInt(userId) }],
		},
		include: {
			users_chat_from_idTousers: {
				select: {
					id: true,
					username: true,
					profile_photo_path: true,
				},
			},
			users_chat_to_idTousers: {
				select: {
					id: true,
					username: true,
					profile_photo_path: true,
				},
			},
		},
		orderBy: {
			timestamp: "desc",
		},
		distinct: ["from_id", "to_id"],
	});

	return chats.map((chat) => ({
		id: chat.id.toString(),
		message: chat.message,
		timestamp: chat.timestamp,
		otherUser: formatUser(
			chat.from_id === BigInt(userId)
				? chat.users_chat_to_idTousers
				: chat.users_chat_from_idTousers
		),
	}));
};

const getMessagesByChatId = async (userId, chatId) => {
	const messages = await prisma.chat.findMany({
		where: {
			OR: [
				// Current user sent messages to this chat partner
				{
					AND: [{ from_id: BigInt(userId) }, { to_id: BigInt(chatId) }],
				},
				// Current user received messages from this chat partner
				{
					AND: [{ from_id: BigInt(chatId) }, { to_id: BigInt(userId) }],
				},
			],
		},
		orderBy: {
			timestamp: "asc",
		},
	});
    console.log("MESSAGES: ", messages)
	return messages.map((msg) => ({
		id: msg.id.toString(),
		from_id: msg.from_id.toString(),
		to_id: msg.to_id.toString(),
		message: msg.message,
		timestamp: msg.timestamp,
	}));
};

const findExistingChat = async (fromId, toId) => {
	return await prisma.chat.findFirst({
		where: {
			OR: [
				{ AND: [{ from_id: fromId }, { to_id: toId }] },
				{ AND: [{ from_id: toId }, { to_id: fromId }] },
			],
		},
		include: {
			users_chat_from_idTousers: true,
			users_chat_to_idTousers: true,
		},
	});
};

const createChat = async (fromId, toId, message = "Started a conversation") => {
	return await prisma.chat.create({
		data: { from_id: fromId, to_id: toId, message },
		include: {
			users_chat_from_idTousers: true,
			users_chat_to_idTousers: true,
		},
	});
};

const deleteChat = async (id) => {
	return await prisma.chat.delete({
		where: { id },
	});
};

export default {
	getAllChats,
	getChatsByUserId,
	getMessagesByChatId,
	findExistingChat,
	createChat,
	deleteChat,
	formatUser,
};
