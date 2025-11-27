import express from "express";
import {
  calculateDailyIntake,
  calculatePrivateDailyIntake,
} from "../../../controllers/calorieController.js";
import { protect } from "../../middleware/authMiddleware.js";
import validation from "../../middleware/validationMiddleware.js"; // Import validation
import { calorieInputSchema } from "../../validation/userValidation.js"; // Import schema

const router = express.Router();

// POST /intake rotasına doğrulama eklendi (Herkese açık)
router.post(
  "/intake",
  validation(calorieInputSchema, "body"),
  calculateDailyIntake
);

// POST /private-intake rotasına doğrulama eklendi (Korumalı)
router.post(
  "/private-intake",
  protect,
  validation(calorieInputSchema, "body"),
  calculatePrivateDailyIntake
);

export default router;
