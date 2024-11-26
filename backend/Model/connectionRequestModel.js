import prisma from "../prismaClient.js";

export const getConnectionRequests = async () => {
	return await prisma.connection_request.findMany();
};

export const createConnectionRequest = async (from_id, to_id) => {
	return await prisma.connection_request.create({
		data: { from_id, to_id, created_at: new Date() },
	});
};

export const deleteConnectionRequest = async (from_id, to_id) => {
	return await prisma.connection_request.delete({
		where: { from_id_to_id: { from_id, to_id } },
	});
};
