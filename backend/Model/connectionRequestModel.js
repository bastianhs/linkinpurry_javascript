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
    const connectionRequests = await prisma.connection_request.findMany({
        where: { to_id },
        orderBy: { created_at: "desc" },
        include: {
            users_connection_request_from_idTousers: true
        }
    });

    return connectionRequests.map(request => ({
        from: {
            id: request.users_connection_request_from_idTousers.id,
            username: request.users_connection_request_from_idTousers.username,
            full_name: request.users_connection_request_from_idTousers.full_name,
            profile_photo_path: request.users_connection_request_from_idTousers.profile_photo_path
        },
        to_id: request.to_id,
        created_at: request.created_at
    }));
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
