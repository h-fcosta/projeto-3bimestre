import { StoreModel } from "../models/StoreModel.js";
import { UserModel } from "../models/UserModel.js";

/**
 * Controller de Lojas - Lógica de negócio
 */
export class StoreController {
  // Criar nova loja
  static async create(req, res) {
    try {
      const { name, userId } = req.body;

      // Validação básica
      if (!name || !userId) {
        return res.status(400).json({
          error: "Nome da loja e ID do usuário são obrigatórios"
        });
      }

      // Verificar se usuário existe
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      // Verificar se usuário já tem loja
      const existingStore = await StoreModel.findByUserId(userId);
      if (existingStore) {
        return res.status(409).json({ error: "Usuário já possui uma loja" });
      }

      const novaLoja = await StoreModel.create({ name, userId });
      res.status(201).json(novaLoja);
    } catch (error) {
      console.error("Erro ao criar loja:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // Listar todas as lojas
  static async findAll(req, res) {
    try {
      const lojas = await StoreModel.findMany();
      res.json(lojas);
    } catch (error) {
      console.error("Erro ao listar lojas:", error);
      res.status(500).json({ error: "Erro ao listar lojas" });
    }
  }

  // Buscar loja por ID
  static async findById(req, res) {
    try {
      const { id } = req.params;

      const loja = await StoreModel.findById(id);
      if (!loja) {
        return res.status(404).json({ error: "Loja não encontrada" });
      }

      res.json(loja);
    } catch (error) {
      console.error("Erro ao buscar loja:", error);
      res.status(500).json({ error: "Erro ao buscar loja" });
    }
  }

  // Atualizar loja
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      // Verificar se loja existe
      const loja = await StoreModel.findById(id);
      if (!loja) {
        return res.status(404).json({ error: "Loja não encontrada" });
      }

      const lojaAtualizada = await StoreModel.update(id, { name });
      res.json(lojaAtualizada);
    } catch (error) {
      console.error("Erro ao atualizar loja:", error);
      res.status(500).json({ error: "Erro ao atualizar loja" });
    }
  }

  // Deletar loja
  static async delete(req, res) {
    try {
      const { id } = req.params;

      const loja = await StoreModel.findById(id);
      if (!loja) {
        return res.status(404).json({ error: "Loja não encontrada" });
      }

      await StoreModel.delete(id);
      res.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar loja:", error);
      res.status(500).json({ error: "Erro ao deletar loja" });
    }
  }
}
