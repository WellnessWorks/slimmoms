import express from "express";
import {
  publicCalorieIntake,
  privateCalorieIntake,
} from "../../../controllers/calorieController.js";
import { protect } from "../../../middleware/authMiddleware.js"; // Yetkilendirme katmanı

const router = express.Router();

// 1. Herkese açık hesaplama (Token gerekmez) - Madde #5
// POST /api/v1/calories/intake
router.post("/intake", publicCalorieIntake);

// 2. Korumalı hesaplama ve kaydetme (Token Gerekir) - Madde #6
// POST /api/v1/calories/private-intake
router.post("/private-intake", protect, privateCalorieIntake);

export default router;
