import prisma from "../config/database.js";

/**
 * Modelo Product - Operações relacionadas aos produtos
 */
export class ProductModel {
  // Criar novo produto
  static async create(productData) {
    return await prisma.product.create({
      data: productData,
      include: {
        store: {
          select: { id: true, name: true, user: { select: { name: true } } }
        }
      }
    });
  }

  // Buscar todos os produtos
  static async findMany() {
    return await prisma.product.findMany({
      include: {
        store: {
          select: { id: true, name: true, user: { select: { name: true } } }
        }
      },
      orderBy: { id: "asc" }
    });
  }

  // Buscar produto por ID
  static async findById(id) {
    return await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        store: {
          select: { id: true, name: true, user: { select: { name: true } } }
        }
      }
    });
  }

  // Buscar produtos por loja
  static async findByStoreId(storeId) {
    return await prisma.product.findMany({
      where: { storeId: parseInt(storeId) },
      include: {
        store: { select: { id: true, name: true } }
      },
      orderBy: { id: "asc" }
    });
  }

  // Atualizar produto
  static async update(id, productData) {
    return await prisma.product.update({
      where: { id: parseInt(id) },
      data: productData,
      include: { store: true }
    });
  }

  // Deletar produto
  static async delete(id) {
    return await prisma.product.delete({
      where: { id: parseInt(id) }
    });
  }
}
