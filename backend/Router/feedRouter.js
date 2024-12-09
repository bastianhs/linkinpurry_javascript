import express from "express";
import { authenticate } from "../Middleware/authenticate.js";
import feedController from "../Controller/feedController.js";

const router = express();

router.get("/", authenticate, feedController.getFeed);
router.post("/", authenticate, feedController.createFeed);
router.put("/:post_id", authenticate, feedController.updateFeed);
router.delete("/:post_id", authenticate, feedController.deleteFeed);

export default router;
