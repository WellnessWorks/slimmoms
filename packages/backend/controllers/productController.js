import Product from "../models/Product.js";
// NOT: Bu aşamada kullanıcı verileri için User modeline ihtiyacımız olacak.

/**
 * Madde #7: Query-string kullanarak ürün arama endpoint'i.
 * Yasaklı ürünleri, kullanıcının kan grubu (eğer varsa) ve arama metnine göre filtreler.
 * GET /api/v1/products/search?query=milk&bloodGroup=2
 */
const searchProducts = async (req, res, next) => {
  try {
    const { query, bloodGroup } = req.query;

    if (!query) {
      return res.status(400).json({
        message: 'Arama yapmak için bir "query" parametresi gereklidir.',
      });
    }

    // 1. Arama Metni Filtresi
    const searchRegex = new RegExp(query, "i");

    // 2. Kan Grubu Filtresi
    const bloodGroupIndex = parseInt(bloodGroup);

    let filter = {
      title: { $regex: searchRegex }, // Temel arama her zaman olmalı
    };

    // Eğer geçerli bir kan grubu verilmişse, filtreleme mantığını ekle.
    if (bloodGroupIndex >= 1 && bloodGroupIndex <= 4) {
      // Sadece yasaklı OLMADIĞI ürünleri istiyoruz (yani groupBloodNotAllowed[index] = false)
      filter[`groupBloodNotAllowed.${bloodGroupIndex}`] = false;
    }

    // 3. Sorguyu Çalıştır
    const products = await Product.find(filter) // ✨ Artık doğru filter objesini kullanıyoruz
      .limit(20)
      .select("title calories categories weight groupBloodNotAllowed");

    res.status(200).json({
      status: "success",
      results: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

export { searchProducts };
