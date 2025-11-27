import express from "express";
import { searchProducts } from "../../../controllers/productController.js";

const router = express.Router();

// GET /api/v1/products/search?query=...&bloodGroup=...
router.get("/search", searchProducts);

export default router;
