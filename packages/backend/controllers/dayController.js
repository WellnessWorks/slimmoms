// controllers/dayController.js
import asyncHandler from "express-async-handler";
import Day from "../models/Day.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

// --- 8. Madde: Ürün Ekleme Endpoint'i ---
// POST /api/v1/day/add-product

const addProductToDay = asyncHandler(async (req, res) => {
  const userId = req.user._id; // protect middleware'den gelir
  const { date, productId, weight } = req.body;

  if (!date || !productId || !weight || weight <= 0) {
    res.status(400);
    throw new Error("Date, productId, and weight (must be > 0) are required.");
  }

  // Tarihi sadece gün, ay, yıl olacak şekilde standartlaştır
  const standardDate = new Date(new Date(date).setHours(0, 0, 0, 0));

  // Product'ı bul
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found.");
  }

  // Kullanıcının kan grubuna göre bu ürün YASAK mı? (SADECE HESAPLA, BLOK YOK)
  const user = await User.findById(userId).select("bloodGroup");

  let isForbiddenForUser = false;

  const bloodGroupIndex = Number(user?.bloodGroup);
  if (
    bloodGroupIndex >= 1 &&
    bloodGroupIndex <= 4 &&
    Array.isArray(product.groupBloodNotAllowed)
  ) {
    const idx = bloodGroupIndex - 1; // 1–4 → 0–3
    isForbiddenForUser = !!product.groupBloodNotAllowed[idx];
  }

  // Tüketilen kalori miktarını hesapla (product.calories 100 g içindir)
  const consumedCalories = (product.calories / 100) * weight;

  // Günlük kaydı bul veya oluştur
  let dayEntry = await Day.findOne({ userId, date: standardDate });

  if (!dayEntry) {
    dayEntry = await Day.create({
      userId,
      date: standardDate,
      consumedProducts: [],
      totalCalories: 0,
    });
  }

  // Ürünü Günlük Kayıt listesine ekle
  dayEntry.consumedProducts.push({
    productId: product._id,
    title: product.title,
    weight: weight,
    calories: consumedCalories,
    isForbiddenForUser, // ister kullan ister kullanma, dursun
  });

  // Toplam kaloriyi güncelle
  dayEntry.totalCalories += consumedCalories;

  await dayEntry.save();

  res.status(201).json({
    status: "success",
    day: dayEntry,
    isForbiddenForUser, // frontend isterse buradan da görebilir
    message: `${product.title} added successfully.`,
  });
});


// --- 9. Madde: Ürün Silme Endpoint'i ---
// DELETE /api/v1/day/delete-product
const deleteProductFromDay = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { consumedProductId } = req.body;

  if (!consumedProductId) {
    res.status(400);
    throw new Error("Consumed Product ID is required for deletion.");
  }

  // 1. Günlük kaydı bul
  let dayEntry = await Day.findOne({
    userId,
    "consumedProducts._id": consumedProductId,
  });

  if (!dayEntry) {
    res.status(404);
    throw new Error("Day entry or specified product not found.");
  }

  // 2. Silinecek ürünü ve kalori değerini bul
  const productToDelete = dayEntry.consumedProducts.id(consumedProductId);

  if (!productToDelete) {
    res.status(404);
    throw new Error("Product not found in the current day entry.");
  }

  const caloriesToRemove = productToDelete.calories;

  // 3. Ürünü alt diziden sil
  productToDelete.deleteOne();

  // 4. Toplam kaloriyi güncelle
  dayEntry.totalCalories -= caloriesToRemove;

  await dayEntry.save();

  res.status(200).json({
    status: "success",
    day: dayEntry,
    message: `${productToDelete.title} successfully removed from the day log.`,
  });
});

// --- 10. Madde: Günlük Bilgilerini Alma Endpoint'i ---
// GET /api/v1/day/info?date=2025-11-27
const getDayInfo = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // 1. 'date' query parametresi, yoksa bugün
  const dateQuery = req.query.date ? new Date(req.query.date) : new Date();

  // Tarihi normalize et
  const standardDate = new Date(dateQuery.setHours(0, 0, 0, 0));

  // 2. Kullanıcının günlük kalori hedefi
  const user = await User.findById(userId).select("dailyCalorieGoal");

  if (!user || !user.dailyCalorieGoal) {
    res.status(400);
    throw new Error(
      "Daily calorie goal is not set. Please complete the setup via '/private-intake'."
    );
  }

  const dailyGoal = user.dailyCalorieGoal;

  // 3. Günlük kaydı bul
  const dayEntry = await Day.findOne({ userId, date: standardDate }).populate({
    path: "consumedProducts.productId",
    select: "title calories categories",
  });

  let consumedCalories = 0;
  let productsList = [];

  if (dayEntry) {
    consumedCalories = dayEntry.totalCalories;
    productsList = dayEntry.consumedProducts.map((product) => ({
      id: product._id,
      title: product.title,
      weight: product.weight,
      calories: product.calories,
    }));
  }

  const remainingCalories = Math.max(0, dailyGoal - consumedCalories);

  res.status(200).json({
    status: "success",
    date: standardDate.toISOString().split("T")[0],
    dailyGoal,
    consumedCalories,
    remainingCalories,
    products: productsList,
    entryExists: !!dayEntry,
  });
});

export { addProductToDay, deleteProductFromDay, getDayInfo };
