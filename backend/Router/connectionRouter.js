import express from "express";
import {
    getConnections,
    deleteConnection,
} from "../Controller/connectionController.js";
import {authenticate} from "../Middleware/authenticate.js";

const router = express();
router.get("/:userId", getConnections);
router.delete("/:userId", authenticate, deleteConnection);

export default router;
