const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getMe,
  createStaff,
  forgotPassword,
  resetPassword
} = require("../controllers/authController");

const {
  protect,
  authorize
} = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/me", protect, getMe);

router.post(
  "/staff",
  protect,
  authorize("Admin"),
  createStaff
);

module.exports = router;
