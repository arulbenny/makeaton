const express = require("express");
const router = express.Router();
const controller = require("../controllers/subscriptionController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/quotation-templates", authorize("Admin", "Staff"), controller.listTemplates);
router.post("/quotation-templates", authorize("Admin", "Staff"), controller.createTemplate);
router.post("/from-template/:templateId", authorize("Admin", "Staff"), controller.createFromTemplate);

router.get("/", controller.list);
router.post("/", authorize("Admin", "Staff"), controller.create);
router.get("/:id", controller.getOne);
router.put("/:id", authorize("Admin", "Staff"), controller.update);
router.post("/:id/renew", authorize("Admin", "Staff"), controller.renew);
router.post("/:id/:action", authorize("Admin", "Staff"), controller.transition);

module.exports = router;
