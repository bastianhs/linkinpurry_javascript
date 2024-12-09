import prisma from "../database/prismaClient.js";

const getFeed = async (userId, cursor, limit) => {
	const connectedUserIds = await prisma.connection
		.findMany({
			where: { from_id: userId },
			select: { to_id: true },
		})
		.then((connections) =>
			connections.map((conn) => conn.to_id).filter((id) => id !== undefined)
		);

	const feeds = await prisma.feed.findMany({
		where: {
			user_id: {
				in: [userId, ...connectedUserIds.filter((id) => id !== undefined)],
			},
		},
		orderBy: { created_at: "desc" },
		take: limit,
		...(cursor && { skip: 1, cursor: { id: cursor } }),
		include: {
			users: {
				select: {
					id: true,
					username: true,
					full_name: true,
					profile_photo_path: true,
				},
			},
		},
	});

	const nextCursor = feeds.length === limit ? feeds[feeds.length - 1].id : null;

	const mappedFeeds = feeds.map((feed) => ({
		id: parseInt(feed.id),
		created_at: feed.created_at,
		updated_at: feed.updated_at,
		content: feed.content,
		user: {
			id: parseInt(feed.users.id),
			username: feed.users.username,
			full_name: feed.users.full_name,
			profile_photo_path: feed.users.profile_photo_path,
		},
	}));

	return { feeds: mappedFeeds, nextCursor: parseInt(nextCursor) };
};

const createFeed = async (userId, content) => {
	return await prisma.feed.create({
		data: {
			created_at: new Date(),
			updated_at: new Date(),
			content,
			user_id: userId,
		},
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
const getOtherFeed = async (userId) => {
	return await prisma.feed.findMany({
		where: {
			user_id: BigInt(userId),
		},
		orderBy: {
			created_at: "desc", 
		},
		include: {
			users: {
				select: {
					username: true,
					profile_photo_path: true,
				},
			},
		},
	});
};

const feedModel = {
	getFeed,
	createFeed,
	updateFeed,
	deleteFeed,
	getOtherFeed,
};
export default feedModel;
