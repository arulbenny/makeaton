const express = require("express");
const router = express.Router();
const controller = require("../controllers/invoiceController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/", controller.list);
router.get("/:id", controller.getOne);

router.post("/", authorize("Admin", "Staff"), controller.create);
router.post(
  "/from-subscription/:subscriptionId",
  authorize("Admin", "Staff"),
  controller.generateFromSubscription
);
router.post("/:id/confirm", authorize("Admin", "Staff"), controller.confirm);
router.post("/:id/cancel", authorize("Admin", "Staff"), controller.cancel);
router.post("/:id/paid", authorize("Admin", "Staff"), controller.markPaid);
router.post("/:id/send", authorize("Admin", "Staff"), controller.send);

module.exports = router;
