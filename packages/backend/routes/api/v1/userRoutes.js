import express from "express";
import { getMe } from "../../../controllers/userController.js";
import { protect } from "../../../middleware/authMiddleware.js"; // ✨ Koruma middleware'ini import et

const router = express.Router();

// GET /api/v1/users/me rota tanımı: Önce "protect" çalışır, sonra "getMe"
router.get("/me", protect, getMe);

export default router;
