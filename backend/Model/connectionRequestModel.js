import prisma from "../database/prismaClient.js";

const getConnectionRequests = async () => {
	return await prisma.connection_request.findMany();
};

const createConnectionRequest = async (from_id, to_id) => {
	return await prisma.connection_request.create({
		data: { from_id, to_id, created_at: new Date() },
	});
};

const deleteConnectionRequest = async (from_id, to_id) => {
	return await prisma.connection_request.delete({
		where: { from_id_to_id: { from_id, to_id } },
	});
};

const connectionRequestModel = {getConnectionRequests,createConnectionRequest,deleteConnectionRequest}
export default connectionRequestModel;