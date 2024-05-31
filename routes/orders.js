import express from "express";
import { createOrder, getWorkingOrders, updateStatus, getUserOrders } from "../controllers/order.js";
import { verifyToken, verifyAdminToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", verifyToken, createOrder); // users
router.get("/all", verifyAdminToken, getWorkingOrders); //admins
router.get("/all/:id", verifyToken, getUserOrders); // users
router.put("/status/:id", verifyAdminToken, updateStatus); //admins

export default router;