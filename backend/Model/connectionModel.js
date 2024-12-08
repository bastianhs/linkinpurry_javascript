import prisma from "../database/prismaClient.js";


const getConnections = async () => {
	return await prisma.connection.findMany();
};

const getConnectionsByFromId = async (from_id) => {
	const connections = await prisma.connection.findMany({
        where: {
            from_id
        },
        orderBy: {
            created_at: "desc"
        },
        select: {
            created_at: true,
            users_connection_to_idTousers: {
                select: {
                    id: true,
                    username: true,
                    full_name: true,
                    profile_photo_path: true,
                }
            }
        }
    });
    
    return connections.map(connection => ({
        id: connection.users_connection_to_idTousers.id,
        username: connection.users_connection_to_idTousers.username,
        full_name: connection.users_connection_to_idTousers.full_name,
        profile_photo_path: connection.users_connection_to_idTousers.profile_photo_path,
        created_at: connection.created_at
    }));
}

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
};

export default connectionModel;
