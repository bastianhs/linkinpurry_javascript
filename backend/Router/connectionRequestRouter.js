import express from "express";
import {
    createConnectionRequest,
    getConnectionRequests,
    respondToConnectionRequest,
} from "../Controller/connectionController.js";
import {authenticate} from "../Middleware/authenticate.js";

const router = express();
router.post("/", authenticate, createConnectionRequest);
router.get("/", authenticate, getConnectionRequests);
router.put("/", authenticate, respondToConnectionRequest);

// Protected routes
router.post("/", authenticate, createConnectionRequest);
router.get("/", authenticate, getConnectionRequests);
router.put("/", authenticate, respondToConnectionRequest);

export default router;