import express from "express";
import {
    getConnection,
    getConnections,
    deleteConnection,
    getUserConnection,
    isConnected,
} from "../Controller/connectionController.js";
import {authenticate} from "../Middleware/authenticate.js";
// import authenticate from "../Middleware/authenticate.js";

const router = express();

// connectionRouter.js
/**
 * @swagger
 * tags:
 *   name: Connections
 *   description: Connection management endpoints
 * 
 * /api/connections:
 *   get:
 *     summary: Get user connections
 *     tags: [Connections]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of connections
 * 
 * /api/connections/user:
 *   get:
 *     summary: Get specific user connection
 *     tags: [Connections]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Connection details
 * 
 * /api/connections/{userId}:
 *   delete:
 *     summary: Delete connection
 *     tags: [Connections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Connection deleted successfully
 */

router.get("/user", authenticate,getUserConnection);
router.get("/:userId", getConnections);
router.delete("/:userId", authenticate, deleteConnection);
router.get("/", authenticate,getConnection);
router.delete("/:userId", deleteConnection);
router.get("/status/:id", authenticate, isConnected);


export default router;
