const express = require("express");
const router = express.Router();
const controller = require("../controllers/paymentController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/", controller.list);
router.get("/invoice/:invoiceId/balance", controller.getInvoiceBalance);
router.get("/:id", controller.getOne);

router.post("/", authorize("Admin", "Staff"), controller.create);

module.exports = router;
