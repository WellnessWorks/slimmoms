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
  },
  {
    timestamps: true, // Oluşturulma/güncellenme zamanlarını otomatik ekler
  }
);

// Model oluşturma
const User = mongoose.model("User", userSchema);
export default User;
