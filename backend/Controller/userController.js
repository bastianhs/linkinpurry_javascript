import bcrypt from "bcrypt";
import database from "../database/db_connector.js";
import userModel from "../Model/userModel.js";
import path from "path";
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

		const user = result.rows[0];
		// Add the base URL to the profile photo path
		if (user.profile_photo_path) {
			user.profile_photo_url = `localhost:4001/uploads/${path.basename(user.profile_photo_path)}`;
		}

		return user;
	} catch (error) {
		if (error.message.includes("invalid input syntax")) {
			throw new Error("Invalid user ID format");
		}
		throw new Error(`Failed to fetch profile: ${error.message}`);
	}
}
export async function getOtherProfile(username) {
	try {
		if (!username) {
			throw new Error("Invalid username format");
		}
		const userId = username;

		const query = "SELECT * FROM users WHERE username = $1";
		const values = [userId];
		const result = await client.query(query, values);
		if (result.rows.length === 0) {
			throw new Error("User not found");
		}
		
		// if (user.profile_photo_path) {
		// 	user.profile_photo_url = `localhost:4001/uploads/${path.basename(user.profile_photo_path)}`;
		// }
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

export async function updateProfile(id,full_name, username, email, password, work_history, skills, profile_photo) {
	try {
	  const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
	  const query = `
		UPDATE users
		SET 
		  username = COALESCE($1, username),
		  email = COALESCE($2, email),
		  full_name = COALESCE($8, full_name),
		  password_hash = COALESCE($3, password_hash),
		  work_history = COALESCE($4, work_history),
		  skills = COALESCE($5, skills),
		  profile_photo_path = COALESCE($6, profile_photo_path),
		  updated_at = NOW()
		  
		WHERE id = $7
		RETURNING *`;
	  const values = [username, email, hashedPassword, work_history, skills, profile_photo, id, full_name];
	  const result = await client.query(query, values);
	  return result.rows[0];
	} catch (error) {
	  throw new Error(`Failed to update profile: ${error.message}`);
	}
}
export const updateProfileData = async (req, res) => {
	try {
		console.log("Updated profile:");
        const userId = req.user.userId;
        const { username, email, password, work_history, skills, full_name, profile_photo } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: "Invalid user ID",
            });
        }

        const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
        const updateData = {
            username,
            email,
            password: hashedPassword,
            work_history,
            skills,
            full_name,
            profile_photo_path: profile_photo,
        };
		const updatedProfile = await userModel.updateProfile(userId, updateData);
		// console.log("Updated sini:", updatedProfile);
		return res.status(200).json({
			success: true,
			message: "Profile updated successfully",
			data: {
				id: Number(updatedProfile.id),
				username: updatedProfile.username,
				email: updatedProfile.email,
				full_name: updatedProfile.full_name,
				work_history: updatedProfile.work_history,
				skills: updatedProfile.skills,
				updated_at: updatedProfile.updated_at,
			},
		});
	} catch (error) {
		console.error("Profile update error:", error);
		return res.status(500).json({
			success: false,
			error: "Failed to update profile",
		});
	}
};

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
export const updateProfilePhoto = async (req, res) => {
    try {
        const userId = req.user.userId;
        const profile_photo = req.file ? req.file.filename : null;

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: "Invalid user ID",
            });
        }

        if (!profile_photo) {
            return res.status(400).json({
                success: false,
                error: "No photo uploaded",
            });
        }
		const relativePath = `uploads/${profile_photo}`;
        const query = `
            UPDATE users
            SET profile_photo_path = $1, updated_at = NOW()
            WHERE id = $2
            RETURNING *`;
        const values = [relativePath, userId];
        const result = await client.query(query, values);

        return res.status(200).json({
            success: true,
            message: "Profile photo updated successfully",
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Profile photo update error:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to update profile photo",
        });
    }
};
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
