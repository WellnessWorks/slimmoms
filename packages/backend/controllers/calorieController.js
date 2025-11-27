import {
  calculateDailyCalorieIntake,
  getForbiddenProducts,
} from "../services/calorieService.js";
import User from "../models/User.js";

// 1. Herkese Açık Hesaplama Rotası (#5)
const publicCalorieIntake = (req, res, next) => {
  try {
    const { weight, height, age, gender, activityLevel, targetWeight } =
      req.body;

    // Bütün alanlar zorunludur (targetWeight dahil)
    if (
      !weight ||
      !height ||
      !age ||
      !gender ||
      !activityLevel ||
      !targetWeight
    ) {
      return res.status(400).json({
        message:
          "Missing required fields for calculation, including targetWeight.",
      });
    }

    const dailyRate = calculateDailyCalorieIntake(
      weight,
      height,
      age,
      gender,
      activityLevel,
      targetWeight
    );

    const forbiddenFoods = getForbiddenProducts();

    res.status(200).json({
      status: "success",
      dailyRate,
      forbiddenFoods,
    });
  } catch (error) {
    // Servis katmanından gelen hataları (örn. Invalid gender) yakalar
    if (error.message.includes("Invalid gender")) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

// 2. Özel (Korumalı) Hesaplama Rotası (#6)
const privateCalorieIntake = async (req, res, next) => {
  try {
    // req.user, Yetkilendirme (protect) middleware'i tarafından sağlanır.
    const userId = req.user._id;
    const { weight, height, age, gender, activityLevel, targetWeight } =
      req.body;

    if (
      !weight ||
      !height ||
      !age ||
      !gender ||
      !activityLevel ||
      !targetWeight
    ) {
      return res.status(400).json({
        message:
          "Missing required fields for calculation, including targetWeight.",
      });
    }

    const dailyRate = calculateDailyCalorieIntake(
      weight,
      height,
      age,
      gender,
      activityLevel,
      targetWeight
    );

    const forbiddenFoods = getForbiddenProducts();

    // ✨ Madde #6'ya göre verileri veritabanındaki User profiline kaydetme
    await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          dailyCalorieGoal: dailyRate,
          weight,
          height,
          age,
          gender,
          activityLevel,
          targetWeight,
        },
      },
      { new: true }
    ); // Güncel veriyi döndürmek için new: true kullanılabilir.

    res.status(200).json({
      status: "success",
      dailyRate,
      forbiddenFoods,
      message: "Calorie goal saved to profile.",
    });
  } catch (error) {
    if (error.message.includes("Invalid gender")) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

export { publicCalorieIntake, privateCalorieIntake };
