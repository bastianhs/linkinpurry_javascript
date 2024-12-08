import express from "express";
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

// Root route
// router.get("/", (req, res) => {
//   res.send("Hello World");
// });

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
router.get("/:id",profileAuthenticate, async (req, res) => {
  try {
    const { id } = req.params; // get parameter called id
    const profile = await getProfile(id);
    const loggedId = req.user?.userId || null;
    if (!profile.length) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
        body: null,
      });
    }

    // Assuming `getProfile` returns an array, pick the first element
    const profileData = profile[0];

    // Construct the desired JSON format
    if (!loggedId) {
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
    }else {
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
    console.log(req.body);

    const newProfile = await createProfile(name, email, password);
    res.status(201).json(newProfile);
  } catch (error) {
    console.error("Profile creation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update an existing profile
router.put("/:id", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const { id } = req.params;

    const updatedProfile = await updateProfile(id, username, email, password);
    res.json(updatedProfile);
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(400).json({ error: "Internal server error" });
  }
});

export default router;