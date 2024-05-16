import express from "express";
import { createOrder, getTodayOrders, updateStatus } from "../controllers/order.js";
import { verifyToken, verifyAdminToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", createOrder); // users
router.get("/today", getTodayOrders); //admins
router.put("/status/:id", updateStatus); //admins

export default router;