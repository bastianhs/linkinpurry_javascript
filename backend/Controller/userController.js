import bcrypt from "bcrypt";
import database from "../database/db_connector.js";
const {client} = database;
export async function getProfile(username) {
    try {
        const query = 'SELECT * FROM users WHERE username = $1';
        const values = [username];
        const result = await client.query(query, values);
        return result.rows;
    } catch (error) {
        throw new Error(`Failed to fetch profile: ${error.message}`);
    }
}

export async function createProfile(name, email, password) {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query =
        "INSERT INTO users (username, email, password_hash, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *";
        const values = [name, email, hashedPassword];
        const result = await client.query(query, values);
        return result.rows;
    } catch (error) {
        throw new Error(`Failed to create profile: ${error.message}`);
    }
}

export async function updateProfile(username, email, password) {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query =
        "UPDATE users SET email = $1, password_hash = $2, updated_at = NOW() WHERE username = $3 RETURNING *";
        const values = [email, hashedPassword, username];
        const result = await client.query(query, values);
        return result.rows;
    } catch (error) {
        throw new Error(`Failed to update profile: ${error.message}`);
    }
}
