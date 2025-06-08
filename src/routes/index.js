/**
 * Rutas Principales de la API
 * Sistema Universitario - COMPLETO
 */

const express = require("express");
const router = express.Router();

// Importar rutas específicas
const estudiantesRoutes = require("./estudiantes");
const seccionesRoutes = require("./secciones");
const reportesRoutes = require("./reportes");

// ====================================
// MIDDLEWARE DE VALIDACIÓN GENERAL
// ====================================

// Middleware para validar Content-Type en requests POST/PUT
const validateContentType = (req, res, next) => {
  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    if (!req.is("application/json")) {
      return res.status(400).json({
        error: "Content-Type inválido",
        message: "Se requiere Content-Type: application/json",
        received: req.get("Content-Type") || "no especificado",
      });
    }
  }
  next();
};

// Middleware de logging para desarrollo
const requestLogger = (req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    console.log(
      `📡 ${req.method} ${req.originalUrl} - ${new Date().toISOString()}`
    );
  }
  next();
};

// Aplicar middleware globales
router.use(requestLogger);
router.use(validateContentType);

// ====================================
// INFORMACIÓN DE LA API
// ====================================

router.get("/", (req, res) => {
  res.json({
    name: "Sistema Universitario API",
    version: "1.0.0",
    description: "API REST para gestión académica universitaria",
    timestamp: new Date().toISOString(),
    endpoints: {
      estudiantes: {
        description: "Gestión completa de estudiantes",
        path: "/api/estudiantes",
        methods: ["GET", "POST", "PUT", "DELETE"],
        features: [
          "CRUD completo",
          "Búsqueda avanzada",
          "Historial académico",
          "Inscripciones en secciones",
        ],
      },
      secciones: {
        description: "Gestión de secciones académicas",
        path: "/api/secciones",
        methods: ["GET", "POST", "PUT", "DELETE"],
        features: [
          "CRUD completo",
          "Filtros por ciclo/modalidad",
          "Estadísticas de demanda",
          "Control de cupos",
        ],
      },
      reportes: {
        description: "Reportes y estadísticas del sistema",
        path: "/api/reportes",
        methods: ["GET"],
        features: [
          "Estudiantes por facultad",
          "Demanda de secciones",
          "Rendimiento académico",
          "Exportación a CSV",
        ],
      },
    },
    university: "Universidad del Valle de Guatemala",
    course: "CC3088 - Bases de Datos 1",
    semester: "Ciclo 1, 2025",
    technologies: ["Node.js", "Express", "PostgreSQL", "Sequelize"],
    documentation: {
      postman: "/api/docs/postman",
      openapi: "/api/docs/swagger",
    },
  });
});

// ====================================
// RUTAS DE RECURSOS PRINCIPALES
// ====================================

// Rutas de estudiantes
router.use("/estudiantes", estudiantesRoutes);

// Rutas de secciones
router.use("/secciones", seccionesRoutes);

// Rutas de reportes
router.use("/reportes", reportesRoutes);

// ====================================
// RUTAS DE ESTADÍSTICAS GENERALES
// ====================================

router.get("/stats", async (req, res) => {
  try {
    const { sequelize } = require("../models");

    // Obtener estadísticas básicas del sistema
    const stats = await sequelize.query(
      `
      SELECT 
        (SELECT COUNT(*) FROM estudiantes WHERE estado = 'activo') as estudiantes_activos,
        (SELECT COUNT(*) FROM estudiantes WHERE estado = 'graduado') as estudiantes_graduados,
        (SELECT COUNT(*) FROM estudiantes) as total_estudiantes,
        (SELECT COUNT(*) FROM profesores WHERE activo = true) as profesores_activos,
        (SELECT COUNT(*) FROM secciones WHERE ciclo = '2025-1' AND activa = true) as secciones_actuales,
        (SELECT COUNT(*) FROM inscripciones i 
         INNER JOIN secciones s ON i.seccion_id = s.id 
         WHERE s.ciclo = '2025-1' AND i.estado = 'inscrito') as inscripciones_actuales,
        (SELECT COUNT(*) FROM facultades WHERE activa = true) as facultades_activas,
        (SELECT COUNT(*) FROM carreras WHERE activa = true) as carreras_activas,
        (SELECT COUNT(*) FROM materias WHERE activa = true) as materias_activas,
        (SELECT ROUND(AVG(promedio_general), 2) FROM estudiantes WHERE promedio_general > 0) as promedio_general_sistema
    `,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // Estadísticas de inscripciones por estado
    const estadosInscripciones = await sequelize.query(
      `
      SELECT 
        estado,
        COUNT(*) as cantidad
      FROM inscripciones i
      INNER JOIN secciones s ON i.seccion_id = s.id
      WHERE s.ciclo = '2025-1'
      GROUP BY estado
      ORDER BY cantidad DESC
    `,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.json({
      success: true,
      data: {
        timestamp: new Date().toISOString(),
        ciclo_actual: "2025-1",
        estadisticas_generales: stats[0],
        distribucion_inscripciones: estadosInscripciones,
        resumen: {
          tasa_actividad_estudiantes:
            stats[0].total_estudiantes > 0
              ? Math.round(
                  (stats[0].estudiantes_activos / stats[0].total_estudiantes) *
                    100 *
                    100
                ) / 100
              : 0,
          ratio_estudiante_profesor:
            stats[0].profesores_activos > 0
              ? Math.round(
                  (stats[0].estudiantes_activos / stats[0].profesores_activos) *
                    100
                ) / 100
              : 0,
        },
      },
      message: "Estadísticas del sistema obtenidas exitosamente",
    });
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudieron obtener las estadísticas del sistema",
    });
  }
});

// ====================================
// RUTA DE INFORMACIÓN DE LA BD
// ====================================

router.get("/database-info", async (req, res) => {
  try {
    const { getDatabaseInfo } = require("../config/database");
    const { validateTables, getSystemStats } = require("../models");

    const [dbInfo, tableValidation, systemStats] = await Promise.all([
      getDatabaseInfo(),
      validateTables(),
      getSystemStats(),
    ]);

    res.json({
      success: true,
      data: {
        database_info: dbInfo,
        table_status: tableValidation,
        system_stats: systemStats,
        timestamp: new Date().toISOString(),
      },
      message: "Información de base de datos obtenida exitosamente",
    });
  } catch (error) {
    console.error("Error obteniendo info de BD:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: error.message,
    });
  }
});

// ====================================
// RUTA DE SALUD DEL SISTEMA
// ====================================

router.get("/health", async (req, res) => {
  try {
    const { sequelize } = require("../models");

    // Verificar conexión a BD
    await sequelize.authenticate();

    // Verificar que hay datos básicos
    const basicChecks = await sequelize.query(
      `
      SELECT 
        (SELECT COUNT(*) FROM estudiantes) as has_students,
        (SELECT COUNT(*) FROM profesores) as has_professors,
        (SELECT COUNT(*) FROM secciones) as has_sections
    `,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const checks = basicChecks[0];
    const isHealthy =
      checks.has_students > 0 &&
      checks.has_professors > 0 &&
      checks.has_sections > 0;

    res.status(isHealthy ? 200 : 503).json({
      status: isHealthy ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      version: require("../../package.json").version,
      database: {
        connected: true,
        has_data: isHealthy,
      },
      checks: {
        students: checks.has_students > 0,
        professors: checks.has_professors > 0,
        sections: checks.has_sections > 0,
      },
    });
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      error: error.message,
      database: {
        connected: false,
      },
    });
  }
});

// ====================================
// RUTAS DE UTILIDAD
// ====================================

// Ruta para obtener opciones de filtros
router.get("/filter-options", async (req, res) => {
  try {
    const { sequelize } = require("../models");

    const options = await sequelize.query(
      `
      SELECT 
        'facultades' as tipo,
        json_agg(json_build_object('id', id, 'nombre', nombre, 'codigo', codigo)) as opciones
      FROM facultades WHERE activa = true
      UNION ALL
      SELECT 
        'carreras' as tipo,
        json_agg(json_build_object('id', id, 'nombre', nombre, 'codigo', codigo, 'facultad_id', facultad_id)) as opciones
      FROM carreras WHERE activa = true
      UNION ALL
      SELECT 
        'ciclos' as tipo,
        json_agg(DISTINCT ciclo) as opciones
      FROM secciones WHERE activa = true
      ORDER BY ciclo DESC
    `,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const filterOptions = {};
    options.forEach((option) => {
      filterOptions[option.tipo] = option.opciones;
    });

    res.json({
      success: true,
      data: filterOptions,
      message: "Opciones de filtros obtenidas exitosamente",
    });
  } catch (error) {
    console.error("Error obteniendo opciones de filtros:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudieron obtener las opciones de filtros",
    });
  }
});

// ====================================
// DOCUMENTACIÓN DE LA API
// ====================================

router.get("/docs", (req, res) => {
  res.json({
    title: "Sistema Universitario API - Documentación",
    version: "1.0.0",
    description: "API REST completa para gestión académica universitaria",
    base_url: `${req.protocol}://${req.get("host")}/api`,
    endpoints: {
      authentication: "No requerida para esta versión",
      rate_limiting: "No implementado en esta versión",
      pagination: "Disponible en endpoints de listado (page, limit)",
      filtering: "Múltiples filtros disponibles por endpoint",
      sorting: "Disponible en la mayoría de endpoints",
      error_handling: "Respuestas estructuradas con códigos HTTP apropiados",
    },
    examples: {
      get_students: `GET ${req.protocol}://${req.get(
        "host"
      )}/api/estudiantes?page=1&limit=10&estado=activo`,
      create_student: `POST ${req.protocol}://${req.get(
        "host"
      )}/api/estudiantes`,
      get_sections_by_cycle: `GET ${req.protocol}://${req.get(
        "host"
      )}/api/secciones/ciclo/2025-1`,
      generate_report: `GET ${req.protocol}://${req.get(
        "host"
      )}/api/reportes/estudiantes-por-facultad`,
    },
    response_format: {
      success: {
        success: true,
        data: "{ ... }",
        message: "Descripción del resultado",
      },
      error: {
        success: false,
        error: "Tipo de error",
        message: "Descripción del error",
      },
    },
    contact: {
      university: "Universidad del Valle de Guatemala",
      course: "CC3088 - Bases de Datos 1",
      semester: "Ciclo 1, 2025",
    },
  });
});

module.exports = router;
