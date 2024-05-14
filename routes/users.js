import express from "express";
import { login, register, update } from "../controllers/user.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.put("/:id", verifyToken, update);

export default router;