import express from "express";
import { getMenu } from "../controllers/menu.js";

const router = express.Router();

//GET
router.get("/", getMenu);

export default router;