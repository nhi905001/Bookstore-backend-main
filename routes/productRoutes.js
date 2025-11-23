import express from "express";
import {
  getProducts,
  getProductById,
  getRelatedProducts,
  getProductByName,
  getCategories,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getProducts);
router.get("/categories", getCategories);
router.get("/category/:categoryName", getProductsByCategory);
router.get("/search", getProductByName);
router.get("/:id", getProductById);
router.get("/:id/related", getRelatedProducts);

// Admin routes
router.post("/", protect, admin, createProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

export default router;
