import { ProductModel } from "../models/ProductModel.js";
import { StoreModel } from "../models/StoreModel.js";

/**
 * Controller de Produtos - Lógica de negócio
 */
export class ProductController {
  // Criar novo produto
  static async create(req, res) {
    try {
      const { name, price, storeId } = req.body;

      // Validação básica
      if (!name || !price || !storeId) {
        return res.status(400).json({
          error: "Nome, preço e ID da loja são obrigatórios"
        });
      }

      // Validar se preço é positivo
      if (price <= 0) {
        return res.status(400).json({
          error: "Preço deve ser maior que zero"
        });
      }

      // Verificar se loja existe
      const store = await StoreModel.findById(storeId);
      if (!store) {
        return res.status(404).json({ error: "Loja não encontrada" });
      }

      const novoProduto = await ProductModel.create({ name, price, storeId });
      res.status(201).json(novoProduto);
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // Listar todos os produtos
  static async findAll(req, res) {
    try {
      const produtos = await ProductModel.findMany();
      res.json(produtos);
    } catch (error) {
      console.error("Erro ao listar produtos:", error);
      res.status(500).json({ error: "Erro ao listar produtos" });
    }
  }

  // Buscar produto por ID
  static async findById(req, res) {
    try {
      const { id } = req.params;

      const produto = await ProductModel.findById(id);
      if (!produto) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      res.json(produto);
    } catch (error) {
      console.error("Erro ao buscar produto:", error);
      res.status(500).json({ error: "Erro ao buscar produto" });
    }
  }

  // Buscar produtos por loja
  static async findByStore(req, res) {
    try {
      const { storeId } = req.params;

      const produtos = await ProductModel.findByStoreId(storeId);
      res.json(produtos);
    } catch (error) {
      console.error("Erro ao buscar produtos da loja:", error);
      res.status(500).json({ error: "Erro ao buscar produtos da loja" });
    }
  }

  // Atualizar produto
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, price } = req.body;

      // Validar preço se fornecido
      if (price !== undefined && price <= 0) {
        return res.status(400).json({
          error: "Preço deve ser maior que zero"
        });
      }

      // Verificar se produto existe
      const produto = await ProductModel.findById(id);
      if (!produto) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      const produtoAtualizado = await ProductModel.update(id, { name, price });
      res.json(produtoAtualizado);
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      res.status(500).json({ error: "Erro ao atualizar produto" });
    }
  }

  // Deletar produto
  static async delete(req, res) {
    try {
      const { id } = req.params;

      const produto = await ProductModel.findById(id);
      if (!produto) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      await ProductModel.delete(id);
      res.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      res.status(500).json({ error: "Erro ao deletar produto" });
    }
  }
}
