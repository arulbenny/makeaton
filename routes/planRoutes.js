const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const controller = require("../controllers/planController");

router.use(protect);

router.get("/", controller.getPlans);
router.get("/:id", controller.getPlan);
router.post("/", authorize("Admin", "Staff"), controller.createPlan);
router.put("/:id", authorize("Admin", "Staff"), controller.updatePlan);
router.delete("/:id", authorize("Admin"), controller.deletePlan);

module.exports = router;
