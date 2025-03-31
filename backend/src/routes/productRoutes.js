import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get("/", (req, res) => {
  res.json({ message: "Get all products" });
});

// @route   GET /api/products/:id
// @desc    Get product by ID
// @access  Public
router.get("/:id", (req, res) => {
  res.json({ message: `Get product ${req.params.id}` });
});

// @route   POST /api/products
// @desc    Create a product
// @access  Private/Admin
router.post("/", protect, admin, (req, res) => {
  res.status(201).json({ message: "Create product" });
});

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private/Admin
router.put("/:id", protect, admin, (req, res) => {
  res.json({ message: `Update product ${req.params.id}` });
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private/Admin
router.delete("/:id", protect, admin, (req, res) => {
  res.json({ message: `Delete product ${req.params.id}` });
});

export default router;
