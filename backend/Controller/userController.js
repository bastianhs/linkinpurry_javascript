import bcrypt from "bcrypt";
import database from "../database/db_connector.js";

const {client} = database;
export async function getProfile(id) {
    try {
        const query = 'SELECT * FROM users WHERE id = $1';
        const values = [id];
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

export async function updateProfile(id, username, email, password) {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query =
        "UPDATE users SET email = $1, password_hash = $2, updated_at = NOW(), username = $3 WHERE id = $4 RETURNING *";
        const values = [email, hashedPassword, username, id];
        const result = await client.query(query, values);
        return result.rows;
    } catch (error) {
        throw new Error(`Failed to update profile: ${error.message}`);
    }
}

export async function getUsers(keyword) {
    try {
        if (keyword === undefined) {
            const query = 'SELECT username FROM users'; // later add profile_photo_path
            const result = await client.query(query);
            return result.rows;
        }

        const query = 'SELECT username FROM users WHERE username ILIKE $1'; // later add profile_photo_path
        const values = [`%${keyword}%`];
        const result = await client.query(query, values);
        return result.rows;

    } catch (error) {
        throw new Error(`Failed to get users: ${error.message}`);
    }
}
