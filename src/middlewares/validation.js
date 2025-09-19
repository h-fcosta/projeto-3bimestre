/**
 * Middleware de validação para criação de usuários
 */
export const validateUserCreation = (req, res, next) => {
  const { name, email, password } = req.body;

  // Validar campos obrigatórios
  if (!name || !email || !password) {
    return res.status(400).json({
      error: "Nome, email e senha são obrigatórios"
    });
  }

  // Validar formato do email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: "Formato de email inválido"
    });
  }

  // Validar tamanho da senha
  if (password.length < 6) {
    return res.status(400).json({
      error: "Senha deve ter pelo menos 6 caracteres"
    });
  }

  // Validar tamanho do nome
  if (name.length < 2) {
    return res.status(400).json({
      error: "Nome deve ter pelo menos 2 caracteres"
    });
  }

  next();
};

/**
 * Middleware de validação para atualização de usuários
 */
export const validateUserUpdate = (req, res, next) => {
  const { name, email, password } = req.body;

  // Se email fornecido, validar formato
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Formato de email inválido"
      });
    }
  }

  // Se senha fornecida, validar tamanho
  if (password && password.length < 6) {
    return res.status(400).json({
      error: "Senha deve ter pelo menos 6 caracteres"
    });
  }

  // Se nome fornecido, validar tamanho
  if (name && name.length < 2) {
    return res.status(400).json({
      error: "Nome deve ter pelo menos 2 caracteres"
    });
  }

  next();
};
