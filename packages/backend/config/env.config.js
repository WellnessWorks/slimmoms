import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// İki seviye yukarı (kök dizine) çıkıyoruz
const envPath = path.join(__dirname, "..", "..", "..", ".env");
// DİKKAT: config klasöründen (3 seviye) kök dizine çıkıyoruz.
// paths.join(__dirname, '..') -> /config
// paths.join(__dirname, '..', '..') -> /backend
// paths.join(__dirname, '..', '..', '..') -> /packages

dotenv.config({ path: envPath });

// Kullanılacak değişkenleri dışa aktar
export const PORT = process.env.PORT || 4000;
export const MONGODB_URI = process.env.MONGODB_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
