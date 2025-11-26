import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const { JWT_SECRET } = process.env; // Ortam değişkenini al

// 1. Yeni Kullanıcı Kayıt Mantığı
async function registerUser(name, email, password) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    // 409 Conflict (Çakışma) için hata fırlat
    throw new Error("Email address already in use.");
  }

  // Şifreyi hash'le
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  await newUser.save();
  return newUser;
}

// 2. Kullanıcı Giriş Mantığı
async function loginUser(email, password) {
  const user = await User.findOne({ email }).select("+password"); // Şifreyi dahil ederek çek
  if (!user) {
    throw new Error("Invalid email or password."); // Kullanıcı bulunamadı
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password."); // Şifre eşleşmedi
  }

  // JWT Token oluştur
  const payload = { id: user._id };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

  // Şifreyi yanıttan çıkarmak için bir kopya oluştur
  const { password: _, ...userData } = user.toObject();

  return { token, user: userData };
}

export { registerUser, loginUser };
