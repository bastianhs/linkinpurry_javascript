import prisma from "../prismaClient.js";

export const getConnections = async () => {
	return await prisma.connection.findMany();
};

export const createConnection = async (from_id, to_id) => {
	return await prisma.connection.create({
		data: { from_id, to_id, created_at: new Date() },
	});
};

export const deleteConnection = async (from_id, to_id) => {
	return await prisma.connection.delete({
		where: { from_id_to_id: { from_id, to_id } },
	});
};
