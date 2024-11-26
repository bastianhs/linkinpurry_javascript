import express from "express";
import {
    createConnectionRequest,
    getConnectionRequests,
    respondToConnectionRequest,
} from "../Controller/connectionController.js";

const router = express();
router.post("/", createConnectionRequest);
router.get("/", getConnectionRequests);
router.put("/", respondToConnectionRequest);

export default router;
