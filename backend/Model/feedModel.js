import prisma from "../database/prismaClient.js";

const getFeeds = async () => {
	return await prisma.feed.findMany();
};

const createFeed = async (user_id, content) => {
	return await prisma.feed.create({
		data: { user_id, content, created_at: new Date(), updated_at: new Date() },
	});
};

const updateFeed = async (id, content) => {
	return await prisma.feed.update({
		where: { id },
		data: { content, updated_at: new Date() },
	});
};

const deleteFeed = async (id) => {
	return await prisma.feed.delete({
		where: { id },
	});
};

const feedModel = {getFeeds,createFeed,updateFeed,deleteFeed};
export default feedModel;