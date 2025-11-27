import Product from "../models/Product.js";

// Günlük Aktivite Çarpanları (Genel olarak kullanılan değerler)
const activityFactors = {
  sedentary: 1.2, // Hareketsiz
  light: 1.375, // Hafif aktif
  moderate: 1.55, // Orta aktif
  veryActive: 1.725, // Çok aktif
  extraActive: 1.9, // Ekstra aktif
};

/**
 * Günlük kalori ihtiyacını (TDEE) hesaplar.
 * Kadınlar için özel hedef odaklı formülü kullanır.
 */
function calculateDailyCalorieIntake(
  weight,
  height,
  age,
  gender,
  activityLevel,
  targetWeight
) {
  let bmrAdjustment; // BMR + Hedef Ayarlaması

  if (gender === "female") {
    // ✨ KADINLAR İÇİN ÖZEL FORMÜL:
    // (10 * ağırlık) + (6.25 * boy) - (5 * yaş) - 161 - 10 * (ağırlık - istenen ağırlık)
    bmrAdjustment =
      10 * weight +
      6.25 * height -
      5 * age -
      161 -
      10 * (weight - targetWeight);
  } else if (gender === "male") {
    // ERKEKLER İÇİN (Standart Mifflin-St Jeor)
    // Eğer erkekler için de hedef kilo ayarlaması isterseniz, burayı güncelleriz.
    bmrAdjustment = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    throw new Error("Invalid gender specified.");
  }

  // Aktivite çarpanını al
  const factor = activityFactors[activityLevel] || activityFactors.sedentary;

  // Toplam Günlük Enerji Harcaması (TDEE)
  const tdee = bmrAdjustment * factor;

  // Kalori miktarının minimum sağlıklı sınırın altına düşmemesini sağla (Örn: 1000 Kcal)
  return Math.round(Math.max(1000, tdee));
}

/**
 * Kullanıcının kan grubuna göre YASAKLANMIŞ ürünleri veritabanından bulur.
 * @param {number} bloodGroup - Kullanıcının kan grubu (1, 2, 3, 4)
 * @returns {Array} Yasaklanmış ürün başlıklarının listesi
 */
async function getForbiddenProducts(bloodGroup) {
  // ✨ bloodGroup parametresi eklendi
  // Eğer kan grubu geçersizse, varsayılan listeyi veya boş listeyi döndür (tercih sizin)
  if (!bloodGroup || bloodGroup < 1 || bloodGroup > 4) {
    // Bu durumda, genellikle genel olarak yasak olan bazı ürünleri dönebiliriz.
    // Ama şimdilik sadece kan grubuna göre filtreleme yapacağız.
    return ["General Forbidden List: Sugar, Alcohol"];
  }

  // Amaç: groupBloodNotAllowed dizisinde, kullanıcının kan grubu indisine karşılık gelen değerin
  // TRUE (yasaklı) olduğu ürünleri bulmak.

  // Kan grubu indisine karşılık gelen alanda TRUE olan ürünleri sorgula.
  let bloodGroupFilter = {};
  bloodGroupFilter[`groupBloodNotAllowed.${bloodGroup}`] = true;

  const forbiddenItems = await Product.find(bloodGroupFilter)
    .select("title")
    .limit(50); // İlk 50 yasaklı ürünü döndür.

  // Sadece ürün başlıklarını içeren bir dizi döndür.
  return forbiddenItems.map((item) => item.title);
}

export { calculateDailyCalorieIntake, getForbiddenProducts };
