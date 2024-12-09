import bcrypt from "bcrypt";
import database from "../database/db_connector.js";
import userModel from "../Model/userModel.js";
// import { upload, processImage } from "../Util/imageHandler.js";

const { client } = database;

export async function getProfile(id) {
	try {
		if (!id || isNaN(id)) {
			throw new Error("Invalid user ID format");
		}
		const userId = BigInt(id);

		const query = "SELECT * FROM users WHERE id = $1";
		const values = [userId];
		const result = await client.query(query, values);

		if (result.rows.length === 0) {
			throw new Error("User not found");
		}
		return result.rows;
	} catch (error) {
		if (error.message.includes("invalid input syntax")) {
			throw new Error("Invalid user ID format");
		}
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

export async function getUsers(req, res) {
	try {
		const { search } = req.query;

		let users;
		if (search === undefined) {
			users = await userModel.getUsers();
		} else {
			users = await userModel.getUsersByUsernameSubstring(search);
		}

		const response = users.map((user) => ({
			id: Number(user.id),
			username: user.username,
			profile_photo_path: user.profile_photo_path,
		}));

		if (!response.length) {
			return res.status(404).json({
				errors: "No profiles found",
			});
		}

		return res.status(200).json({
			data: response,
		});
	} catch (error) {
		return res.status(500).json({
			errors: "Internal server error",
		});
	}
}
// export const updateProfileImage = async (req, res) => {
// 	try {
// 		upload.single("image")(req, res, async (err) => {
// 			if (err) {
// 				return res.status(400).json({ error: err.message });
// 			}

// 			const userId  = req.user.userId;
// 			const updates = { ...req.body };

// 			if (req.file) {
// 				const filename = `${userId}_${Date.now()}.jpg`;
// 				await processImage(req.file.buffer, filename);
// 				updates.profile_photo_path = `/uploads/profiles/medium_${filename}`;
// 			}

// 			const user = await prisma.users.update({
// 				where: { id: userId },
// 				data: updates,
// 			});

// 			res.json({ success: true, user });
// 		});
// 	} catch (error) {
// 		res.status(500).json({ error: "Failed to update profile" });
// 	}
// };
