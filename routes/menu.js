import express from "express";
import { getMenu, deleteMenuItem } from "../controllers/menu.js";

const router = express.Router();

//GET
router.get("/", getMenu);

// Delete 
router.delete("/:id", deleteMenuItem);

export default router;