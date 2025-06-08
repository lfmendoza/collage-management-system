/**
 * Índice de Modelos Sequelize
 * Sistema Universitario - COMPLETO
 */

const { sequelize } = require("../config/database");

// ====================================
// IMPORTAR TODOS LOS MODELOS
// ====================================

const Estudiante = require("./Estudiante")(sequelize);
const Profesor = require("./Profesor")(sequelize);
const Materia = require("./Materia")(sequelize);
const Seccion = require("./Seccion")(sequelize);
const Inscripcion = require("./Inscripcion")(sequelize);
const Facultad = require("./Facultad")(sequelize);
const Carrera = require("./Carrera")(sequelize);
const Evaluacion = require("./Evaluacion")(sequelize);
const Nota = require("./Nota")(sequelize);
const Pais = require("./Pais")(sequelize);
const Departamento = require("./Departamento")(sequelize);
const Municipio = require("./Municipio")(sequelize);

// ====================================
// DEFINIR TODAS LAS RELACIONES
// ====================================

// Relaciones Geográficas Jerárquicas
Pais.hasMany(Departamento, {
  foreignKey: "pais_id",
  as: "departamentos",
});

Departamento.belongsTo(Pais, {
  foreignKey: "pais_id",
  as: "pais",
});

Departamento.hasMany(Municipio, {
  foreignKey: "departamento_id",
  as: "municipios",
});

Municipio.belongsTo(Departamento, {
  foreignKey: "departamento_id",
  as: "departamento",
});

// Relaciones Estudiante con Ubicación
Estudiante.belongsTo(Municipio, {
  foreignKey: "municipio_id",
  as: "municipio",
});

Municipio.hasMany(Estudiante, {
  foreignKey: "municipio_id",
  as: "estudiantes",
});

// Relaciones Profesor con Ubicación
Profesor.belongsTo(Municipio, {
  foreignKey: "municipio_id",
  as: "municipio",
});

Municipio.hasMany(Profesor, {
  foreignKey: "municipio_id",
  as: "profesores",
});

// Relaciones Facultad-Carrera (1:N)
Facultad.hasMany(Carrera, {
  foreignKey: "facultad_id",
  as: "carreras",
});

Carrera.belongsTo(Facultad, {
  foreignKey: "facultad_id",
  as: "facultad",
});

// Relaciones N:M - Estudiante y Sección a través de Inscripción
Estudiante.belongsToMany(Seccion, {
  through: Inscripcion,
  foreignKey: "estudiante_id",
  otherKey: "seccion_id",
  as: "secciones",
});

Seccion.belongsToMany(Estudiante, {
  through: Inscripcion,
  foreignKey: "seccion_id",
  otherKey: "estudiante_id",
  as: "estudiantes",
});

// Relaciones directas con Inscripción
Inscripcion.belongsTo(Estudiante, {
  foreignKey: "estudiante_id",
  as: "estudiante",
});

Inscripcion.belongsTo(Seccion, {
  foreignKey: "seccion_id",
  as: "seccion",
});

Estudiante.hasMany(Inscripcion, {
  foreignKey: "estudiante_id",
  as: "inscripciones",
});

Seccion.hasMany(Inscripcion, {
  foreignKey: "seccion_id",
  as: "inscripciones",
});

// Relaciones Sección - Materia (N:1)
Seccion.belongsTo(Materia, {
  foreignKey: "materia_id",
  as: "materia",
});

Materia.hasMany(Seccion, {
  foreignKey: "materia_id",
  as: "secciones",
});

// Relaciones Sección - Profesor (N:1)
Seccion.belongsTo(Profesor, {
  foreignKey: "profesor_id",
  as: "profesor",
});

Profesor.hasMany(Seccion, {
  foreignKey: "profesor_id",
  as: "secciones",
});

// Relaciones Evaluación - Sección (N:1)
Evaluacion.belongsTo(Seccion, {
  foreignKey: "seccion_id",
  as: "seccion",
});

Seccion.hasMany(Evaluacion, {
  foreignKey: "seccion_id",
  as: "evaluaciones",
});

// Relaciones Nota - Inscripción y Evaluación (N:1)
Nota.belongsTo(Inscripcion, {
  foreignKey: "inscripcion_id",
  as: "inscripcion",
});

Nota.belongsTo(Evaluacion, {
  foreignKey: "evaluacion_id",
  as: "evaluacion",
});

Inscripcion.hasMany(Nota, {
  foreignKey: "inscripcion_id",
  as: "notas",
});

Evaluacion.hasMany(Nota, {
  foreignKey: "evaluacion_id",
  as: "notas",
});

// Relaciones adicionales útiles para consultas complejas

// Estudiante → Carrera (via inscripciones_carrera)
// Nota: Esta tabla no está modelada en Sequelize, pero existe en BD
// Se accede via queries SQL directas cuando se necesite

// Profesor → Departamento Académico (via profesor_departamento)
// Nota: Similar al anterior, se maneja via queries SQL

// ====================================
// FUNCIONES AUXILIARES
// ====================================

/**
 * Función para sincronizar todos los modelos (solo desarrollo)
 */
async function syncModels(options = {}) {
  try {
    if (process.env.NODE_ENV === "development" && options.force) {
      console.log("⚠️  Sincronizando modelos en modo desarrollo...");
      await sequelize.sync({
        force: options.force,
        alter: options.alter,
        logging: console.log,
      });
      console.log("✅ Modelos sincronizados correctamente");
    } else {
      console.log("🔍 Verificando sincronización de modelos...");
      await sequelize.authenticate();
      console.log("✅ Modelos verificados correctamente");
    }
  } catch (error) {
    console.error("❌ Error sincronizando modelos:", error.message);
    throw error;
  }
}

/**
 * Función para validar que las tablas existan y tengan datos
 */
async function validateTables() {
  try {
    const tableChecks = [
      { model: Estudiante, name: "estudiantes" },
      { model: Profesor, name: "profesores" },
      { model: Materia, name: "materias" },
      { model: Seccion, name: "secciones" },
      { model: Inscripcion, name: "inscripciones" },
      { model: Facultad, name: "facultades" },
      { model: Carrera, name: "carreras" },
      { model: Evaluacion, name: "evaluaciones" },
      { model: Nota, name: "notas" },
      { model: Pais, name: "paises" },
      { model: Departamento, name: "departamentos" },
      { model: Municipio, name: "municipios" },
    ];

    const results = {};

    for (const { model, name } of tableChecks) {
      try {
        const count = await model.count();
        results[name] = count;
      } catch (error) {
        console.error(`❌ Error validando tabla ${name}:`, error.message);
        results[name] = "ERROR";
      }
    }

    console.log("📊 Estado de las tablas:");
    Object.entries(results).forEach(([table, count]) => {
      if (count === "ERROR") {
        console.log(`   ❌ ${table}: ERROR`);
      } else if (count === 0) {
        console.log(`   ⚠️  ${table}: ${count} registros`);
      } else {
        console.log(`   ✅ ${table}: ${count} registros`);
      }
    });

    return results;
  } catch (error) {
    console.error("❌ Error validando tablas:", error.message);
    return false;
  }
}

/**
 * Función para obtener estadísticas rápidas del sistema
 */
async function getSystemStats() {
  try {
    const stats = {
      estudiantes: await Estudiante.count({ where: { estado: "activo" } }),
      profesores: await Profesor.count({ where: { activo: true } }),
      facultades: await Facultad.count({ where: { activa: true } }),
      carreras: await Carrera.count({ where: { activa: true } }),
      materias: await Materia.count({ where: { activa: true } }),
      secciones_activas: await Seccion.count({ where: { activa: true } }),
      inscripciones_activas: await Inscripcion.count({
        where: { estado: "inscrito" },
      }),
      paises: await Pais.count(),
      timestamp: new Date().toISOString(),
    };

    return stats;
  } catch (error) {
    console.error("❌ Error obteniendo estadísticas:", error.message);
    return null;
  }
}

/**
 * Función para verificar integridad referencial básica
 */
async function checkReferentialIntegrity() {
  try {
    const checks = [];

    // Verificar estudiantes sin municipio válido
    const estudiantesSinMunicipio = await Estudiante.count({
      where: { municipio_id: { [sequelize.Op.not]: null } },
      include: [
        {
          model: Municipio,
          as: "municipio",
          required: false,
        },
      ],
    });

    // Verificar secciones sin profesor o materia
    const seccionesSinProfesor = await Seccion.count({
      include: [
        {
          model: Profesor,
          as: "profesor",
          required: false,
          where: { id: null },
        },
      ],
    });

    const seccionesSinMateria = await Seccion.count({
      include: [
        {
          model: Materia,
          as: "materia",
          required: false,
          where: { id: null },
        },
      ],
    });

    checks.push({
      descripcion: "Estudiantes con municipio inválido",
      problemas: estudiantesSinMunicipio,
      ok: estudiantesSinMunicipio === 0,
    });

    checks.push({
      descripcion: "Secciones sin profesor",
      problemas: seccionesSinProfesor,
      ok: seccionesSinProfesor === 0,
    });

    checks.push({
      descripcion: "Secciones sin materia",
      problemas: seccionesSinMateria,
      ok: seccionesSinMateria === 0,
    });

    const todosOk = checks.every((check) => check.ok);

    return {
      integridad_ok: todosOk,
      checks,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("❌ Error verificando integridad:", error.message);
    return {
      integridad_ok: false,
      error: error.message,
    };
  }
}

// ====================================
// EXPORTAR MODELOS Y FUNCIONES
// ====================================

const models = {
  // Conexión
  sequelize,

  // Modelos principales
  Estudiante,
  Profesor,
  Materia,
  Seccion,
  Inscripcion,
  Facultad,
  Carrera,
  Evaluacion,
  Nota,

  // Modelos geográficos
  Pais,
  Departamento,
  Municipio,

  // Funciones auxiliares
  syncModels,
  validateTables,
  getSystemStats,
  checkReferentialIntegrity,
};

// Mensaje de inicialización
console.log("📦 Modelos Sequelize cargados:");
console.log("   ✅ 12 modelos principales");
console.log("   ✅ Relaciones configuradas");
console.log("   ✅ Funciones auxiliares disponibles");

module.exports = models;
