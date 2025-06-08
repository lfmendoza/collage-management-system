/**
 * Rutas de Estudiantes - COMPLETO
 * Sistema Universitario
 */

const express = require("express");
const router = express.Router();
const EstudianteService = require("../services/EstudianteService");
const { asyncHandler } = require("../middleware/errorHandler");

// ====================================
// RUTAS CRUD ESTUDIANTES
// ====================================

/**
 * GET /api/estudiantes
 * Listar estudiantes con paginación y filtros avanzados
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const {
      page = 1,
      limit = 10,
      estado,
      carnet,
      nombre,
      email,
      promedio_min,
      promedio_max,
      municipio_id,
      departamento_id,
      pais_id,
      orden = "apellido",
    } = req.query;

    // Validar parámetros de paginación
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({
        success: false,
        error: "Parámetro de página inválido",
        message: "page debe ser un número mayor a 0",
      });
    }

    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        error: "Parámetro de límite inválido",
        message: "limit debe ser un número entre 1 y 100",
      });
    }

    // Construir filtros
    const filtros = {};
    if (estado) filtros.estado = estado;
    if (carnet) filtros.carnet = carnet;
    if (nombre) filtros.nombre = nombre;
    if (email) filtros.email = email;
    if (promedio_min) filtros.promedio_min = parseFloat(promedio_min);
    if (promedio_max) filtros.promedio_max = parseFloat(promedio_max);
    if (municipio_id) filtros.municipio_id = parseInt(municipio_id);
    if (departamento_id) filtros.departamento_id = parseInt(departamento_id);
    if (pais_id) filtros.pais_id = parseInt(pais_id);

    const result = await EstudianteService.obtenerEstudiantes(
      pageNum,
      limitNum,
      filtros
    );

    if (result.success) {
      res.json({
        success: true,
        ...result.data,
        filtros_aplicados: filtros,
        message: `Se encontraron ${result.data.pagination.total} estudiantes`,
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
        message: result.message,
      });
    }
  })
);

/**
 * GET /api/estudiantes/:id
 * Obtener estudiante específico con información completa
 */
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: "ID inválido",
        message: "El ID debe ser un número entero",
      });
    }

    const result = await EstudianteService.obtenerEstudiantePorId(parseInt(id));

    if (result.success) {
      res.json({
        success: true,
        data: result.data,
        message: "Estudiante encontrado exitosamente",
      });
    } else {
      res.status(404).json({
        success: false,
        error: result.message,
        message: "Estudiante no encontrado",
      });
    }
  })
);

/**
 * POST /api/estudiantes
 * Crear nuevo estudiante con validaciones completas
 */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const datosEstudiante = req.body;

    // Validaciones básicas de campos requeridos
    const camposRequeridos = [
      "carnet",
      "nombres",
      "apellidos",
      "email",
      "fecha_nacimiento",
    ];
    const camposFaltantes = camposRequeridos.filter(
      (campo) =>
        !datosEstudiante[campo] ||
        (typeof datosEstudiante[campo] === "string" &&
          datosEstudiante[campo].trim() === "")
    );

    if (camposFaltantes.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Campos requeridos faltantes",
        message: `Los siguientes campos son obligatorios: ${camposFaltantes.join(
          ", "
        )}`,
        campos_faltantes: camposFaltantes,
      });
    }

    // Validaciones de formato
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(datosEstudiante.email)) {
      return res.status(400).json({
        success: false,
        error: "Email inválido",
        message: "El formato del email no es válido",
      });
    }

    // Validar fecha de nacimiento
    const fechaNacimiento = new Date(datosEstudiante.fecha_nacimiento);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();

    if (isNaN(fechaNacimiento.getTime())) {
      return res.status(400).json({
        success: false,
        error: "Fecha de nacimiento inválida",
        message: "La fecha de nacimiento debe tener formato YYYY-MM-DD",
      });
    }

    if (edad < 16 || edad > 100) {
      return res.status(400).json({
        success: false,
        error: "Edad inválida",
        message: "La edad debe estar entre 16 y 100 años",
      });
    }

    const result = await EstudianteService.crearEstudiante(datosEstudiante);

    if (result.success) {
      res.status(201).json({
        success: true,
        data: result.data,
        message: result.message,
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
        message: result.message,
      });
    }
  })
);

/**
 * PUT /api/estudiantes/:id
 * Actualizar estudiante completo
 */
router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const datosActualizacion = req.body;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: "ID inválido",
        message: "El ID debe ser un número entero",
      });
    }

    if (Object.keys(datosActualizacion).length === 0) {
      return res.status(400).json({
        success: false,
        error: "Sin datos para actualizar",
        message: "Debe proporcionar al menos un campo para actualizar",
      });
    }

    // Validar email si se está actualizando
    if (datosActualizacion.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(datosActualizacion.email)) {
        return res.status(400).json({
          success: false,
          error: "Email inválido",
          message: "El formato del email no es válido",
        });
      }
    }

    // Validar fecha de nacimiento si se está actualizando
    if (datosActualizacion.fecha_nacimiento) {
      const fechaNacimiento = new Date(datosActualizacion.fecha_nacimiento);
      const hoy = new Date();
      const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();

      if (isNaN(fechaNacimiento.getTime()) || edad < 16 || edad > 100) {
        return res.status(400).json({
          success: false,
          error: "Fecha de nacimiento inválida",
          message: "La edad debe estar entre 16 y 100 años",
        });
      }
    }

    const result = await EstudianteService.actualizarEstudiante(
      parseInt(id),
      datosActualizacion
    );

    if (result.success) {
      res.json({
        success: true,
        data: result.data,
        message: result.message,
      });
    } else {
      const statusCode =
        result.error === "Estudiante no encontrado" ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        error: result.error,
        message: result.message,
      });
    }
  })
);

/**
 * DELETE /api/estudiantes/:id
 * Eliminar estudiante con verificaciones de seguridad
 */
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: "ID inválido",
        message: "El ID debe ser un número entero",
      });
    }

    const result = await EstudianteService.eliminarEstudiante(parseInt(id));

    if (result.success) {
      res.json({
        success: true,
        message: result.message,
      });
    } else {
      const statusCode =
        result.error === "Estudiante no encontrado" ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        error: result.error,
        message: result.message,
      });
    }
  })
);

// ====================================
// RUTAS ESPECIALES DE ESTUDIANTES
// ====================================

/**
 * POST /api/estudiantes/:id/inscripciones
 * Inscribir estudiante en sección específica
 */
router.post(
  "/:id/inscripciones",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { seccion_id } = req.body;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: "ID de estudiante inválido",
        message: "El ID del estudiante debe ser un número entero",
      });
    }

    if (!seccion_id || isNaN(parseInt(seccion_id))) {
      return res.status(400).json({
        success: false,
        error: "ID de sección requerido",
        message: "seccion_id es requerido y debe ser un número entero",
      });
    }

    const result = await EstudianteService.inscribirEnSeccion(
      parseInt(id),
      parseInt(seccion_id)
    );

    if (result.success) {
      res.status(201).json({
        success: true,
        data: result.data,
        message: result.message,
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
        message: result.message,
      });
    }
  })
);

/**
 * GET /api/estudiantes/:id/historial
 * Obtener historial académico completo del estudiante
 */
router.get(
  "/:id/historial",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { ciclo, estado, incluir_notas = "false" } = req.query;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: "ID inválido",
        message: "El ID debe ser un número entero",
      });
    }

    const filtros = {};
    if (ciclo) filtros.ciclo = ciclo;
    if (estado) filtros.estado = estado;

    const result = await EstudianteService.obtenerHistorialAcademico(
      parseInt(id),
      filtros
    );

    if (result.success) {
      res.json({
        success: true,
        data: result.data,
        filtros_aplicados: filtros,
        incluye_notas: incluir_notas === "true",
        message: "Historial académico obtenido exitosamente",
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
        message: result.message,
      });
    }
  })
);

/**
 * GET /api/estudiantes/buscar/avanzada
 * Búsqueda avanzada de estudiantes con múltiples criterios
 */
router.get(
  "/buscar/avanzada",
  asyncHandler(async (req, res) => {
    const criterios = req.query;

    // Validar que se proporcione al menos un criterio
    const criteriosValidos = [
      "carnet",
      "nombres",
      "email",
      "estado",
      "municipio_id",
      "departamento_id",
      "pais_id",
    ];
    const criteriosProporcionados = Object.keys(criterios).filter((key) =>
      criteriosValidos.includes(key)
    );

    if (criteriosProporcionados.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Criterios de búsqueda requeridos",
        message: `Debe proporcionar al menos uno de: ${criteriosValidos.join(
          ", "
        )}`,
      });
    }

    const result = await EstudianteService.buscarEstudiantes(criterios);

    if (result.success) {
      res.json({
        success: true,
        data: result.data,
        total: result.data.length,
        criterios_aplicados: criterios,
        message: `Se encontraron ${result.data.length} estudiantes`,
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
        message: result.message,
      });
    }
  })
);

/**
 * GET /api/estudiantes/carnet/:carnet
 * Buscar estudiante por carnet específico
 */
router.get(
  "/carnet/:carnet",
  asyncHandler(async (req, res) => {
    const { carnet } = req.params;

    if (!carnet || carnet.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Carnet inválido",
        message: "El carnet no puede estar vacío",
      });
    }

    try {
      const { Estudiante } = require("../models");
      const estudiante = await Estudiante.findByCarnet(carnet.trim());

      if (estudiante) {
        // Obtener información completa
        const result = await EstudianteService.obtenerEstudiantePorId(
          estudiante.id
        );
        res.json({
          success: true,
          data: result.data,
          message: "Estudiante encontrado exitosamente",
        });
      } else {
        res.status(404).json({
          success: false,
          message: `No se encontró estudiante con carnet: ${carnet}`,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
        message: "Error al buscar estudiante por carnet",
      });
    }
  })
);

/**
 * GET /api/estudiantes/email/:email
 * Buscar estudiante por email específico
 */
router.get(
  "/email/:email",
  asyncHandler(async (req, res) => {
    const { email } = req.params;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Email inválido",
        message: "El formato del email no es válido",
      });
    }

    try {
      const { Estudiante } = require("../models");
      const estudiante = await Estudiante.findByEmail(
        email.toLowerCase().trim()
      );

      if (estudiante) {
        const result = await EstudianteService.obtenerEstudiantePorId(
          estudiante.id
        );
        res.json({
          success: true,
          data: result.data,
          message: "Estudiante encontrado exitosamente",
        });
      } else {
        res.status(404).json({
          success: false,
          message: `No se encontró estudiante con email: ${email}`,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
        message: "Error al buscar estudiante por email",
      });
    }
  })
);

/**
 * GET /api/estudiantes/estado/:estado
 * Obtener estudiantes por estado específico
 */
router.get(
  "/estado/:estado",
  asyncHandler(async (req, res) => {
    const { estado } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const estadosValidos = [
      "activo",
      "inactivo",
      "graduado",
      "suspendido",
      "retirado",
    ];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({
        success: false,
        error: "Estado inválido",
        message: `Estado debe ser uno de: ${estadosValidos.join(", ")}`,
      });
    }

    const result = await EstudianteService.obtenerEstudiantes(
      parseInt(page),
      parseInt(limit),
      { estado }
    );

    if (result.success) {
      res.json({
        success: true,
        ...result.data,
        estado_filtrado: estado,
        message: `Se encontraron ${result.data.pagination.total} estudiantes con estado: ${estado}`,
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
        message: result.message,
      });
    }
  })
);

/**
 * GET /api/estudiantes/:id/inscripciones
 * Obtener todas las inscripciones de un estudiante
 */
router.get(
  "/:id/inscripciones",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { ciclo, estado_inscripcion } = req.query;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: "ID inválido",
        message: "El ID debe ser un número entero",
      });
    }

    try {
      const {
        Estudiante,
        Inscripcion,
        Seccion,
        Materia,
        Profesor,
      } = require("../models");

      // Verificar que existe el estudiante
      const estudiante = await Estudiante.findByPk(parseInt(id));
      if (!estudiante) {
        return res.status(404).json({
          success: false,
          message: "Estudiante no encontrado",
        });
      }

      // Construir filtros
      const whereClause = { estudiante_id: parseInt(id) };
      const seccionWhere = {};

      if (estado_inscripcion) {
        whereClause.estado = estado_inscripcion;
      }

      if (ciclo) {
        seccionWhere.ciclo = ciclo;
      }

      const inscripciones = await Inscripcion.findAll({
        where: whereClause,
        include: [
          {
            model: Seccion,
            as: "seccion",
            where:
              Object.keys(seccionWhere).length > 0 ? seccionWhere : undefined,
            include: [
              {
                model: Materia,
                as: "materia",
                attributes: ["id", "nombre", "codigo", "creditos"],
              },
              {
                model: Profesor,
                as: "profesor",
                attributes: ["id", "nombres", "apellidos"],
              },
            ],
          },
        ],
        order: [
          [{ model: Seccion, as: "seccion" }, "ciclo", "DESC"],
          ["fecha_inscripcion", "DESC"],
        ],
      });

      // Calcular estadísticas
      const stats = {
        total_inscripciones: inscripciones.length,
        por_estado: {
          inscrito: inscripciones.filter((i) => i.estado === "inscrito").length,
          aprobado: inscripciones.filter((i) => i.estado === "aprobado").length,
          reprobado: inscripciones.filter((i) => i.estado === "reprobado")
            .length,
          retirado: inscripciones.filter((i) => i.estado === "retirado").length,
        },
        creditos_cursados: inscripciones.reduce((total, i) => {
          return total + (i.seccion?.materia?.creditos || 0);
        }, 0),
        promedio_notas:
          inscripciones.filter((i) => i.nota_final !== null).length > 0
            ? Math.round(
                (inscripciones
                  .filter((i) => i.nota_final !== null)
                  .reduce((sum, i) => sum + parseFloat(i.nota_final), 0) /
                  inscripciones.filter((i) => i.nota_final !== null).length) *
                  100
              ) / 100
            : null,
      };

      res.json({
        success: true,
        data: {
          estudiante: {
            id: estudiante.id,
            carnet: estudiante.carnet,
            nombre_completo: estudiante.getNombreCompleto(),
          },
          inscripciones,
          estadisticas: stats,
        },
        filtros_aplicados: { ciclo, estado_inscripcion },
        message: `Se encontraron ${inscripciones.length} inscripciones`,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
        message: "Error al obtener inscripciones del estudiante",
      });
    }
  })
);

/**
 * DELETE /api/estudiantes/:id/inscripciones/:inscripcionId
 * Cancelar inscripción específica (retirar de materia)
 */
router.delete(
  "/:id/inscripciones/:inscripcionId",
  asyncHandler(async (req, res) => {
    const { id, inscripcionId } = req.params;

    if (isNaN(parseInt(id)) || isNaN(parseInt(inscripcionId))) {
      return res.status(400).json({
        success: false,
        error: "IDs inválidos",
        message: "Los IDs deben ser números enteros",
      });
    }

    try {
      const { Inscripcion, sequelize } = require("../models");

      const transaction = await sequelize.transaction();

      try {
        // Buscar la inscripción
        const inscripcion = await Inscripcion.findOne({
          where: {
            id: parseInt(inscripcionId),
            estudiante_id: parseInt(id),
          },
          transaction,
        });

        if (!inscripcion) {
          await transaction.rollback();
          return res.status(404).json({
            success: false,
            message: "Inscripción no encontrada",
          });
        }

        // Verificar que se puede retirar
        if (inscripcion.estado !== "inscrito") {
          await transaction.rollback();
          return res.status(400).json({
            success: false,
            error: "No se puede retirar",
            message: `No se puede retirar una materia con estado: ${inscripcion.estado}`,
          });
        }

        // Actualizar estado a retirado
        await inscripcion.update({ estado: "retirado" }, { transaction });

        await transaction.commit();

        res.json({
          success: true,
          message: "Estudiante retirado de la materia exitosamente",
        });
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
        message: "Error al retirar estudiante de la materia",
      });
    }
  })
);

// ====================================
// RUTAS DE ESTADÍSTICAS DE ESTUDIANTES
// ====================================

/**
 * GET /api/estudiantes/estadisticas/generales
 * Estadísticas generales de estudiantes
 */
router.get(
  "/estadisticas/generales",
  asyncHandler(async (req, res) => {
    try {
      const { sequelize } = require("../models");

      const estadisticas = await sequelize.query(
        `
      SELECT 
        COUNT(*) as total_estudiantes,
        COUNT(CASE WHEN estado = 'activo' THEN 1 END) as activos,
        COUNT(CASE WHEN estado = 'graduado' THEN 1 END) as graduados,
        COUNT(CASE WHEN estado = 'suspendido' THEN 1 END) as suspendidos,
        COUNT(CASE WHEN estado = 'retirado' THEN 1 END) as retirados,
        COUNT(CASE WHEN estado = 'inactivo' THEN 1 END) as inactivos,
        ROUND(AVG(CASE WHEN promedio_general > 0 THEN promedio_general END), 2) as promedio_general_sistema,
        ROUND(AVG(creditos_aprobados), 0) as promedio_creditos_aprobados,
        MAX(promedio_general) as mejor_promedio,
        MIN(CASE WHEN promedio_general > 0 THEN promedio_general END) as menor_promedio
      FROM estudiantes
    `,
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );

      // Distribución por rangos de promedio
      const distribucionPromedios = await sequelize.query(
        `
      SELECT 
        CASE 
          WHEN promedio_general >= 90 THEN 'Excelente (90-100)'
          WHEN promedio_general >= 80 THEN 'Muy Bueno (80-89)'
          WHEN promedio_general >= 70 THEN 'Bueno (70-79)'
          WHEN promedio_general >= 61 THEN 'Satisfactorio (61-69)'
          WHEN promedio_general > 0 THEN 'Necesita Mejorar (0-60)'
          ELSE 'Sin Promedio'
        END as rango_promedio,
        COUNT(*) as cantidad
      FROM estudiantes
      GROUP BY 
        CASE 
          WHEN promedio_general >= 90 THEN 'Excelente (90-100)'
          WHEN promedio_general >= 80 THEN 'Muy Bueno (80-89)'
          WHEN promedio_general >= 70 THEN 'Bueno (70-79)'
          WHEN promedio_general >= 61 THEN 'Satisfactorio (61-69)'
          WHEN promedio_general > 0 THEN 'Necesita Mejorar (0-60)'
          ELSE 'Sin Promedio'
        END
      ORDER BY 
        MIN(CASE 
          WHEN promedio_general >= 90 THEN 6
          WHEN promedio_general >= 80 THEN 5
          WHEN promedio_general >= 70 THEN 4
          WHEN promedio_general >= 61 THEN 3
          WHEN promedio_general > 0 THEN 2
          ELSE 1
        END) DESC
    `,
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );

      res.json({
        success: true,
        data: {
          estadisticas_generales: estadisticas[0],
          distribucion_promedios,
          fecha_generacion: new Date().toISOString(),
        },
        message: "Estadísticas generales de estudiantes obtenidas exitosamente",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
        message: "Error al obtener estadísticas de estudiantes",
      });
    }
  })
);

module.exports = router;
