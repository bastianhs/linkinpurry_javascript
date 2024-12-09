import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import {
	getProfile,
	createProfile,
	getOtherProfile,
} from "../Controller/userController.js";
import {
	authenticate,
	profileAuthenticate,
} from "../Middleware/authenticate.js";
import connectionModel from "../Model/connectionModel.js";
import feedModel from "../Model/feedModel.js";
const router = express.Router();

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Get profile by username
const serializeBigInt = (data) => {
	if (Array.isArray(data)) {
		return data.map((item) => serializeBigInt(item));
	}
	if (typeof data === "object" && data !== null) {
		return Object.fromEntries(
			Object.entries(data).map(([key, value]) => [key, serializeBigInt(value)])
		);
	}
	if (typeof data === "bigint") {
		return Number(data);
	}
	return data;
};

router.get("/",authenticate, profileAuthenticate, async (req, res) => {
	try {
		const id = req.user.userId; // get parameter called id

		if (!id || isNaN(id)) {
			return res.status(400).json({
				success: false,
				message: "Invalid user ID format",
				body: null,
			});
		}

		const profile = await getProfile(id);
		const loggedId = req.user?.userId || null;
		if (!profile.length) {
			return res.status(404).json({
				success: false,
				message: "Profile not found",
				body: null,
			});
		}
		const profileData = profile[0];
		if (!oggedId) {
			const responseData = {
				success: true,
				message: "Profile fetched successfully",
				body: {
					created_at: profileData.created_at || "",
					updated_at: profileData.updated_at || "",
					email: profileData.email || "",
					username: profileData.username || "",
					name: profileData.name || "",
					work_history: profileData.work_history || "",
					skills: profileData.skills || "",
					connection_count: profileData.connection_count || 0,
					profile_photo: profileData.profile_photo || "",
					relevant_posts: profileData.relevant_posts || [], // Ensure this is an array
				},
			};
			return res.json(responseData);
		} else {
			const responseData = {
				success: true,
				message: "Profile fetched successfully",
				body: {
					created_at: profileData.created_at || "",
					updated_at: profileData.updated_at || "",
					username: profileData.username || "",
					name: profileData.name || "",
					work_history: profileData.work_history || "",
					skills: profileData.skills || "",
					connection_count: profileData.connection_count || 0,
					profile_photo: profileData.profile_photo || "",
					email: profileData.email || "",
				},
			};
			return res.json(responseData);
		}
	} catch (error) {
		console.error("Profile fetch error:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
			body: null,
		});
	}
});


// Create a new profile
router.post("/", async (req, res) => {
	try {
		const { name, email, password } = req.body;
		// console.log(req.body);

		const newProfile = await createProfile(name, email, password);
		res.status(201).json(newProfile);
	} catch (error) {
		console.error("Profile creation error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Update an existing profile
router.put("/:id", authenticate, upload.single('profile_photo'), async (req, res) => {
  try {
    const logged_id = req.user?.userId || null;
    const { username, email, password, work_history, skills } = req.body;
    const { id } = req.params;
    const profile_photo = req.file ? req.file.path : null;

    if (logged_id != id) {
      return res.status(401).json({ message: "not your account, please login." });
    }

    const updatedProfile = await updateProfile(id, username, email, password, work_history, skills, profile_photo);
    res.json(updatedProfile);
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(400).json({ error: "Internal server error" });
  }
});
router.get("/other/:username", profileAuthenticate, async (req, res) => {
	try {
		const { username } = req.params;

    const updatedProfile = await updateProfile(id, full_name, username, email, password, work_history, skills, profile_photo);
    res.json(updatedProfile);
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(400).json({ error: "Internal server error" });
  }try{
		if (!username) {
			console.log(!username);
			return res.status(400).json({
				success: false,
				message: "Invalid user username format",
				body: null,
			});
		}
		const profile = await getOtherProfile(username);
		const loggedId = req.user?.userId || null;

		if (!profile.length) {
			return res.status(404).json({
				success: false,
				message: "Profile not found",
				body: null,
			});
		}

		const profileData = profile[0];
		const profileConnection = await connectionModel.getConnectionsByFromId(
			profileData.id
		);
		const isConnected = !!profileConnection.find(
			(connection) => Number(connection.id) === Number(loggedId)
		);
		console.log(isConnected);
		let profileFeeds = await feedModel.getOtherFeed(profileData.id);
		if (profileFeeds || profileFeeds.length !== 0) {
			profileFeeds = profileFeeds.map((feed) => ({
				...feed,
				id: Number(feed.id),
				user_id: Number(feed.user_id),
			}));
		}

		if (loggedId) {
			const responseData = {
				success: true,
				message: "Profile fetched successfully",
				body: {
					created_at: profileData.created_at || "",
					updated_at: profileData.updated_at || "",
					email: profileData.email || "",
					username: profileData.username || "",
					name: profileData.full_name || "",
					work_history: profileData.work_history || "",
					skills: profileData.skills || "",
					connection_count: profileConnection.length || 0,
					profile_photo: profileData.profile_photo_path || "",
					relevant_posts: profileFeeds || [],
					connection_status: isConnected,
				},
			};
			return res.json(responseData);
		} else {
			const responseData = {
				success: true,
				message: "Profile fetched successfully",
				body: {
					created_at: profileData.created_at || "",
					updated_at: profileData.updated_at || "",
					username: profileData.username || "",
					name: profileData.full_name || "",
					work_history: profileData.work_history || "",
					skills: profileData.skills || "",
					connection_count: profileConnection.length || 0,
					profile_photo: profileData.profile_photo_path || "",
					email: profileData.email || "",
					connection_status: false,
				},
			};
			return res.json(responseData);
		}
	} catch (error) {
		console.error("Profile fetch error:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
			body: null,
		});
	}
});

router.get("/me", authenticate,profileAuthenticate, async (req, res) => {
	try {
		const id = req.user.userId; 

		if (!id) {
			console.log(!id);
			return res.status(400).json({
				success: false,
				message: "Invalid user id format",
				body: null,
			});
		}
		const profile = await getProfile(id);
		if (!profile.length) {
			return res.status(404).json({
				success: false,
				message: "Profile not found",
				body: null,
			});
		}

		const profileData = profile[0];
		const profileConnection = await connectionModel.getConnectionsByFromId(
			profileData.id
		);

		if (id) {
			const responseData = {
				success: true,
				message: "Profile fetched successfully",
				body: {
					created_at: profileData.created_at || "",
					updated_at: profileData.updated_at || "",
					email: profileData.email || "",
					username: profileData.username || "",
					name: profileData.full_name || "",
					work_history: profileData.work_history || "",
					skills: profileData.skills || "",
					connection_count: profileConnection.length || 0,
					profile_photo: profileData.profile_photo_path || "",
				},
			};
			return res.json(responseData);
		} else {
			const responseData = {
				success: false,
				message: "Profile fetched successfully",
				body: {
					created_at: profileData.created_at || "",
					updated_at: profileData.updated_at || "",
					username: profileData.username || "",
					name: profileData.full_name || "",
					work_history: profileData.work_history || "",
					skills: profileData.skills || "",
					connection_count: profileConnection.length || 0,
					profile_photo: profileData.profile_photo_path || "",
					email: profileData.email || "",
					connection_status: false,
				},
			};
			return res.json(responseData);
		}
	} catch (error) {
		console.error("Profile fetch error:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
			body: null,
		});
	}
});

export default router;
