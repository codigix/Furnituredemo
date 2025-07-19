import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  getOrders,
} from "../controllers/orderController.js";

const router = express.Router();

// ✅ User routes
router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/pay", protect, updateOrderToPaid);

// ✅ Admin routes (optional)
router.get("/", protect, getOrders);

export default router;
