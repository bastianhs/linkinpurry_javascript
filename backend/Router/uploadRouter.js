// import express from "express";
// // import { upload, processImage } from "../Util/imageHandler.js";
// import { authenticate } from "../Middleware/authenticate.js";

// const router = express.Router();

// router.post("/profile-photo", authenticate, async (req, res) => {
// 	try {
// 		upload.single("image")(req, res, async (err) => {
// 			if (err) {
// 				return res.status(400).json({ error: err.message });
// 			}

// 			if (!req.file) {
// 				return res.status(400).json({ error: "No image provided" });
// 			}

// 			const filename = `${req.user.userId}_${Date.now()}.jpg`;
// 			await processImage(req.file.buffer, filename);

// 			const imageUrl = `/uploads/profiles/medium_${filename}`;


// 			await prisma.users.update({
// 				where: { id: BigInt(req.user.userId) },
// 				data: { profile_photo_path: imageUrl },
// 			});

// 			res.json({
// 				success: true,
// 				imageUrl,
// 			});
// 		});
// 	} catch (error) {
// 		res.status(500).json({ error: "Failed to upload image" });
// 	}
// });

// export default router;
