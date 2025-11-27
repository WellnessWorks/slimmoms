import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import calorieRoutes from "./routes/api/v1/calorieRoutes.js";
import productRoutes from "./routes/api/v1/productRoutes.js";
import dayRoutes from "./routes/api/v1/dayRoutes.js";
import swaggerUi from "swagger-ui-express";
import specs from "./swagger.js";
import dotenv from "dotenv";
// Konfigürasyonu yükle
dotenv.config();

// ✨ 1. ENV CONFIG DOSYASINDAN DEĞİŞKENLERİ TEMİZCE İÇE AKTAR
import { PORT, MONGODB_URI } from "./config/env.config.js";
// NOT: env.config.js dosyasında dotenv yüklemesi yapılmalıdır.

// Diğer router importları
import authRouter from "./routes/api/v1/authRoutes.js";
import userRoutes from "./routes/api/v1/userRoutes.js";
const app = express();

// --- Middleware'ler ---
app.use(express.json()); // JSON Body Parser
app.use(cors()); // CORS

// --- Rota Bağlantıları ---
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/calories", calorieRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/day", dayRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Temel deneme rotası
app.get("/", (req, res) => {
  res.send("Slimmoms Backend is Running!");
});

// --- Error Handlers (Hata İşleyiciler) ---
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

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
