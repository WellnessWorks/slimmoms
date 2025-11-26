import express from "express";
import { register, login } from "../../../controllers/authController.js";

const router = express.Router();

// POST /api/v1/auth/register (Kayıt işlemi)
router.post("/register", register);

// POST /api/v1/auth/login (Giriş işlemi)
router.post("/login", login);

export default router;
