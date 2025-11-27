import rateLimit from "express-rate-limit";

// 1. Güvenlik Açısından Hassas Rotalar İçin Sıkı Limit
// (Örn: /register, /login)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Dakika
  max: 10, // Her IP adresi başına 15 dakika içinde sadece 10 istek izin ver.
  message: {
    status: "error",
    message:
      "Çok fazla hesap oluşturma veya giriş denemesi yaptınız. Lütfen 15 dakika sonra tekrar deneyin.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 2. Genel API Rotaları İçin Standart Limit
// (Örn: /users/me, /day/info, /products/search)
export const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 Saat
  max: 1000, // Her IP adresi başına 1 saat içinde 1000 istek izin ver.
  message: {
    status: "error",
    message: "Çok fazla istek aldınız. Lütfen bir saat sonra tekrar deneyin.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
