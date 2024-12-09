import express from "express";
import {
    createConnectionRequest,
    getConnectionRequests,
    respondToConnectionRequest,
} from "../Controller/connectionController.js";
import {authenticate} from "../Middleware/authenticate.js";
import { connectionRequestValidator,connectionResponseValidator } from "../Middleware/Validator/connectionValidator.js";
const router = express();
// connectionRequestRouter.js  
/**
 * @swagger
 * tags:
 *   name: Connection Requests
 *   description: Connection request management endpoints
 * 
 * /api/connection-requests:
 *   get:
 *     summary: Get connection requests
 *     tags: [Connection Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of connection requests
 *   post:
 *     summary: Create connection request
 *     tags: [Connection Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - toId
 *             properties:
 *               toId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Connection request created
 *   put:
 *     summary: Respond to connection request
 *     tags: [Connection Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fromId
 *               - status
 *             properties:
 *               fromId:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [accept, reject]
 *     responses:
 *       200:
 *         description: Connection request updated
 */

// Protected routes
router.post("/", authenticate,connectionRequestValidator, createConnectionRequest);
router.get("/", authenticate, getConnectionRequests);
router.put("/", authenticate,connectionResponseValidator, respondToConnectionRequest);

export default router;