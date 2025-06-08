/**
 * Aplicación Express - Sistema Universitario
 * Configuración principal del servidor web
 */

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");

const routes = require("./routes");
const { errorHandler } = require("./middleware/errorHandler");

// Crear aplicación Express
const app = express();

// ====================================
// MIDDLEWARE DE SEGURIDAD
// ====================================

// Helmet para headers de seguridad
app.use(
  helmet({
    contentSecurityPolicy: false, // Para desarrollo
    crossOriginEmbedderPolicy: false,
  })
);

// Compresión de respuestas
app.use(compression());

// ====================================
// MIDDLEWARE DE LOGGING
// ====================================

// Morgan para logging de requests
const logFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";

app.use(morgan(logFormat));

// ====================================
// MIDDLEWARE DE CORS
// ====================================

const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-requested-with"],
};

app.use(cors(corsOptions));

// ====================================
// MIDDLEWARE DE PARSING
// ====================================

// Parsing de JSON y URL encoded
app.use(
  express.json({
    limit: "10mb",
    strict: true,
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// ====================================
// RUTAS DE SALUD Y INFORMACIÓN
// ====================================

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    version: require("../package.json").version,
  });
});

// Información de la API
app.get("/", (req, res) => {
  res.json({
    name: "Sistema de Gestión Universitaria API",
    version: require("../package.json").version,
    description: "API REST para gestión académica universitaria",
    documentation: "/api/docs",
    endpoints: {
      estudiantes: "/api/estudiantes",
      secciones: "/api/secciones",
      reportes: "/api/reportes",
      health: "/health",
    },
    university: "Universidad del Valle de Guatemala",
    course: "CC3088 - Bases de Datos 1",
    semester: "Ciclo 1, 2025",
  });
});

// ====================================
// RUTAS PRINCIPALES DE LA API
// ====================================

app.use("/api", routes);

// ====================================
// MANEJO DE RUTAS NO ENCONTRADAS
// ====================================

app.use("*", (req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada",
    message: `La ruta ${req.method} ${req.originalUrl} no existe`,
    suggestion: "Consulte la documentación en /",
    timestamp: new Date().toISOString(),
  });
});

// ====================================
// MIDDLEWARE DE MANEJO DE ERRORES
// ====================================

app.use(errorHandler);

// ====================================
// CONFIGURACIÓN ADICIONAL
// ====================================

// Deshabilitar header X-Powered-By
app.disable("x-powered-by");

// Trust proxy para aplicaciones detrás de reverse proxy
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

module.exports = app;
