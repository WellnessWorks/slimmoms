import express from "express";
import {
  addProductToDay,
  deleteProductFromDay,
  getDayInfo,
} from "../../../controllers/dayController.js";
import { protect } from "../../../middleware/authMiddleware.js";

const router = express.Router();

// 8. Madde: Günlüğe ürün ekleme rotası
// POST /api/v1/day/add-product
router.post("/add-product", protect, addProductToDay);

// 9. Madde: Günlükten ürün silme
// DELETE /api/v1/day/delete-product
router.delete("/delete-product", protect, deleteProductFromDay);

// 10. Madde: Belirli bir günün özet bilgilerini alma (Kalan kalori, tüketilen ürünler vb.)
// GET /api/v1/day/info?date=YYYY-MM-DD (Date opsiyonel, yoksa bugünü alır)
router.get("/info", protect, getDayInfo);

export default router;
