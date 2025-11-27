import express from "express";
import {
  register,
  login,
  logout,
  refreshTokensController,
} from "../../../controllers/authController.js";

const router = express.Router();

// POST /api/v1/auth/register (Kayıt)
router.post("/register", register);

// POST /api/v1/auth/login (Giriş)
router.post("/login", login);

// POST /api/v1/auth/logout (Çıkış - #3)
router.post("/logout", logout);

// POST /api/v1/auth/refresh (Token Yenileme - #12)
router.post("/refresh", refreshTokensController);

export default router;
