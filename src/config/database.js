// Conexão com o banco de dados usando Prisma
import { PrismaClient } from "@prisma/client";

// Criar uma única instância do Prisma (padrão Singleton)
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"] // Logs para desenvolvimento
});

// Conectar ao banco quando o módulo for carregado
prisma
  .$connect()
  .then(() => {
    console.log("✅ Conectado ao banco de dados!");
  })
  .catch((error) => {
    console.error("❌ Erro ao conectar:", error.message);
  });

// Função para desconectar (útil para testes)
export const disconnect = async () => {
  await prisma.$disconnect();
};

// Exportar a instância para usar nos controllers
export default prisma;
