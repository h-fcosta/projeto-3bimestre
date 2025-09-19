import { UserModel } from "../models/UserModel.js";

/**
 * Controller de Usuários - Lógica de negócio
 */
export class UserController {
  // Criar novo usuário
  static async create(req, res) {
    try {
      const { name, email, password } = req.body;

      // Validação básica
      if (!name || !email || !password) {
        return res.status(400).json({
          error: "Nome, email e senha são obrigatórios"
        });
      }

      // Verificar se email já existe
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          error: "E-mail já cadastrado"
        });
      }

      const novoUsuario = await UserModel.create({ name, email, password });
      res.status(201).json(novoUsuario);
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // Listar todos os usuários
  static async findAll(req, res) {
    try {
      const usuarios = await UserModel.findMany();
      res.json(usuarios);
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
      res.status(500).json({ error: "Erro ao listar usuários" });
    }
  }

  // Buscar usuário por ID
  static async findById(req, res) {
    try {
      const { id } = req.params;

      const usuario = await UserModel.findById(id);
      if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      res.json(usuario);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      res.status(500).json({ error: "Erro ao buscar usuário" });
    }
  }

  // Atualizar usuário
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, email, password } = req.body;

      // Verificar se usuário existe
      const existingUser = await UserModel.findById(id);
      if (!existingUser) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      // Verificar se novo email já existe em outro usuário
      if (email && email !== existingUser.email) {
        const emailExists = await UserModel.findByEmail(email);
        if (emailExists) {
          return res.status(409).json({ error: "E-mail já cadastrado" });
        }
      }

      const usuarioAtualizado = await UserModel.update(id, {
        name,
        email,
        password
      });
      res.json(usuarioAtualizado);
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      res.status(500).json({ error: "Erro ao atualizar usuário" });
    }
  }

  // Deletar usuário
  static async delete(req, res) {
    try {
      const { id } = req.params;

      const usuario = await UserModel.findById(id);
      if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      await UserModel.delete(id);
      res.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      res.status(500).json({ error: "Erro ao deletar usuário" });
    }
  }
}
