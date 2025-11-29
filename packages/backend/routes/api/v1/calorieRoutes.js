import express from "express";
import {
  publicCalorieIntake, // <-- Düzeltilmiş isim
  privateCalorieIntake, // <-- Düzeltilmiş isim
} from "../../../controllers/calorieController.js";
import { protect } from "../../../middleware/authMiddleware.js";
import validation from "../../../middleware/validationMiddleware.js"; // Import validation
import { calorieInputSchema } from "../../../validation/userValidation.js"; // Import schema

const router = express.Router();

// POST /intake rotasına (Herkese açık)
router.post(
  "/intake",
  validation(calorieInputSchema, "body"),
  publicCalorieIntake
);

// Debug route: GET /debug/forbidden/:group
router.get("/debug/forbidden/:group", (req, res, next) => {
  // Lazy-load controller to avoid circular issues
  import("../../../controllers/calorieController.js").then(mod => mod.debugForbiddenProducts(req, res, next)).catch(next);
});

// POST /private-intake rotasına (Korumalı)
router.post(
  "/private-intake",
  protect,
  validation(calorieInputSchema, "body"),
  privateCalorieIntake
);

export default router;
