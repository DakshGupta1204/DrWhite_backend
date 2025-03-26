const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { authenticateToken, isAdmin } = require("../middleware/authMiddleware");

// Public routes
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);

// Admin routes
router.get("/admin/all", authenticateToken, isAdmin, categoryController.getAllCategoriesAdmin);
router.post("/", authenticateToken, isAdmin, categoryController.createCategory);
router.put("/:id", authenticateToken, isAdmin, categoryController.updateCategory);
router.delete("/:id", authenticateToken, isAdmin, categoryController.deleteCategory);

module.exports = router; 