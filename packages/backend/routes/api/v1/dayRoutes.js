import express from "express";
import {
  addProductToDay, // <-- 'addProduct' yerine 'addProductToDay' oldu
  deleteProductFromDay, // <-- 'deleteProduct' yerine 'deleteProductFromDay' oldu
  getDayInfo,
} from "../../../controllers/dayController.js";
import { protect } from "../../../middleware/authMiddleware.js";
import validation from "../../../middleware/validationMiddleware.js"; // Import validation
import {
  addProductSchema,
  deleteProductSchema,
  getDayInfoSchema,
} from "../../../validation/dayValidation.js"; // Import schemas

const router = express.Router();

// POST /add-product rotasına doğrulama eklendi
router.post(
  "/add-product",
  protect,
  validation(addProductSchema, "body"),
  addProductToDay
);

// DELETE /delete-product rotasına doğrulama eklendi
router.delete(
  "/delete-product",
  protect,
  validation(deleteProductSchema, "body"),
  deleteProductFromDay // <-- Hata veren 'deleteProduct' yerine 'deleteProductFromDay' olmalı!
);

// GET /info rotasına doğrulama eklendi (Query parametresi kontrolü)
router.get("/info", protect, validation(getDayInfoSchema, "query"), getDayInfo);

export default router;
