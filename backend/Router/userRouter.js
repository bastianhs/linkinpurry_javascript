import express from "express";
import {getUsers} from "../Controller/userController.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const {search} = req.query;

        // console.log(`search: ${search}`);
        const users = await getUsers(search);

        if (!users.length) {
            return res.status(404).json({ error: "Profile not found" });
        }

        // console.table(users);
        res.json(users);

    } catch (error) {
        // console.error("get users error:", error);
        res.status(500).json({ error: "get users error" });
    }
});

export default router;