// Importações principais
import express from "express";
import dotenv from "dotenv";

// Importar rotas
import userRoutes from "./routes/userRoutes.js";
import storeRoutes from "./routes/storeRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import storeProductRoutes from "./routes/storeProductRoutes.js";

// Importar middlewares
import {
  errorHandler,
  notFoundHandler,
  requestLogger
} from "./middlewares/errorHandler.js";
import {
  validateUserCreation,
  validateUserUpdate
} from "./middlewares/validation.js";

// Carregar variáveis de ambiente
dotenv.config();

// Criar aplicação Express
const app = express();

// ========================= MIDDLEWARES GLOBAIS =========================
app.use(express.json()); // Parser JSON
app.use(requestLogger); // Log das requisições

// ========================= ROTAS DE HEALTHCHECK =========================
app.get("/", (_req, res) => {
  res.json({
    ok: true,
    service: "API 3º Bimestre - Arquitetura MVC",
    version: "2.0.0"
  });
});

app.get("/status", (_req, res) => {
  res.json({
    message: "API Online",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

// ========================= ROTAS DA API =========================

// Rotas de usuários (com validação)
app.use("/usuarios", userRoutes);

// Rotas de lojas
app.use("/stores", storeRoutes);

// Rotas de produtos
app.use("/products", productRoutes);

// Rotas relacionais (stores/:id/products)
app.use("/stores", storeProductRoutes);

// ========================= MIDDLEWARES DE ERROR =========================
app.use(notFoundHandler); // 404 - Rota não encontrada
app.use(errorHandler); // Tratamento global de erros

// ========================= INICIALIZAR SERVIDOR =========================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("\n🚀 ===== SERVIDOR INICIADO ===== 🚀");
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🏗️  Arquitetura: MVC`);
  console.log(`📅 Data: ${new Date().toLocaleString()}`);
  console.log("🎯 Endpoints disponíveis:");
  console.log("   📋 GET  /              - Healthcheck");
  console.log("   📋 GET  /status        - Status da API");
  console.log("   👤 CRUD /usuarios      - Gerenciar usuários");
  console.log("   🏪 CRUD /stores        - Gerenciar lojas");
  console.log("   📦 CRUD /products      - Gerenciar produtos");
  console.log("   🔗 GET  /stores/:id/products - Produtos por loja");
  console.log("🎓 ================================= 🎓\n");
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 Servidor sendo finalizado...");
  process.exit(0);
});
