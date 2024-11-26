import express from "express";
import {
    getConnections,
    deleteConnection,
} from "../Controller/connectionController.js";

const router = express();
router.get("/:userId", getConnections);
router.delete("/:userId", deleteConnection);

export default router;
