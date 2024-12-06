import prisma from "../database/prismaClient.js";

const getConnectionRequests = async () => {
	return await prisma.connection_request.findMany();
};

const getConnectionRequestsByFromIdToId = async (from_id, to_id) => {
	return await prisma.connection_request.findUnique({
		where: { from_id_to_id: { from_id, to_id } },
	});
}

const getConnectionRequestsByToId = async (to_id) => {
	return await prisma.connection_request.findMany({
		where: { to_id },
		orderBy: { created_at: "desc" }, // created_at descending
	});
};

const createConnectionRequest = async (from_id, to_id) => {
	return await prisma.connection_request.create({
		data: { from_id, to_id, created_at: new Date() },
	});
};

const deleteConnectionRequest = async (from_id, to_id) => {
	const connectionRequest = await prisma.connection_request.findUnique({
        where: { from_id_to_id: { from_id, to_id } },
    });

    if (!connectionRequest) {
        throw new Error("Connection request not found");
    }

    return await prisma.connection_request.delete({
        where: { from_id_to_id: { from_id, to_id } },
    });
};

const connectionRequestModel = {
	getConnectionRequests,
	getConnectionRequestsByFromIdToId,
	getConnectionRequestsByToId,
	createConnectionRequest,
	deleteConnectionRequest,
};

export default connectionRequestModel;
