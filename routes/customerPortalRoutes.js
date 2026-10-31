const express = require("express");
const router = express.Router();
const controller = require("../controllers/customerPortalController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);
router.use(authorize("Customer"));

router.get("/subscriptions", controller.subscriptions);
router.get("/invoices", controller.invoices);
router.get("/payments", controller.payments);
router.get("/subscription-status", controller.status);

module.exports = router;
