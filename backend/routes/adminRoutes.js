import express from "express";
import { loginAdmin } from "../controllers/adminController.js";

const router = express.Router();

// ✅ Admin Login Route
router.post("/login", loginAdmin);

export default router;
