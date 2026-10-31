const express = require("express");
const router = express.Router();
const controller = require("../controllers/discountController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/", controller.list);
router.get("/:id", controller.getOne);

router.post("/", authorize("Admin", "Staff"), controller.create);
router.put("/:id", authorize("Admin", "Staff"), controller.update);

router.post(
  "/apply/:invoiceId/:discountId",
  authorize("Admin", "Staff"),
  controller.apply
);

router.post(
  "/apply-eligible/:invoiceId",
  authorize("Admin", "Staff"),
  controller.applyEligible
);

module.exports = router;
