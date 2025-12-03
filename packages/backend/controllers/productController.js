// controllers/productController.js
import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import { getForbiddenProducts as getForbiddenProductsService } from "../services/calorieService.js"; 
// ↑ senin calorieService.js içindeki getForbiddenProducts

/**
 * Ürün adına göre arama
 * GET /products/search?query=elma&bloodGroup=2
 */
const searchProducts = asyncHandler(async (req, res) => {
  const { query, bloodGroup } = req.query;

  if (!query || query.trim() === "") {
    res.status(400);
    throw new Error(
      'Arama yapmak için geçerli bir "query" parametresi gereklidir.'
    );
  }

  const bloodGroupIndex = parseInt(bloodGroup, 10);

  let filter = {};

  // Text index ile arama
  filter.$text = { $search: query };

  // Kan grubuna göre YASAK OLMAYAN ürünler
  if (bloodGroupIndex >= 1 && bloodGroupIndex <= 4) {
    filter[`groupBloodNotAllowed.${bloodGroupIndex}`] = false;
  }

  const products = await Product.find(filter)
    .limit(20)
    .select("title calories categories weight groupBloodNotAllowed");

  res.status(200).json({
    status: "success",
    results: products.length,
    products,
  });
});

/**
 * Kan grubuna göre YASAK ürünleri getir
 * GET /products/forbidden?bloodGroup=2
 */
const getForbiddenProducts = asyncHandler(async (req, res) => {
  const { bloodGroup } = req.query;
  const bloodGroupIndex = parseInt(bloodGroup, 10);

  if (!bloodGroupIndex || bloodGroupIndex < 1 || bloodGroupIndex > 4) {
    res.status(400);
    throw new Error(
      'Geçerli bir "bloodGroup" parametresi göndermelisiniz (1, 2, 3 veya 4).'
    );
  }

  // calorieService içindeki fonksiyonu kullanıyoruz
  const forbiddenFoods = await getForbiddenProductsService(bloodGroupIndex);

  res.status(200).json({
    status: "success",
    bloodGroup: bloodGroupIndex,
    count: forbiddenFoods.length,
    forbiddenFoods, // ["Ready breakfast ...", "Sütlü çikolata", ...]
  });
});

export { searchProducts, getForbiddenProducts };
