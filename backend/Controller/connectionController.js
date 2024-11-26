import database from "../database/db_connector.js";

const {client} = database;

export async function createConnectionRequest(from_id, to_id) {
    try {
        let query = `
            SELECT
            FROM connection_request
            WHERE from_id = $1 AND to_id = $2
        ;`;
        let values = [to_id, from_id];
        let result = await client.query(query, values);

        if (result.rowCount) {
            throw new Error(`Connection request already sent to you`);
        }

        query = `
            INSERT
            INTO connection_request (from_id, to_id, created_at)
            VALUES ($1, $2, NOW())
        ;`;
        values = [from_id, to_id];
        await client.query(query, values);

    } catch (error) {
        throw new Error(`Failed to create connection request: ${error.message}`);
    }
}

export async function getConnectionRequests(to_id) {
    try {
        const query = `
            SELECT id, username, connection_request.created_at
            FROM connection_request
                JOIN users ON (connection_request.from_id = users.id)
            WHERE connection_request.to_id = $1
            ORDER BY created_at DESC;
        `;
        const values = [to_id];
        const result = await client.query(query, values);
        return result.rows;

    } catch (error) {
        throw new Error(`Failed to get connection requests: ${error.message}`);
    }
}

export async function acceptConnectionRequest(from_id, to_id) {
    try {
        let query = `
            DELETE
            FROM connection_request
            WHERE from_id = $1 AND to_id = $2;
        `;
        const values = [from_id, to_id]
        await client.query(query, values);
        
        query = `
            INSERT
            INTO connection (from_id, to_id, created_at)
            VALUES
                ($1, $2, NOW()),
                ($2, $1, NOW());
        `;
        await client.query(query, values);
        
    } catch (error) {
        throw new Error(`Failed to accept connection request: ${error.message}`);
    }
}

export async function declineConnectionRequest(from_id, to_id) {
    try {
        const query = `
            DELETE
            FROM connection_request
            WHERE from_id = $1 AND to_id = $2;
        `;
        const values = [from_id, to_id]
        await client.query(query, values);
        
    } catch (error) {
        throw new Error(`Failed to decline connection request: ${error.message}`);
    }
}

export async function getConnections(user_id) {
    try {
        const query = `
            SELECT id, username, connection.created_at
            FROM connection
                JOIN users ON (connection.to_id = users.id)
            WHERE connection.from_id = $1
            ORDER BY created_at DESC;
        `;
        const values = [user_id];
        const result = await client.query(query, values);
        return result.rows;

    } catch (error) {
        throw new Error(`Failed to get connections: ${error.message}`);
    }
}

export async function deleteConnection(from_id, to_id) {
    try {
        const query = `
            DELETE
            FROM connection
            WHERE
                (from_id = $1 AND to_id = $2)
                OR (from_id = $2 AND to_id = $1);
        `;
        const values = [from_id, to_id];
        await client.query(query, values);

    } catch (error) {
        throw new Error(`Failed to delete connection: ${error.message}`);
    }
}
