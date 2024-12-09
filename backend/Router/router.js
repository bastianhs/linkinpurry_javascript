import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import {
  getProfile,
  createProfile,
  updateProfile,
} from "../Controller/userController.js";
import {
  authenticate,
  profileAuthenticate
} from "../Middleware/authenticate.js";

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
router.get("/me", authenticate, async (req, res) => {
  const loggedId = req.user?.userId || null;
  if (!loggedId) {
    return res.status(401).json({ message: "Unauthorized, please login." });
  }
  res.status(200).json({
    success: true,
    message: "User fetched successfully.",
    body: {
      userId: loggedId,
    },
  });
});

router.get("/:id", profileAuthenticate, async (req, res) => {
  try {
    const { id } = req.params; // get parameter called id

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
        body: null
      });
    }

    const profile = await getProfile(id);
    const loggedId = req.user?.userId || null;
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
        body: null,
      });
    }

    // Construct the desired JSON format
    const responseData = {
      success: true,
      message: "Profile fetched successfully",
      body: {
        created_at: profile.created_at || "",
        updated_at: profile.updated_at || "",
        email: profile.email || "",
        username: profile.username || "",
        name: profile.name || "",
        work_history: profile.work_history || "",
        skills: profile.skills || "",
        connection_count: profile.connection_count || 0,
        profile_photo: profile.profile_photo_url || "",
      },
    };
    return res.json(responseData);
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
    console.log(req.body);

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

export default router;