import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   GET /api/reviews
// @desc    Get all reviews
// @access  Public
router.get("/", (req, res) => {
  res.json({ message: "Get all reviews" });
});

// @route   GET /api/reviews/product/:id
// @desc    Get reviews for a product
// @access  Public
router.get("/product/:id", (req, res) => {
  res.json({ message: `Get reviews for product ${req.params.id}` });
});

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Private
router.post("/", protect, (req, res) => {
  res.status(201).json({ message: "Create review" });
});

// @route   PUT /api/reviews/:id
// @desc    Update a review
// @access  Private
router.put("/:id", protect, (req, res) => {
  res.json({ message: `Update review ${req.params.id}` });
});

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private/Admin
router.delete("/:id", protect, admin, (req, res) => {
  res.json({ message: `Delete review ${req.params.id}` });
});

export default router;
