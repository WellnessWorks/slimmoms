import jwt from "jsonwebtoken";
import User from "../models/User.js";

const { JWT_SECRET } = process.env; // .env dosyasından gizli anahtarı al

const protect = async (req, res, next) => {
  let token;

  // 1. Authorization başlığını kontrol et (Format: Bearer <TOKEN>)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // 2. Token'ı 'Bearer ' kısmından ayır
      token = req.headers.authorization.split(" ")[1];

      // 3. Token'ı gizli anahtar (JWT_SECRET) ile doğrula
      const decoded = jwt.verify(token, JWT_SECRET);

      // 4. Token içindeki ID'ye göre kullanıcıyı bul ve şifreyi hariç tut
      req.user = await User.findById(decoded.id).select("-password");

      // Kullanıcı bulunamazsa hata fırlat
      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Not authorized, user not found." });
      }

      // Her şey yolundaysa, bir sonraki işleyiciye geç
      next();
    } catch (error) {
      console.error("JWT Error:", error.message);
      return res
        .status(401)
        .json({ message: "Not authorized, invalid token." });
    }
  }

  // Token yoksa veya format yanlışsa
  if (!token) {
    return res
      .status(401)
      .json({ message: "Not authorized, no token provided." });
  }
};

export { protect };
