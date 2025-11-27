import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // bcrypt import edildi

// 1. Şemayı Tanımla
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please fill in the name field."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter an email address."],
      // Tekrar eden dizin uyarısını kaldırmak için 'unique: true' kaldırıldı.
      // Dizin tanımı (unique: true) modelin en altında yapılmıştır.
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please enter a password."],
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
    },
    weight: {
      type: Number,
    },
    height: {
      type: Number,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    activityLevel: {
      type: String,
    },
    targetWeight: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// ⚡ Dizini tanımlayarak performansı artırıyoruz ve benzersizliği garanti ediyoruz.
// Bu, şema içindeki "unique: true" tanımının yerini alır.
userSchema.index({ email: 1 }, { unique: true });

// 2. Mongoose 'pre' Kancası: Kaydetmeden Önce Şifreyi Hashle
userSchema.pre("save", async function (next) {
  // YALNIZCA şifre alanı değiştirildiğinde hashler
  if (!this.isModified("password")) {
    next();
  }

  // Şifreyi hashle
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 3. Metot Ekleme: Şifre Karşılaştırma
userSchema.methods.matchPassword = async function (enteredPassword) {
  // enteredPassword'ı (düz metin) this.password (hashed) ile karşılaştır
  return await bcrypt.compare(enteredPassword, this.password);
};

// 4. Modeli Oluştur ve Export Et
const User = mongoose.model("User", userSchema);
export default User;
