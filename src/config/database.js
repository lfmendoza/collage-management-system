/**
 * Configuración de Base de Datos
 * Sistema Universitario - PostgreSQL con Sequelize
 */

const { Sequelize } = require("sequelize");

// Configuración de la base de datos
const databaseConfig = {
  dialect: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "universidad_sistema",
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",

  // Configuración del pool de conexiones
  pool: {
    max: 20, // Máximo número de conexiones
    min: 0, // Mínimo número de conexiones
    acquire: 30000, // Tiempo máximo para obtener conexión (ms)
    idle: 10000, // Tiempo máximo que una conexión puede estar inactiva (ms)
  },

  // Configuración de logging
  logging: process.env.NODE_ENV === "development" ? console.log : false,

  // Configuración de Sequelize
  define: {
    timestamps: true, // created_at y updated_at automáticos
    underscored: true, // snake_case para nombres de columnas
    createdAt: "created_at", // Nombre personalizado para created_at
    updatedAt: "updated_at", // Nombre personalizado para updated_at
    freezeTableName: true, // No pluralizar nombres de tablas
    paranoid: false, // No usar soft deletes por defecto
  },

  // Configuración de timezone
  timezone: "-06:00", // Guatemala timezone (UTC-6)

  // Configuración de dialectos específicos
  dialectOptions: {
    timezone: "local",
    useUTC: false,
    dateStrings: true,
    typeCast: true,
  },

  // Configuración de retry
  retry: {
    max: 3,
  },

  // Configuración de benchmark
  benchmark: process.env.NODE_ENV === "development",
};

// Crear instancia de Sequelize
const sequelize = new Sequelize(databaseConfig);

// Función para probar la conexión
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a PostgreSQL establecida correctamente");
    return true;
  } catch (error) {
    console.error("❌ Error de conexión a PostgreSQL:", error.message);
    return false;
  }
}

// Función para cerrar la conexión
async function closeConnection() {
  try {
    await sequelize.close();
    console.log("🔌 Conexión a PostgreSQL cerrada correctamente");
  } catch (error) {
    console.error("❌ Error al cerrar conexión a PostgreSQL:", error.message);
  }
}

// Función para ejecutar queries raw
async function executeRawQuery(query, options = {}) {
  try {
    const result = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      ...options,
    });
    return { success: true, data: result };
  } catch (error) {
    console.error("❌ Error ejecutando query:", error.message);
    return { success: false, error: error.message };
  }
}

// Función para obtener información de la base de datos
async function getDatabaseInfo() {
  try {
    const info = await sequelize.query(
      `
      SELECT 
        current_database() as database_name,
        current_user as current_user,
        version() as postgresql_version,
        now() as current_time,
        current_setting('timezone') as timezone
    `,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const tableCount = await sequelize.query(
      `
      SELECT COUNT(*) as table_count
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `,
      { type: Sequelize.QueryTypes.SELECT }
    );

    return {
      ...info[0],
      table_count: parseInt(tableCount[0].table_count),
    };
  } catch (error) {
    console.error("❌ Error obteniendo información de BD:", error.message);
    return null;
  }
}

module.exports = {
  sequelize,
  databaseConfig,
  testConnection,
  closeConnection,
  executeRawQuery,
  getDatabaseInfo,
};
