import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   GET /api/orders
// @desc    Get all orders (admin only)
// @access  Private/Admin
router.get("/", protect, admin, (req, res) => {
  res.json({ message: "Get all orders" });
});

// @route   GET /api/orders/myorders
// @desc    Get logged in user orders
// @access  Private
router.get("/myorders", protect, (req, res) => {
  res.json({ message: "Get my orders" });
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get("/:id", protect, (req, res) => {
  res.json({ message: `Get order ${req.params.id}` });
});

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private
router.post("/", protect, (req, res) => {
  res.status(201).json({ message: "Create new order" });
});

// @route   PUT /api/orders/:id/pay
// @desc    Update order to paid
// @access  Private
router.put("/:id/pay", protect, (req, res) => {
  res.json({ message: `Update order ${req.params.id} to paid` });
});

// @route   PUT /api/orders/:id/deliver
// @desc    Update order to delivered
// @access  Private/Admin
router.put("/:id/deliver", protect, admin, (req, res) => {
  res.json({ message: `Update order ${req.params.id} to delivered` });
});

export default router;
