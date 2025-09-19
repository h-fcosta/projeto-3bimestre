import { Router } from "express";
import { StoreController } from "../controllers/StoreController.js";

const router = Router();

/**
 * Rotas para Lojas
 * Prefixo: /stores
 */

// CREATE: POST /stores
router.post("/", StoreController.create);

// READ: GET /stores
router.get("/", StoreController.findAll);

// READ Individual: GET /stores/:id
router.get("/:id", StoreController.findById);

// UPDATE: PUT /stores/:id
router.put("/:id", StoreController.update);

// DELETE: DELETE /stores/:id
router.delete("/:id", StoreController.delete);

export default router;
