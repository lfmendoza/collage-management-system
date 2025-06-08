/**
 * Middleware de Manejo de Errores
 * Sistema Universitario
 */

const {
  ValidationError,
  DatabaseError,
  ForeignKeyConstraintError,
  UniqueConstraintError,
} = require("sequelize");

/**
 * Middleware principal de manejo de errores
 */
const errorHandler = (error, req, res, next) => {
  console.error("Error capturado:", {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Error de validación de Sequelize
  if (error instanceof ValidationError) {
    return res.status(400).json({
      error: "Error de validación",
      message: "Los datos proporcionados no son válidos",
      details: error.errors.map((err) => ({
        field: err.path,
        message: err.message,
        value: err.value,
      })),
      timestamp: new Date().toISOString(),
    });
  }

  // Error de restricción única
  if (error instanceof UniqueConstraintError) {
    const field = error.errors[0]?.path || "campo";
    return res.status(409).json({
      error: "Conflicto de datos",
      message: `Ya existe un registro con este ${field}`,
      field: field,
      timestamp: new Date().toISOString(),
    });
  }

  // Error de clave foránea
  if (error instanceof ForeignKeyConstraintError) {
    return res.status(400).json({
      error: "Error de referencia",
      message: "El registro hace referencia a datos que no existen",
      details: error.parent?.detail || error.message,
      timestamp: new Date().toISOString(),
    });
  }

  // Error general de base de datos
  if (error instanceof DatabaseError) {
    return res.status(500).json({
      error: "Error de base de datos",
      message: "Error interno en la base de datos",
      timestamp: new Date().toISOString(),
    });
  }

  // Error de sintaxis JSON
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({
      error: "JSON inválido",
      message: "El formato JSON de la petición no es válido",
      timestamp: new Date().toISOString(),
    });
  }

  // Errores personalizados con status
  if (error.status || error.statusCode) {
    return res.status(error.status || error.statusCode).json({
      error: error.name || "Error",
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }

  // Error por defecto
  res.status(500).json({
    error: "Error interno del servidor",
    message:
      process.env.NODE_ENV === "production"
        ? "Ha ocurrido un error interno"
        : error.message,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Middleware para manejar rutas no encontradas
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada",
    message: `La ruta ${req.method} ${req.originalUrl} no existe`,
    suggestion: "Verifique la URL y el método HTTP",
    timestamp: new Date().toISOString(),
  });
};

/**
 * Wrapper para funciones async en routes
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Middleware de validación de parámetros
 */
const validateParams = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.params);
    if (error) {
      return res.status(400).json({
        error: "Parámetros inválidos",
        message: error.details[0].message,
        timestamp: new Date().toISOString(),
      });
    }
    next();
  };
};

/**
 * Middleware de validación de body
 */
const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: "Datos inválidos",
        message: error.details[0].message,
        details: error.details.map((detail) => ({
          field: detail.path.join("."),
          message: detail.message,
        })),
        timestamp: new Date().toISOString(),
      });
    }
    next();
  };
};

/**
 * Middleware de validación de query parameters
 */
const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query);
    if (error) {
      return res.status(400).json({
        error: "Parámetros de consulta inválidos",
        message: error.details[0].message,
        timestamp: new Date().toISOString(),
      });
    }
    next();
  };
};

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler,
  validateParams,
  validateBody,
  validateQuery,
};
