import { Prisma } from "@prisma/client";
import connectionModel from "../Model/connectionModel.js";
import connectionRequestModel from "../Model/connectionRequestModel.js";


const createConnectionRequest = async (req, res) => {
    try {
        const fromId = Number(req.user.userId);
        const toId = Number(req.body.toId);

        if (fromId === toId) {
            return res.status(400).json({
                errors: "Cannot send connection request to yourself"
            });
        }

        const existingRequest = await connectionRequestModel.getConnectionRequestsByFromIdToId(fromId, toId);
        if (existingRequest) {
            return res.status(400).json({
                errors: "Connection request already exists"
            });
        }

        await connectionRequestModel.createConnectionRequest(fromId, toId);
        res.status(201).json({
            messages: "Create connection request successful."
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: "Failed to create connection request"
        });
    }
}

const getConnectionRequests = async(req, res) => {
    try {
        const toId = Number(req.user.userId);

        const connectionRequests = await connectionRequestModel.getConnectionRequestsByToId(toId);
        
        if (connectionRequests.length === 0) {
            return res.status(404).json({ errors: "No connection requests found" });
        }
        
        const formattedConnectionRequests = connectionRequests.map(request => ({
            ...request,
            from: {
                ...request.from,
                id: Number(request.from.id)
            },
            to_id: Number(request.to_id)
        }));

        res.status(200).json({
            data: formattedConnectionRequests
        });

    } catch (error) {
        res.status(500).json({
            errors: "Failed to get connection requests"
        });
    }
}

const respondToConnectionRequest = async (req, res) => {
    try {
        const toId = Number(req.user.userId);
        const fromId = Number(req.body.fromId);
        const action = req.body.action;

        let messages;
        if (action === "accept") {
            await acceptConnectionRequest(fromId, toId);
            messages = "Accept connection request successful";
        } else if (action === "decline") {
            await declineConnectionRequest(fromId, toId);
            messages = "Decline connection request successful";
        } else {
            return res.status(400).json({
                errors: "Invalid action"
            });
        }

        res.status(200).json({
            messages
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: "Failed to respond to connection request"
        });
    }
};

const acceptConnectionRequest = async (fromId, toId) => {
    try {
        await connectionModel.createConnection(fromId, toId);
        await connectionModel.createConnection(toId, fromId);
        await connectionRequestModel.deleteConnectionRequest(fromId, toId);
    } catch (error) {
        throw new Error("Failed to accept connection request");
    }
};

const declineConnectionRequest = async (fromId, toId) => {
    try {
        await connectionRequestModel.deleteConnectionRequest(fromId, toId);
    } catch (error) {
        throw new Error("Failed to decline connection request");
    }
};

const getConnections = async (req, res) => {
    try {
        const userId = Number(req.params.userId);
    
        const connections = await connectionModel.getConnectionsByFromId(userId);

        if (connections.length === 0) {
            return res.status(404).json({
                errors: "No connections found",
            });
        }

        const formattedConnections = connections.map(connection => ({
            ...connection,
            id: Number(connection.id),
        }));

        res.status(200).json({
            data: formattedConnections
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            errors: "Failed to get connections",
        });
    }
}
const getConnection = async (req, res) => {
    try {
        const userId = req.user.userId;
        // console.log(userId);
        const connections = await connectionModel.getConnectionsByFromId(userId);

        if (connections.length === 0) {
            return res.status(404).json({
                errors: "No connections found",
            });
        }

        res.status(200).json({
            data: connections
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            errors: "Failed to get connections",
        });
    }
}
const deleteConnection = async (req, res) => {
    const userId1 = Number(req.user.userId);
    const userId2 = Number(req.params.userId);

    try {
        await connectionModel.deleteConnection(userId1, userId2);
        await connectionModel.deleteConnection(userId2, userId1);

        res.status(200).json({
            messages: "Delete connection successful",
        });

    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
            res.status(404).json({
                errors: "Connection not found",
            });
        } else {
            res.status(500).json({
                errors: "Failed to delete connection",
            });
        }
    }
}

// // dummy payload
// const createDummyPayload = req => {
//     req.user = {
//         userId: 7 // dummy user id logged in
//     }
//     return req;
// }
const getUserConnection = async (req, res) => {
    try {
        const userId = req.user.userId;
        
        // console.log("AAAAA");
        // console.log(userId);
        const connections = await connectionModel.getUserConnections(userId);

        if (connections.length === 0) {
            return res.status(404).json({
                errors: "No connections found",
            });
        }

        res.status(200).json({
            data: connections
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            errors: "Failed to get connections",
        });
    }
}
const isConnected = async (req, res) => {
    try {
        const currentUserId = req.user?.userId; // Assuming you have authentication middleware
        const { id } = req.params;
    
        // Check if connection exists
        console.log(currentUserId, id);
        const existingConnection = await connectionModel.getConnectionByFromIdToId(currentUserId, id);
        console.log("1.2")
        console.log(existingConnection);
        // Check for pending request
        const pendingRequest = await connectionRequestModel.getConnectionRequestsByFromIdToId(currentUserId, id);
        console.log(pendingRequest)
    
        res.json({
          isConnected: !!existingConnection,
          isPending: !!pendingRequest
        });
      } catch (error) {
        res.status(500).json({ message: 'Error checking connection status' });
      }
};

export {
    createConnectionRequest,
    getConnectionRequests,
    respondToConnectionRequest,
    getConnections,
    deleteConnection,
    getConnection,
    getUserConnection,
    isConnected,
};
