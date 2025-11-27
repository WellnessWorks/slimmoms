import asyncHandler from "express-async-handler"; // Express-async-handler eklendi
import {
  calculateDailyCalorieIntake,
  getForbiddenProducts,
} from "../services/calorieService.js";
import User from "../models/User.js";

// --- YARDIMCI FONKSİYON: Lojik Tekrarını Önler ---
const getCalculationData = async (
  weight,
  height,
  age,
  gender,
  activityLevel,
  targetWeight,
  bloodGroup
) => {
  // Gerekli tüm alanların kontrolü
  if (
    !weight ||
    !height ||
    !age ||
    !gender ||
    !activityLevel ||
    !targetWeight ||
    !bloodGroup
  ) {
    throw new Error(
      "Missing required fields for calculation, including targetWeight and bloodGroup."
    );
  }

  const dailyRate = calculateDailyCalorieIntake(
    weight,
    height,
    age,
    gender,
    activityLevel,
    targetWeight
  );

  const forbiddenFoods = await getForbiddenProducts(bloodGroup);

  return { dailyRate, forbiddenFoods };
};

// --- 5. Madde: HERKESE AÇIK Hesaplama Rotası ---
const publicCalorieIntake = asyncHandler(async (req, res) => {
  // req.body'den doğrudan alınıyor
  const {
    weight,
    height,
    age,
    gender,
    activityLevel,
    targetWeight,
    bloodGroup,
  } = req.body;

  // Lojik tekrarını önleyen yardımcı fonksiyonu çağır
  const { dailyRate, forbiddenFoods } = await getCalculationData(
    weight,
    height,
    age,
    gender,
    activityLevel,
    targetWeight,
    bloodGroup
  );

  res.status(200).json({
    status: "success",
    dailyRate,
    forbiddenFoods,
  });
});

// --- 6. Madde: ÖZEL (Korumalı) Hesaplama Rotası ---
const privateCalorieIntake = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Body'den veya veritabanından kan grubunu al
  const user = await User.findById(userId).select("bloodGroup");
  const bloodGroup = req.body.bloodGroup || user.bloodGroup;

  const { weight, height, age, gender, activityLevel, targetWeight } = req.body;

  // Lojik tekrarını önleyen yardımcı fonksiyonu çağır
  const { dailyRate, forbiddenFoods } = await getCalculationData(
    weight,
    height,
    age,
    gender,
    activityLevel,
    targetWeight,
    bloodGroup
  );

  // Hesaplanan hedefi ve tüm güncel verileri kullanıcı profiline kaydet (11. Madde'ye hazırlık)
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
        bloodGroup: bloodGroup, // Eğer body'den geliyorsa kaydet/güncelle
      },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    dailyRate,
    forbiddenFoods,
    message: "Calorie goal saved to profile.",
  });
});

export { publicCalorieIntake, privateCalorieIntake };
