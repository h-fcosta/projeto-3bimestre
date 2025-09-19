import { Router } from "express";
import { ProductController } from "../controllers/ProductController.js";

const router = Router();

/**
 * Rotas para Produtos
 * Prefixo: /products
 */

// CREATE: POST /products
router.post("/", ProductController.create);

// READ: GET /products
router.get("/", ProductController.findAll);

// READ Individual: GET /products/:id
router.get("/:id", ProductController.findById);

// UPDATE: PUT /products/:id
router.put("/:id", ProductController.update);

// DELETE: DELETE /products/:id
router.delete("/:id", ProductController.delete);

export default router;
