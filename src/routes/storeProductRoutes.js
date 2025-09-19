import { Router } from "express";
import { ProductController } from "../controllers/ProductController.js";

const router = Router();

/**
 * Rotas relacionadas entre Stores e Products
 * Prefixo: /stores/:storeId/products
 */

// READ: GET /stores/:storeId/products (Produtos de uma loja específica)
router.get("/:storeId/products", ProductController.findByStore);

export default router;
