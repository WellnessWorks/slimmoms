import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser"; // Cookie desteği için
import calorieRoutes from "./routes/api/v1/calorieRoutes.js";
import productRoutes from "./routes/api/v1/productRoutes.js";
import dayRoutes from "./routes/api/v1/dayRoutes.js";
import swaggerUi from "swagger-ui-express";
import specs from "./swagger.js";
import dotenv from "dotenv";
//import { authLimiter, apiLimiter } from "./middleware/rateLimitMiddleware.js"; // Rate Limitler
import { errorHandler } from "./middleware/errorMiddleware.js"; // Merkezi Hata İşleyiciler
// Konfigürasyonu yükle
dotenv.config();

// ✨ 1. ENV CONFIG DOSYASINDAN DEĞİŞKENLERİ TEMİZCE İÇE AKTAR
import { PORT, MONGODB_URI } from "./config/env.config.js";

// Diğer router importları
import authRouter from "./routes/api/v1/authRoutes.js";
import userRoutes from "./routes/api/v1/userRoutes.js";

const app = express();

// --- Middleware'ler ---

// CORS Ayarları (Özellikle Cookie'ler ve Kimlik Bilgileri için önemlidir)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true, // Frontend'in Cookie göndermesine izin verir
  })
);

app.use(express.json()); // JSON Body Parser
app.use(cookieParser()); // Gelen isteklerdeki Cookie'leri parse etmek için

// --- Rota Bağlantıları ve Rate Limiting ---

// 1. AUTH Rotalarına Sıkı Limit Uygulama (Bruteforce Koruması)
//app.use("/api/v1/auth", authLimiter, authRouter);

// 2. Diğer Tüm Rotalara Genel Limit Uygulama (DoS Koruması)
// Bu limit, altındaki tüm rotalar için geçerli olacaktır.
//app.use("/api/v1", apiLimiter);

// 3. Kalan Rota Tanımlamaları
// Bu rotalar artık apiLimiter tarafından korunmaktadır.
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/calories", calorieRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/day", dayRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Temel deneme rotası
app.get("/", (req, res) => {
  res.send("Slimmoms Backend is Running!");
});

// --- Hata İşleyiciler ---
// 404 (Rota Bulunamadı) Hatalarını Yakalama

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
