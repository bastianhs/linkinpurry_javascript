import prisma from "../database/prismaClient.js";

const getAllChats = async () => {
	return await prisma.chat.findMany();
};

const createChat = async (from_id, to_id, message) => {
	return await prisma.chat.create({
		data: { from_id, to_id, message },
	});
};

const deleteChat = async (id) => {
	return await prisma.chat.delete({
		where: { id },
	});
};

const chatModel = {deleteChat,createChat,getAllChats}
export default chatModel;