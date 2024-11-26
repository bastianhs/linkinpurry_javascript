import database from "../database/db_connector.js";

const {client} = database;

// dummy payload
const createDummyPayload = req => {
    req.user = {
        userId: 1
    }
    return req;
}

const createConnectionRequest = async (req, res) => {
    try {
        req = createDummyPayload(req);
        const fromId = req.user.userId;
        const toId = req.body.toId;

        let query = `
            SELECT *
            FROM connection_request
            WHERE (from_id = $1 AND to_id = $2)
                OR (from_id = $2 AND to_id = $1)
        ;`;
        let values = [fromId, toId];
        let result = await client.query(query, values);

        if (result.rowCount) {
            res.status(400).json({
                success: false,
                message: "Connection request already sent to you"
            });
            return;
        }

        query = `
            INSERT
            INTO connection_request (from_id, to_id, created_at)
            VALUES ($1, $2, NOW())
        ;`;
        values = [fromId, toId];
        await client.query(query, values);

        res.status(200).json({
            success: true,
            message: "Create connection request successful."
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Failed to create connection request: ${error.message}`
        });
    }
}

const getConnectionRequests = async(req, res) => {
    try {
        req = createDummyPayload(req);
        const toId = req.user.userId;

        const query = `
            SELECT id, username, connection_request.created_at
            FROM connection_request
                JOIN users ON (connection_request.from_id = users.id)
            WHERE connection_request.to_id = $1
            ORDER BY created_at DESC;
        `;
        const values = [toId];
        const result = await client.query(query, values);
        
        res.status(200).json({
            success: true,
            message: "Get connection requests successful",
            data: result.rows
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Failed to get connection requests: ${error.message}`
        });
    }
}

const respondToConnectionRequest = (req, res, next) => {
    if (req.body.action === "accept") { // need to handle invalid action
        next = acceptConnectionRequest;
    } else {
        next = declineConnectionRequest;
    }
    next(req, res);
}

const acceptConnectionRequest = async (req, res) => {
    try {
        req = createDummyPayload(req);
        const fromId = req.body.fromId;
        const toId = req.user.userId;
    
        let query = `
            DELETE
            FROM connection_request
            WHERE from_id = $1 AND to_id = $2;
        `;
        const values = [fromId, toId]
        await client.query(query, values);
        
        query = `
            INSERT
            INTO connection (from_id, to_id, created_at)
            VALUES
                ($1, $2, NOW()),
                ($2, $1, NOW());
        `;
        await client.query(query, values);

        res.status(200).json({
            success: true,
            message: "Accept connection request successful",
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Failed to accept connection request: ${error.message}`,
        });
    }
}


const declineConnectionRequest = async (req, res) => {
    try {
        req = createDummyPayload(req);
        const fromId = req.body.fromId;
        const toId = req.user.userId;
    
        const query = `
            DELETE
            FROM connection_request
            WHERE from_id = $1 AND to_id = $2;
        `;
        const values = [fromId, toId]
        await client.query(query, values);

        res.status(200).json({
            success: true,
            message: "Decline connection request successful",
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Failed to decline connection request: ${error.message}`,
        });
    }
}

const getConnections = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
    
        const query = `
            SELECT id, username, connection.created_at
            FROM connection
                JOIN users ON (connection.to_id = users.id)
            WHERE connection.from_id = $1
            ORDER BY created_at DESC;
        `;
        const values = [userId];
        const result = await client.query(query, values);

        res.status(200).json({
            success: true,
            message: "Get connections successful",
            data: result.rows
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Failed to get connections: ${error.message}`,
        });
    }
}

const deleteConnection = async (req, res) => {
    
    req = createDummyPayload(req);
    const userId1 = parseInt(req.params.userId);
    const userId2 = parseInt(req.user.userId);

    try {
        const query = `
            DELETE
            FROM connection
            WHERE
                (from_id = $1 AND to_id = $2)
                OR (from_id = $2 AND to_id = $1);
        `;
        const values = [userId1, userId2];
        await client.query(query, values);

        res.status(200).json({
            success: true,
            message: "Delete connection successful",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Failed to delete connection: ${error.message}`,
        });
    }
}

export {
    createConnectionRequest,
    getConnectionRequests,
    respondToConnectionRequest,
    getConnections,
    deleteConnection
};
