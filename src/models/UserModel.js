import prisma from "../config/database.js";

/**
 * Modelo User - Operações relacionadas aos usuários
 */
export class UserModel {
  // Criar novo usuário
  static async create(userData) {
    return await prisma.user.create({
      data: userData
    });
  }

  // Buscar todos os usuários
  static async findMany() {
    return await prisma.user.findMany({
      orderBy: { id: "asc" },
      include: {
        store: true // Incluir dados da loja se existir
      }
    });
  }

  // Buscar usuário por ID
  static async findById(id) {
    return await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        store: {
          include: {
            products: true
          }
        }
      }
    });
  }

  // Buscar usuário por email
  static async findByEmail(email) {
    return await prisma.user.findUnique({
      where: { email }
    });
  }

  // Atualizar usuário
  static async update(id, userData) {
    return await prisma.user.update({
      where: { id: parseInt(id) },
      data: userData
    });
  }

  // Deletar usuário
  static async delete(id) {
    return await prisma.user.delete({
      where: { id: parseInt(id) }
    });
  }
}
