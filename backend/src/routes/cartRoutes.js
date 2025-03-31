import express from "express";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   GET /api/cart
// @desc    Get user cart
// @access  Private
router.get("/", protect, (req, res) => {
  res.json({ message: "Get user cart" });
});

// @route   POST /api/cart
// @desc    Add item to cart
// @access  Private
router.post("/", protect, (req, res) => {
  res.status(201).json({ message: "Add item to cart" });
});

// @route   PUT /api/cart/:id
// @desc    Update cart item
// @access  Private
router.put("/:id", protect, (req, res) => {
  res.json({ message: `Update cart item ${req.params.id}` });
});

// @route   DELETE /api/cart/:id
// @desc    Remove item from cart
// @access  Private
router.delete("/:id", protect, (req, res) => {
  res.json({ message: `Remove cart item ${req.params.id}` });
});

// @route   DELETE /api/cart
// @desc    Clear cart
// @access  Private
router.delete("/", protect, (req, res) => {
  res.json({ message: "Clear cart" });
});

export default router;
