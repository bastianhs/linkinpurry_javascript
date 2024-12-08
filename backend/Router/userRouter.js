import express from "express";
import { getUsers } from "../Controller/userController.js";
import {authenticate} from "../Middleware/authenticate.js";

const router = express.Router();
router.get("/", authenticate, getUsers);
export default router;