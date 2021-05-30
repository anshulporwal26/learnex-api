const express = require("express");

const router = express.Router();
const authController = require("../controllers/authController");
const middlewares = require("../middlewares");

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.get("/verify_email/:emailToken", authController.verifyEmail);
router.get(
  "/resend_verify_email",
  middlewares.checkAuth,
  authController.resendVerifyEmail
);
router.post("/google", authController.googleAuth);
router.post("/refresh_token", authController.refreshToken);
router.delete("/logout", authController.logoutUser);

module.exports = router;
