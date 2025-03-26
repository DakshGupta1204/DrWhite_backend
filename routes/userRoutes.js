const express = require("express");
const router = express.Router();
const { 
  getUserProfile, 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser 
} = require("../controllers/userController");
const { authenticateToken, isAdmin } = require("../middleware/authMiddleware");

// User routes
router.get("/profile", authenticateToken, getUserProfile);

// Admin routes
router.get("/", authenticateToken, isAdmin, getAllUsers);
router.get("/:id", authenticateToken, isAdmin, getUserById);
router.put("/:id", authenticateToken, isAdmin, updateUser);
router.delete("/:id", authenticateToken, isAdmin, deleteUser);

module.exports = router;
