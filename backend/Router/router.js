import express from "express";
import {
  getProfile,
  createProfile,
  updateProfile,
} from "../Controller/userController.js";

const router = express.Router();

// Root route
// router.get("/", (req, res) => {
//   res.send("Hello World");
// });

// Get profile by username
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params; //get parameter called username
    const profile = await getProfile(id);

    if (!profile.length) {
      return res.status(404).json({ error: "Profile not found" });
    }

    console.table(profile);
    res.json(profile);

  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ error: "Internal server error" });
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