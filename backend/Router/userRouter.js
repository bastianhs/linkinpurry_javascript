// import express from "express";
// import multer from "multer";
// import path from "path";
// import fs from "fs";
// import { fileURLToPath } from 'url';
// import {
// 	getUsers,
// 	getProfile,
//     updateProfileData,
//     updateProfilePhoto,
// } from "../Controller/userController.js";
// import { authenticate } from "../Middleware/authenticate.js";
// import { createRateLimiter } from "../Middleware/rateLimiter.js";
// import { requestLogger } from "../Middleware/requestLogger.js";
// import { updateProfileValidator } from "../Middleware/Validator/userValidator.js";

// const router = express.Router();
// const apiLimiter = createRateLimiter(15 * 60 * 1000, 100);
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const uploadsDir = path.join(__dirname, '../uploads');
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir);
// }

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadsDir);
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// const upload = multer({ storage: storage });
// /**
//  * @swagger
//  * tags:
//  *   name: Users
//  *   description: User management endpoints
//  *
//  * /api/users:
//  *   get:
//  *     summary: Get all users with pagination and filters
//  *     tags: [Users]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: query
//  *         name: search
//  *         schema:
//  *           type: string
//  *         description: Search users by name or username
//  *       - in: query
//  *         name: page
//  *         schema:
//  *           type: integer
//  *         description: Page number for pagination
//  *       - in: query
//  *         name: limit
//  *         schema:
//  *           type: integer
//  *         description: Number of users per page
//  *       - in: query
//  *         name: sortBy
//  *         schema:
//  *           type: string
//  *           enum: [name, username, created_at]
//  *         description: Sort field
//  *       - in: query
//  *         name: order
//  *         schema:
//  *           type: string
//  *           enum: [asc, desc]
//  *         description: Sort order
//  *     responses:
//  *       200:
//  *         description: List of users with pagination metadata
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                 message:
//  *                   type: string
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     users:
//  *                       type: array
//  *                       items:
//  *                         $ref: '#/components/schemas/User'
//  *                     pagination:
//  *                       type: object
//  *                       properties:
//  *                         total:
//  *                           type: integer
//  *                         pages:
//  *                           type: integer
//  *                         currentPage:
//  *                           type: integer
//  *                         limit:
//  *                           type: integer
//  *
//  * /api/users/me:
//  *   get:
//  *     summary: Get current user profile
//  *     tags: [Users]
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: Current user profile data
//  *
//  * /api/users/profile:
//  *   put:
//  *     summary: Update user profile
//  *     tags: [Users]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - name
//  *               - headline
//  *             properties:
//  *               name:
//  *                 type: string
//  *               headline:
//  *                 type: string
//  *               bio:
//  *                 type: string
//  *               location:
//  *                 type: string
//  *               work_history:
//  *                 type: string
//  *               skills:
//  *                 type: string
//  *               profile_photo:
//  *                 type: string
//  *                 format: binary
//  *     responses:
//  *       200:
//  *         description: Profile updated successfully
//  *       400:
//  *         description: Invalid input data
//  *       401:
//  *         description: Unauthorized
//  */

// // Apply global middleware
// router.use(requestLogger);
// router.use(apiLimiter);

// // Public routes
// router.get("/", authenticate, getUsers);

// // Protected routes
// router.get("/me", authenticate, getProfile);
// router.put("/update", authenticate, updateProfileValidator , updateProfileData);
// router.put("/update-photo", authenticate,  updateProfilePhoto);

// export default router;
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import {
    getUsers,
    getProfile,
    updateProfileData,
    updateProfilePhoto,
} from "../Controller/userController.js";
import { authenticate } from "../Middleware/authenticate.js";
import { createRateLimiter } from "../Middleware/rateLimiter.js";
import { requestLogger } from "../Middleware/requestLogger.js";
import { updateProfileValidator } from "../Middleware/Validator/userValidator.js";

const router = express.Router();
const apiLimiter = createRateLimiter(15 * 60 * 1000, 100);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });
router.use(requestLogger);
router.use(apiLimiter);

// Public routes
router.get("/", authenticate, getUsers);

// Protected routes
router.get("/me", authenticate, getProfile);
router.put("/update", authenticate, updateProfileValidator , updateProfileData);
router.put("/update-photo", authenticate, upload.single('profile_photo'), updateProfilePhoto);

export default router;