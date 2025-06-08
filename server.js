/**
 * Servidor Principal - Sistema Universitario
 * Universidad del Valle de Guatemala
 * CC3088 - Bases de Datos 1
 */

require("dotenv").config();
const app = require("./src/app");
const { sequelize } = require("./src/models");

const PORT = process.env.PORT || 3000;

/**
 * Función para inicializar el servidor
 */
async function iniciarServidor() {
  try {
    // Verificar conexión a la base de datos
    console.log("🔌 Conectando a la base de datos...");
    await sequelize.authenticate();
    console.log("✅ Conexión a PostgreSQL establecida exitosamente");

    // Verificar que las tablas existan (sin sincronizar)
    console.log("🔍 Verificando estructura de base de datos...");
    const tablas = await sequelize.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'",
      { type: sequelize.QueryTypes.SELECT }
    );

    if (tablas.length === 0) {
      console.warn(
        "⚠️  No se encontraron tablas. Ejecute los scripts de schema.sql y data.sql"
      );
    } else {
      console.log(
        `✅ Base de datos verificada: ${tablas.length} tablas encontradas`
      );
    }

    // Iniciar servidor HTTP
    const server = app.listen(PORT, () => {
      console.log("\n🚀 ========================================");
      console.log(`🚀 Servidor iniciado en puerto ${PORT}`);
      console.log(`🚀 Ambiente: ${process.env.NODE_ENV || "development"}`);
      console.log(`🚀 URL: http://localhost:${PORT}`);
      console.log("🚀 ========================================\n");

      // Mostrar endpoints disponibles
      console.log("📋 Endpoints API disponibles:");
      console.log("   GET    /api/estudiantes");
      console.log("   POST   /api/estudiantes");
      console.log("   GET    /api/estudiantes/:id");
      console.log("   PUT    /api/estudiantes/:id");
      console.log("   DELETE /api/estudiantes/:id");
      console.log("   POST   /api/estudiantes/:id/inscripciones");
      console.log("");
      console.log("   GET    /api/secciones");
      console.log("   POST   /api/secciones");
      console.log("   GET    /api/secciones/:id");
      console.log("   PUT    /api/secciones/:id");
      console.log("   DELETE /api/secciones/:id");
      console.log("");
      console.log("   GET    /api/reportes/estudiantes-por-facultad");
      console.log("   GET    /api/reportes/secciones-demanda");
      console.log("   GET    /api/reportes/rendimiento-academico");
      console.log("");
      console.log("📊 Herramientas de administración:");
      if (process.env.NODE_ENV === "development") {
        console.log("   Adminer: http://localhost:8080");
        console.log("   pgAdmin: http://localhost:5050");
      }
      console.log("");
    });

    // Manejo graceful de cierre del servidor
    process.on("SIGTERM", () => {
      console.log("\n🛑 Recibida señal SIGTERM, cerrando servidor...");
      server.close(async () => {
        console.log("🔌 Cerrando conexiones de base de datos...");
        await sequelize.close();
        console.log("✅ Servidor cerrado correctamente");
        process.exit(0);
      });
    });

    process.on("SIGINT", () => {
      console.log("\n🛑 Recibida señal SIGINT (Ctrl+C), cerrando servidor...");
      server.close(async () => {
        console.log("🔌 Cerrando conexiones de base de datos...");
        await sequelize.close();
        console.log("✅ Servidor cerrado correctamente");
        process.exit(0);
      });
    });

    // Manejo de errores no capturados
    process.on("unhandledRejection", (reason, promise) => {
      console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
      server.close(async () => {
        await sequelize.close();
        process.exit(1);
      });
    });

    process.on("uncaughtException", (error) => {
      console.error("❌ Uncaught Exception:", error);
      server.close(async () => {
        await sequelize.close();
        process.exit(1);
      });
    });
  } catch (error) {
    console.error("❌ Error al inicializar el servidor:", error.message);
    console.error("💡 Sugerencias:");
    console.error("   1. Verificar que PostgreSQL esté ejecutándose");
    console.error("   2. Verificar las credenciales en el archivo .env");
    console.error("   3. Ejecutar: npm run setup (para crear la BD)");
    console.error("   4. Ejecutar: npm run seed (para cargar datos)");
    process.exit(1);
  }
}

// Iniciar el servidor solo si este archivo se ejecuta directamente
if (require.main === module) {
  iniciarServidor();
}

module.exports = { iniciarServidor };
