import { Router } from "express";
import { UserController } from "../controllers/UserController.js";

const router = Router();

/**
 * Rotas para Usuários
 * Prefixo: /usuarios
 */

// CREATE: POST /usuarios
router.post("/", UserController.create);

// READ: GET /usuarios
router.get("/", UserController.findAll);

// READ Individual: GET /usuarios/:id
router.get("/:id", UserController.findById);

// UPDATE: PUT /usuarios/:id
router.put("/:id", UserController.update);

// DELETE: DELETE /usuarios/:id
router.delete("/:id", UserController.delete);

export default router;
