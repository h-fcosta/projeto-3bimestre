/**
 * Middleware global para tratamento de erros
 */
export const errorHandler = (error, req, res, next) => {
  console.error("Erro capturado:", error);

  // Erros do Prisma
  if (error.code) {
    switch (error.code) {
      case "P2002":
        return res.status(409).json({
          error: "Dados duplicados: " + error.meta?.target?.join(", ")
        });

      case "P2003":
        return res.status(400).json({
          error: "Erro de relacionamento: referência inválida"
        });

      case "P2025":
        return res.status(404).json({
          error: "Registro não encontrado"
        });

      default:
        return res.status(500).json({
          error: "Erro de banco de dados"
        });
    }
  }

  // Erro de validação do Express
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({
      error: "JSON inválido na requisição"
    });
  }

  // Erro genérico
  return res.status(500).json({
    error: "Erro interno do servidor"
  });
};

/**
 * Middleware para capturar rotas não encontradas
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: `Rota ${req.method} ${req.path} não encontrada`
  });
};

/**
 * Middleware para logs de requisições
 */
export const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
};
