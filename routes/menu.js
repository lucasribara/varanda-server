import express from "express";
import { getMenu, deleteMenuItem } from "../controllers/menu.js";
import { verifyAdminToken } from "../middleware/auth.js";

const router = express.Router();

//GET
router.get("/", getMenu);

// Delete 
router.delete("/:id", verifyAdminToken, deleteMenuItem);

export default router;