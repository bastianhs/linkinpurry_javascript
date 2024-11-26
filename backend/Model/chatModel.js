import prisma from "../prismaClient.js";

export const getAllChats = async () => {
	return await prisma.chat.findMany();
};

export const createChat = async (from_id, to_id, message) => {
	return await prisma.chat.create({
		data: { from_id, to_id, message },
	});
};

export const deleteChat = async (id) => {
	return await prisma.chat.delete({
		where: { id },
	});
};
