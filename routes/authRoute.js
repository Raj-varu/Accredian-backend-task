const express = require("express");
const router = express.Router();
const authValidator = require("../middlewares/authValidator");
const {
  loginController,
  registerController,
  forgotPasswordController,
} = require("../controllers/authCtrl");
// router.post("/register", register);
router.post("/login", authValidator.loginValidator, loginController);
router.post("/register", authValidator.registerValidator, registerController);
router.post(
  "/forgot",
  authValidator.forgotPasswordValidator,
  forgotPasswordController
);
module.exports = router;
