import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshTokensController,
} from "../../../controllers/authController.js"; // Controller yolu düzeltildi (../../)

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", logoutUser);

router.post("/refresh", refreshTokensController);

export default router;
