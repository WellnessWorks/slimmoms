import asyncHandler from "express-async-handler";
import Day from "../models/Day.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

// --- 8. Madde: Ürün Ekleme Endpoint'i ---
// POST /api/v1/day/add-product
const addProductToDay = asyncHandler(async (req, res) => {
  // 1. Gerekli verileri al
  const userId = req.user._id; // Yetkilendirme katmanından (protect) gelir
  const { date, productId, weight } = req.body;

  if (!date || !productId || !weight || weight <= 0) {
    res.status(400);
    throw new Error("Date, productId, and weight (must be > 0) are required.");
  }

  // Tarihi sadece gün, ay, yıl olacak şekilde standartlaştır
  const standardDate = new Date(new Date(date).setHours(0, 0, 0, 0));

  // 2. Product'ı bul ve kalori bilgisini al
  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error("Product not found.");
  }

  // 3. Tüketilen kalori miktarını hesapla
  // product.calories 100g için olan kalori miktarıdır.
  const consumedCalories = (product.calories / 100) * weight;

  // 4. Günlük kaydı bul veya oluştur
  let dayEntry = await Day.findOne({ userId, date: standardDate });

  if (!dayEntry) {
    // Kayıt yoksa yeni bir günlük kayıt oluştur
    dayEntry = await Day.create({
      userId,
      date: standardDate,
      consumedProducts: [],
      totalCalories: 0,
    });
  }

  // 5. Ürünü Günlük Kayıt listesine ekle
  dayEntry.consumedProducts.push({
    productId: product._id,
    title: product.title,
    weight: weight,
    calories: consumedCalories,
  });

  // 6. Toplam kaloriyi güncelle
  dayEntry.totalCalories += consumedCalories;

  await dayEntry.save();

  res.status(201).json({
    status: "success",
    day: dayEntry,
    message: `${product.title} added successfully.`,
  });
});

// --- 9. Madde: Ürün Silme Endpoint'i ---
// DELETE /api/v1/day/delete-product
const deleteProductFromDay = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  // Silme işlemi için benzersiz ürün ID'sine (consumedProducts altındaki) ihtiyacımız var.
  const { consumedProductId } = req.body;

  if (!consumedProductId) {
    res.status(400);
    throw new Error("Consumed Product ID is required for deletion.");
  }

  // 1. Günlük kaydı bul
  // $in operatörü ile arama yaparak alt dizideki elemanı içeren kaydı buluruz.
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

  // 3. Ürünü alt diziden sil (Mongoose'un .remove() metodu)
  productToDelete.deleteOne(); // Mongoose 6+ için bu daha doğru bir yöntemdir.

  // 4. Toplam kaloriyi güncelle
  dayEntry.totalCalories -= caloriesToRemove;

  // 5. Kaydet
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

  // 1. URL'den 'date' query parametresini al. Yoksa bugünü kullan.
  const dateQuery = req.query.date ? new Date(req.query.date) : new Date();

  // Tarihi sadece gün, ay, yıl olacak şekilde standartlaştır
  const standardDate = new Date(dateQuery.setHours(0, 0, 0, 0));

  // 2. Kullanıcının günlük kalori hedefini (dailyCalorieGoal) al
  const user = await User.findById(userId).select("dailyCalorieGoal");

  if (!user || !user.dailyCalorieGoal) {
    res.status(400);
    throw new Error(
      "Daily calorie goal is not set. Please complete the setup via '/private-intake'."
    );
  }

  const dailyGoal = user.dailyCalorieGoal;

  // 3. Günlük kaydı (Day Entry) bul
  const dayEntry = await Day.findOne({ userId, date: standardDate }).populate({
    path: "consumedProducts.productId", // Ürün detaylarını çekmek için
    select: "name calories categories",
  });

  let consumedCalories = 0;
  let productsList = [];

  if (dayEntry) {
    consumedCalories = dayEntry.totalCalories;
    productsList = dayEntry.consumedProducts.map((product) => ({
      id: product._id, // consumed product ID
      title: product.title,
      weight: product.weight,
      calories: product.calories,
      // Orijinal ürün detayları gerekirse:
      // originalProductId: product.productId._id
    }));
  }

  // 4. Kalan kaloriyi hesapla
  const remainingCalories = Math.max(0, dailyGoal - consumedCalories);

  // 5. Yanıtı gönder
  res.status(200).json({
    status: "success",
    date: standardDate.toISOString().split("T")[0], // Sadece YYYY-MM-DD formatında gönder
    dailyGoal,
    consumedCalories,
    remainingCalories,
    products: productsList,
    entryExists: !!dayEntry,
  });
});

export { addProductToDay, deleteProductFromDay, getDayInfo };
