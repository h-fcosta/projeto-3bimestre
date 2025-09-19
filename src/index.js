// Importar as bibliotecas necessárias
import express from "express";
import dotenv from "dotenv";
import prisma from "./db.js"; // Importar nossa conexão com o banco

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

// Criar aplicação Express
const app = express();

// Middleware para processar JSON nas requisições
app.use(express.json());

//Healthcheck
app.get("/", (_req, res) => res.json({ ok: true, service: "API 3º Bimestre" }));

//CREATE: POST /usuarios
app.post("/usuarios", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const novoUsuario = await prisma.user.create({
      data: { name, email, password }
    });

    res.status(201).json(novoUsuario);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "E-mail já cadastrado" });
    }

    res.status(500).json({ error: "Erro ao criar usuário" });
  }
});

//READ: GET /usuarios
app.get("/usuarios", async (_req, res) => {
  try {
    const usuarios = await prisma.user.findMany({
      orderBy: { id: "asc" }
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar usuários" });
  }
});

//READ Individual: GET /usuarios/:id
app.get("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await prisma.user.findUnique({
      where: { id: parseInt(id) }
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
});

//UPDATE: PUT /usuarios/:id
app.put("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const usuarioAtualizado = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { name, email, password }
    });

    res.json(usuarioAtualizado);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    if (error.code === "P2002") {
      return res.status(409).json({ error: "E-mail já cadastrado" });
    }

    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});

//DELETE: DELETE /usuarios/:id
app.delete("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id: parseInt(id) }
    });

    res.status(204).send(); // Status 204: No Content (sucesso sem retorno)
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.status(500).json({ error: "Erro ao deletar usuário" });
  }
});

// ========================= ROTAS DE STORES =========================

//CREATE: POST /stores
app.post("/stores", async (req, res) => {
  try {
    const { name, userId } = req.body;

    const novaLoja = await prisma.store.create({
      data: { name, userId },
      include: { user: true } // Incluir dados do usuário
    });

    res.status(201).json(novaLoja);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Usuário já possui uma loja" });
    }
    if (error.code === "P2003") {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.status(500).json({ error: "Erro ao criar loja" });
  }
});

//READ: GET /stores
app.get("/stores", async (_req, res) => {
  try {
    const lojas = await prisma.store.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        products: true
      },
      orderBy: { id: "asc" }
    });
    res.json(lojas);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar lojas" });
  }
});

//READ Individual: GET /stores/:id
app.get("/stores/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const loja = await prisma.store.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: { select: { id: true, name: true, email: true } },
        products: true
      }
    });

    if (!loja) {
      return res.status(404).json({ error: "Loja não encontrada" });
    }

    res.json(loja);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar loja" });
  }
});

//UPDATE: PUT /stores/:id
app.put("/stores/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const lojaAtualizada = await prisma.store.update({
      where: { id: parseInt(id) },
      data: { name },
      include: { user: true, products: true }
    });

    res.json(lojaAtualizada);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Loja não encontrada" });
    }

    res.status(500).json({ error: "Erro ao atualizar loja" });
  }
});

//DELETE: DELETE /stores/:id
app.delete("/stores/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.store.delete({
      where: { id: parseInt(id) }
    });

    res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Loja não encontrada" });
    }

    res.status(500).json({ error: "Erro ao deletar loja" });
  }
});

// ========================= ROTAS DE PRODUCTS =========================

//CREATE: POST /products
app.post("/products", async (req, res) => {
  try {
    const { name, price, storeId } = req.body;

    const novoProduto = await prisma.product.create({
      data: { name, price, storeId },
      include: { store: true }
    });

    res.status(201).json(novoProduto);
  } catch (error) {
    if (error.code === "P2003") {
      return res.status(404).json({ error: "Loja não encontrada" });
    }

    res.status(500).json({ error: "Erro ao criar produto" });
  }
});

//READ: GET /products
app.get("/products", async (_req, res) => {
  try {
    const produtos = await prisma.product.findMany({
      include: {
        store: {
          select: { id: true, name: true, user: { select: { name: true } } }
        }
      },
      orderBy: { id: "asc" }
    });
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar produtos" });
  }
});

//READ Individual: GET /products/:id
app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const produto = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        store: {
          select: { id: true, name: true, user: { select: { name: true } } }
        }
      }
    });

    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.json(produto);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar produto" });
  }
});

//UPDATE: PUT /products/:id
app.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;

    const produtoAtualizado = await prisma.product.update({
      where: { id: parseInt(id) },
      data: { name, price },
      include: { store: true }
    });

    res.json(produtoAtualizado);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.status(500).json({ error: "Erro ao atualizar produto" });
  }
});

//DELETE: DELETE /products/:id
app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id: parseInt(id) }
    });

    res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.status(500).json({ error: "Erro ao deletar produto" });
  }
});

//READ: GET /stores/:id/products (Produtos de uma loja específica)
app.get("/stores/:id/products", async (req, res) => {
  try {
    const { id } = req.params;
    const produtos = await prisma.product.findMany({
      where: { storeId: parseInt(id) },
      include: {
        store: { select: { id: true, name: true } }
      },
      orderBy: { id: "asc" }
    });

    res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar produtos da loja" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

//ROTA DE TESTE
app.get("/status", (req, res) => {
  res.json({ message: "API Online" });
});
