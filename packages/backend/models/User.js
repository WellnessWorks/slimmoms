import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please fill in the name field."], // İsim alanı zorunlu
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter an email address."], // E-posta zorunlu
      unique: true, // E-posta benzersiz olmalı
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please enter a password."], // Şifre zorunlu
      minlength: 6,
      select: false, // Şifreyi varsayılan olarak sorgu sonuçlarından gizle
    },
    token: {
      type: String,
      default: null,
    },
    dailyCalorieGoal: {
      type: Number,
      default: null,
    }, // Hesaplanan günlük kalori hedefi
    weight: {
      type: Number,
    }, // Mevcut Kilo
    height: {
      type: Number,
    }, // Boy
    age: {
      type: Number,
    }, // Yaş
    gender: {
      type: String,
      enum: ["male", "female"],
    }, // Cinsiyet
    activityLevel: {
      type: String,
    }, // Aktivite seviyesi
    targetWeight: {
      type: Number,
    }, // ✨ Hedef Kilo (Yeni formül için gerekli)
  },
  {
    timestamps: true, // Oluşturulma/güncellenme zamanlarını otomatik ekler
  }
);

// Model oluşturma
const User = mongoose.model("User", userSchema);
export default User;
