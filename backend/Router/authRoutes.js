import express from "express";
import authentication from "../Controller/authControllers.js";
import {authenticate} from "../Middleware/authenticate.js";

const router = express.Router();

router.post("/login", authentication.login);
router.post("/register", authentication.register);
router.get("/protected", authenticate, (req, res) => {
	res.json({ message: "Welcome to the protected route!", user: req.user });
});

export default router; 
