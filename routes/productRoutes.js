const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const controller = require("../controllers/productController");

router.use(protect);

router.get("/", controller.getProducts);
router.get("/:id", controller.getProduct);
router.post("/", authorize("Admin", "Staff"), controller.createProduct);
router.put("/:id", authorize("Admin", "Staff"), controller.updateProduct);
router.delete("/:id", authorize("Admin"), controller.deleteProduct);

module.exports = router;
