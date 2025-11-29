import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser"; // Cookie desteği için
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";

// Rota Importları
import calorieRoutes from "./routes/api/v1/calorieRoutes.js";
import productRoutes from "./routes/api/v1/productRoutes.js";
import dayRoutes from "./routes/api/v1/dayRoutes.js";
import authRouter from "./routes/api/v1/authRoutes.js";
import userRoutes from "./routes/api/v1/userRoutes.js";

import specs from "./swagger.js";
// Middleware Importları
import { errorHandler } from "./middleware/errorMiddleware.js"; // Merkezi Hata İşleyiciler

// Konfigürasyonu yükle
dotenv.config();

// ✨ 1. ENV CONFIG DOSYASINDAN DEĞİŞKENLERİ TEMİZCE İÇE AKTAR
import { PORT, MONGODB_URI } from "./config/env.config.js";

const app = express();

// --- Middleware'ler ---

// CORS Ayarları
// Localhost için ve Vercel frontend için izin ver
app.use(
  cors({
    origin: ["http://localhost:3000", "https://slimmoms-frontend.vercel.app"],
    credentials: true,
  })
);

app.use(express.json()); // JSON Body Parser
app.use(cookieParser()); // Gelen isteklerdeki Cookie'leri parse etmek için

// --- Rota Bağlantıları ---

// 1. AUTH Rotaları (Kayıt, Giriş, Çıkış, Yenileme)
// authLimiter devre dışı bırakıldığı için sadece router'ı bağlıyoruz.
app.use("/api/v1/auth", authRouter);

// 2. Kalan Rota Tanımlamaları
// Bu rotaların hepsi /api/v1 altındadır.
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/calories", calorieRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/day", dayRoutes);

// 3. Dokümantasyon Rotası
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Temel deneme rotası (Sunucu canlı mı kontrolü)
app.get("/", (req, res) => {
  res.send("Slimmoms Backend is Running!");
});

// --- Hata İşleyiciler ---

// Merkezi Hata İşleyici (Tüm middleware ve rotalardaki hataları son olarak işler)
app.use(errorHandler);

// --- Database Connection and Server Start ---

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is undefined! Check your .env file.");
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB Connection Successful!");
    const port = PORT || 4000;
    app.listen(port, () => {
      console.log(`🚀 Backend Server running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  });
