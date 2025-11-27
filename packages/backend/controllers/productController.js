import asyncHandler from "express-async-handler"; // Express-Async-Handler eklendi
import Product from "../models/Product.js";
// User modeline bu endpoint'te ihtiyaç yok (kan grubu query'den geliyor)

/**
 * Madde #7: Query-string kullanarak ürün arama endpoint'i.
 * Yasaklı ürünleri, kullanıcının kan grubu (eğer varsa) ve arama metnine göre filtreler.
 * GET /api/v1/products/search?query=milk&bloodGroup=2
 */
const searchProducts = asyncHandler(async (req, res) => {
  // asyncHandler kullanıldı

  const { query, bloodGroup } = req.query;

  if (!query || query.trim() === "") {
    res.status(400);
    throw new Error(
      'Arama yapmak için geçerli bir "query" parametresi gereklidir.'
    );
  }

  // 1. Kan Grubu Doğrulaması
  // Joi/Validation Middleware'i burada bu kontrolü yapmalıydı,
  // ancak endpoint içinde tekrar kontrol edelim.
  const bloodGroupIndex = parseInt(bloodGroup);

  // Temel filtre objesini oluştur
  let filter = {};

  // 2. Arama Tipi: Text Index Kullanımı
  // Mongoose Text Index'i kullanmak için $regex yerine $text kullanılır
  // Bu, performansı ciddi ölçüde artırır.
  filter.$text = { $search: query };

  // 3. Kan Grubu Filtresi
  if (bloodGroupIndex >= 1 && bloodGroupIndex <= 4) {
    // Sadece yasaklı OLMADIĞI ürünleri istiyoruz.
    // groupBloodNotAllowed[1] -> groupBloodNotAllowed.1
    filter[`groupBloodNotAllowed.${bloodGroupIndex}`] = false;
  }

  // 4. Sorguyu Çalıştır
  const products = await Product.find(filter)
    .limit(20) // Performans için sonuçları sınırla
    .select("title calories categories weight groupBloodNotAllowed"); // Sadece gerekli alanları seç

  res.status(200).json({
    status: "success",
    results: products.length,
    products,
  });
});

export { searchProducts };
