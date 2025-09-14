const express = require("express");
const adminRouter = express.Router();
const adminController = require("../controller/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

adminRouter.get("/users", adminController.getUsers);
// Protect Admin Routes
adminRouter.use(authMiddleware, roleMiddleware(["admin"]));

// Users Management
adminRouter.put("/users/:id/block", adminController.blockUser);

// Donations Management
adminRouter.get("/donations", adminController.getDonations);
adminRouter.put("/donations/:id/status", adminController.updateDonationStatus);

// NGO Management
adminRouter.get("/ngos", adminController.getNgo);

adminRouter.get("/claims", adminController.getAllClaims)
adminRouter.get("/top-donors", adminController.getTopDonors)


exports.adminRouter= adminRouter;
