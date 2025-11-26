import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// ✨ Artık değişkenleri tek bir yerden temizce çekiyoruz
import { PORT, MONGODB_URI } from "./config/env.config.js";

const app = express();
// ... (Middleware ve Rota kodları)

// --- Veritabanı Bağlantısı ve Sunucu Başlatma ---
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI Tanımlı Değil!");
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB Bağlantısı Başarılı!");
    const port = PORT || 4000;
    app.listen(port, () => {
      console.log(
        `🚀 Backend Sunucusu http://localhost:${port} adresinde çalışıyor`
      );
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB Bağlantı Hatası:", error.message);
    process.exit(1);
  });
