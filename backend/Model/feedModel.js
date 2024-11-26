import prisma from "../prismaClient.js";

export const getFeeds = async () => {
	return await prisma.feed.findMany();
};

export const createFeed = async (user_id, content) => {
	return await prisma.feed.create({
		data: { user_id, content, created_at: new Date(), updated_at: new Date() },
	});
};

export const updateFeed = async (id, content) => {
	return await prisma.feed.update({
		where: { id },
		data: { content, updated_at: new Date() },
	});
};

export const deleteFeed = async (id) => {
	return await prisma.feed.delete({
		where: { id },
	});
};
