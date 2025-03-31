import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get("/", (req, res) => {
  res.json({ message: "Get all categories" });
});

// @route   GET /api/categories/:id
// @desc    Get category by ID
// @access  Public
router.get("/:id", (req, res) => {
  res.json({ message: `Get category ${req.params.id}` });
});

// @route   POST /api/categories
// @desc    Create a category
// @access  Private/Admin
router.post("/", protect, admin, (req, res) => {
  res.status(201).json({ message: "Create category" });
});

// @route   PUT /api/categories/:id
// @desc    Update a category
// @access  Private/Admin
router.put("/:id", protect, admin, (req, res) => {
  res.json({ message: `Update category ${req.params.id}` });
});

// @route   DELETE /api/categories/:id
// @desc    Delete a category
// @access  Private/Admin
router.delete("/:id", protect, admin, (req, res) => {
  res.json({ message: `Delete category ${req.params.id}` });
});

export default router;
