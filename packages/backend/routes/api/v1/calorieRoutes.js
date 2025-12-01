import express from "express";
import {
  publicCalorieIntake,
  privateCalorieIntake,
  getUserCalorieProfile, // 🔴 yeni import
} from "../../../controllers/calorieController.js";
import { protect } from "../../../middleware/authMiddleware.js";
import validation from "../../../middleware/validationMiddleware.js";
import { calorieInputSchema } from "../../../validation/userValidation.js";

const router = express.Router();

// POST /intake (herkese açık)
router.post(
  "/intake",
  validation(calorieInputSchema, "body"),
  publicCalorieIntake
);

// Debug route: GET /debug/forbidden/:group
router.get("/debug/forbidden/:group", (req, res, next) => {
  import("../../../controllers/calorieController.js")
    .then((mod) => mod.debugForbiddenProducts(req, res, next))
    .catch(next);
});

// POST /private-intake (korumalı, token zorunlu)
router.post(
  "/private-intake",
  protect,
  validation(calorieInputSchema, "body"),
  privateCalorieIntake
);

// 🔴 YENİ: GET /me → giriş yapmış kullanıcının kalori profilini döner
router.get("/me", protect, getUserCalorieProfile);

export default router;
