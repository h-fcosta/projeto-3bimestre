import prisma from "../config/database.js";

/**
 * Modelo Store - Operações relacionadas às lojas
 */
export class StoreModel {
  // Criar nova loja
  static async create(storeData) {
    return await prisma.store.create({
      data: storeData,
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    });
  }

  // Buscar todas as lojas
  static async findMany() {
    return await prisma.store.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        products: true
      },
      orderBy: { id: "asc" }
    });
  }

  // Buscar loja por ID
  static async findById(id) {
    return await prisma.store.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: { select: { id: true, name: true, email: true } },
        products: true
      }
    });
  }

  // Buscar loja por usuário
  static async findByUserId(userId) {
    return await prisma.store.findUnique({
      where: { userId: parseInt(userId) },
      include: {
        user: { select: { id: true, name: true, email: true } },
        products: true
      }
    });
  }

  // Atualizar loja
  static async update(id, storeData) {
    return await prisma.store.update({
      where: { id: parseInt(id) },
      data: storeData,
      include: { user: true, products: true }
    });
  }

  // Deletar loja
  static async delete(id) {
    return await prisma.store.delete({
      where: { id: parseInt(id) }
    });
  }
}
