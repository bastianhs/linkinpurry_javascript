import prisma from "../database/prismaClient.js";

const getConnections = async () => {
	return await prisma.connection.findMany();
};

const getConnectionsByFromId = async (from_id) => {
	const connections = await prisma.connection.findMany({
		where: {
			from_id,
		},
		orderBy: {
			created_at: "desc",
		},
		select: {
			created_at: true,
			users_connection_to_idTousers: {
				select: {
					id: true,
					username: true,
					profile_photo_path: true,
				},
			},
		},
	});

	return connections.map((connection) => ({
		id: Number(connection.users_connection_to_idTousers.id),
		username: connection.users_connection_to_idTousers.username,
		profile_photo_path:
			connection.users_connection_to_idTousers.profile_photo_path,
		created_at: connection.created_at,
	}));
};

const getUserConnections = async (from_id) => {
	const connections = await prisma.connection.findMany({
		where: {
			OR: [{ from_id: BigInt(from_id) }, { to_id: BigInt(from_id) }],
		},
		orderBy: {
			created_at: "desc",
		},
		select: {
			created_at: true,
			from_id: true,
			to_id: true,
			users_connection_from_idTousers: {
				select: {
					id: true,
					username: true,
					profile_photo_path: true,
				},
			},
			users_connection_to_idTousers: {
				select: {
					id: true,
					username: true,
					profile_photo_path: true,
				},
			},
		},
	});

	const uniqueConnections = new Map();

	connections.forEach((connection) => {
		const otherUser =
			connection.from_id === BigInt(from_id)
				? connection.users_connection_to_idTousers
				: connection.users_connection_from_idTousers;

		const userId = Number(otherUser.id);
		if (
			!uniqueConnections.has(userId) ||
			connection.created_at > uniqueConnections.get(userId).created_at
		) {
			uniqueConnections.set(userId, {
				id: userId,
				username: otherUser.username,
				profile_photo_path: otherUser.profile_photo_path,
				created_at: connection.created_at,
			});
		}
	});
	return Array.from(uniqueConnections.values()).sort(
		(a, b) => b.created_at - a.created_at
	);
};

const createConnection = async (from_id, to_id) => {
	return await prisma.connection.create({
		data: { from_id, to_id, created_at: new Date() },
	});
};

const deleteConnection = async (from_id, to_id) => {
	return await prisma.connection.delete({
		where: { from_id_to_id: { from_id, to_id } },
	});
};

const connectionModel = {
	getConnections,
	getConnectionsByFromId,
	createConnection,
	deleteConnection,
	getUserConnections,
};

export default connectionModel;
