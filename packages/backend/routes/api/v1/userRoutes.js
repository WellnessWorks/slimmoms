import express from "express";
import { getMe, updateUserData } from "../../../controllers/userController.js";
import { protect } from "../../../middleware/authMiddleware.js";

const router = express.Router();

// 1. Madde: Kullanıcı Bilgilerini Alma (GET)
// Endpoint: GET /api/v1/users/me
// İşlev: protect middleware'i ile yetkilendirilmiş kullanıcının profil verilerini döndürür.
router.get("/me", protect, getMe);

// 2. Madde: Kullanıcı Bilgilerini Güncelleme (PATCH)
// Endpoint: PATCH /api/v1/users/update
// İşlev: protect middleware'i ile yetkilendirilmiş kullanıcının profilindeki alanları günceller.
router.patch("/update", protect, updateUserData);

export default router;
