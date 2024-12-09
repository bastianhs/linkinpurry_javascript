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
router.get("/user", authenticate,getUserConnection);
router.get("/:userId", getConnections);
router.delete("/:userId", authenticate, deleteConnection);
router.get("/", authenticate,getConnection);
router.delete("/:userId", deleteConnection);
router.get("/status/:id", authenticate, isConnected);


export default router;
