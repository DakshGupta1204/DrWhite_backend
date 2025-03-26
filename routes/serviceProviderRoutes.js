const express = require("express");
const router = express.Router();
const serviceProviderController = require("../controllers/serviceProviderController");
const { authenticateToken, isAdmin } = require("../middleware/authMiddleware");

// Public routes
router.get("/category/:categoryId", serviceProviderController.getServiceProvidersByCategory);
router.get("/nearby", serviceProviderController.getServiceProvidersByLocation);
router.get("/:id", serviceProviderController.getServiceProviderById);

// Admin routes
router.get("/", authenticateToken, isAdmin, serviceProviderController.getAllServiceProviders);
router.post("/", authenticateToken, isAdmin, serviceProviderController.createServiceProvider);
router.put("/:id", authenticateToken, isAdmin, serviceProviderController.updateServiceProvider);
router.delete("/:id", authenticateToken, isAdmin, serviceProviderController.deleteServiceProvider);

module.exports = router; 