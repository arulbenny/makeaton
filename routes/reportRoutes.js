const express = require("express");
const router = express.Router();
const controller = require("../controllers/reportController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);
router.use(authorize("Admin", "Staff"));

router.get("/dashboard", controller.dashboard);
router.get("/revenue", controller.revenue);
router.get("/active-subscriptions", controller.activeSubscriptions);
router.get("/outstanding-invoices", controller.outstandingInvoices);

module.exports = router;
