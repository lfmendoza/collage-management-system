/**
 * Rutas de Secciones
 * Sistema Universitario
 */

const express = require("express");
const router = express.Router();
const SeccionService = require("../services/SeccionService");
const { asyncHandler } = require("../middleware/errorHandler");

// ====================================
// RUTAS CRUD SECCIONES
// ====================================

/**
 * GET /api/secciones/:id
 * Obtener sección específica con estudiantes
 */
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: "ID inválido",
        message: "El ID debe ser un número",
      });
    }

    const result = await SeccionService.obtenerSeccionPorId(parseInt(id));

    if (result.success) {
      res.json({
        success: true,
        data: result.data,
        message: "Sección encontrada",
      });
    } else {
      res.status(404).json({
        success: false,
        error: result.message,
        message: "Sección no encontrada",
      });
    }
  })
);

/**
 * POST /api/secciones
 * Crear nueva sección
 */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const datosSeccion = req.body;

    // Validaciones básicas
    const camposRequeridos = [
      "materia_id",
      "profesor_id",
      "codigo_seccion",
      "ciclo",
      "cupo_maximo",
    ];
    const camposFaltantes = camposRequeridos.filter(
      (campo) => !datosSeccion[campo]
    );

    if (camposFaltantes.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Campos requeridos faltantes",
        message: `Los siguientes campos son obligatorios: ${camposFaltantes.join(
          ", "
        )}`,
      });
    }

    // Validar tipos de datos
    if (isNaN(parseInt(datosSeccion.materia_id))) {
      return res.status(400).json({
        success: false,
        error: "materia_id inválido",
        message: "materia_id debe ser un número",
      });
    }

    if (isNaN(parseInt(datosSeccion.profesor_id))) {
      return res.status(400).json({
        success: false,
        error: "profesor_id inválido",
        message: "profesor_id debe ser un número",
      });
    }

    if (
      isNaN(parseInt(datosSeccion.cupo_maximo)) ||
      parseInt(datosSeccion.cupo_maximo) <= 0
    ) {
      return res.status(400).json({
        success: false,
        error: "cupo_maximo inválido",
        message: "cupo_maximo debe ser un número mayor a 0",
      });
    }

    const result = await SeccionService.crearSeccion(datosSeccion);

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
 * PUT /api/secciones/:id
 * Actualizar sección
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
        message: "El ID debe ser un número",
      });
    }

    if (Object.keys(datosActualizacion).length === 0) {
      return res.status(400).json({
        success: false,
        error: "Sin datos para actualizar",
        message: "Debe proporcionar al menos un campo para actualizar",
      });
    }

    // Validar tipos si se están actualizando
    if (
      datosActualizacion.materia_id &&
      isNaN(parseInt(datosActualizacion.materia_id))
    ) {
      return res.status(400).json({
        success: false,
        error: "materia_id inválido",
        message: "materia_id debe ser un número",
      });
    }

    if (
      datosActualizacion.profesor_id &&
      isNaN(parseInt(datosActualizacion.profesor_id))
    ) {
      return res.status(400).json({
        success: false,
        error: "profesor_id inválido",
        message: "profesor_id debe ser un número",
      });
    }

    if (
      datosActualizacion.cupo_maximo &&
      (isNaN(parseInt(datosActualizacion.cupo_maximo)) ||
        parseInt(datosActualizacion.cupo_maximo) <= 0)
    ) {
      return res.status(400).json({
        success: false,
        error: "cupo_maximo inválido",
        message: "cupo_maximo debe ser un número mayor a 0",
      });
    }

    const result = await SeccionService.actualizarSeccion(
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
      const statusCode = result.error === "Sección no encontrada" ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        error: result.error,
        message: result.message,
      });
    }
  })
);

/**
 * DELETE /api/secciones/:id
 * Eliminar sección
 */
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: "ID inválido",
        message: "El ID debe ser un número",
      });
    }

    const result = await SeccionService.eliminarSeccion(parseInt(id));

    if (result.success) {
      res.json({
        success: true,
        message: result.message,
      });
    } else {
      const statusCode = result.error === "Sección no encontrada" ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        error: result.error,
        message: result.message,
      });
    }
  })
);

// ====================================
// RUTAS ESPECIALES
// ====================================

/**
 * GET /api/secciones/:id/estadisticas
 * Obtener estadísticas de la sección
 */
router.get(
  "/:id/estadisticas",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: "ID inválido",
        message: "El ID debe ser un número",
      });
    }

    const result = await SeccionService.obtenerEstadisticasSeccion(
      parseInt(id)
    );

    if (result.success) {
      res.json({
        success: true,
        data: result.data,
        message: "Estadísticas obtenidas exitosamente",
      });
    } else {
      res.status(404).json({
        success: false,
        error: result.error,
        message: result.message,
      });
    }
  })
);

/**
 * GET /api/secciones/ciclo/:ciclo
 * Obtener secciones por ciclo agrupadas por materia
 */
router.get(
  "/ciclo/:ciclo",
  asyncHandler(async (req, res) => {
    const { ciclo } = req.params;
    const { modalidad, con_cupo } = req.query;

    // Validar formato de ciclo
    const cicloRegex = /^\d{4}-[12]$/;
    if (!cicloRegex.test(ciclo)) {
      return res.status(400).json({
        success: false,
        error: "Formato de ciclo inválido",
        message: "El ciclo debe tener formato YYYY-1 o YYYY-2",
      });
    }

    const filtros = {};
    if (modalidad) filtros.modalidad = modalidad;
    if (con_cupo === "true") filtros.con_cupo = true;

    const result = await SeccionService.obtenerSeccionesPorCiclo(
      ciclo,
      filtros
    );

    if (result.success) {
      res.json({
        success: true,
        data: result.data,
        message: `Secciones del ciclo ${ciclo} obtenidas exitosamente`,
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
 * GET /api/secciones/disponibles/inscripcion
 * Obtener secciones disponibles para inscripción
 */
router.get(
  "/disponibles/inscripcion",
  asyncHandler(async (req, res) => {
    const { ciclo, modalidad, materia_codigo } = req.query;

    const filtros = {};
    if (ciclo) filtros.ciclo = ciclo;
    if (modalidad) filtros.modalidad = modalidad;
    if (materia_codigo) filtros.materia_codigo = materia_codigo;

    const result = await SeccionService.buscarSeccionesDisponibles(filtros);

    if (result.success) {
      res.json({
        success: true,
        data: result.data,
        total: result.data.length,
        message: `Se encontraron ${result.data.length} secciones disponibles`,
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
 * GET /api/secciones/reporte/demanda/:ciclo
 * Generar reporte de demanda por ciclo
 */
router.get(
  "/reporte/demanda/:ciclo",
  asyncHandler(async (req, res) => {
    const { ciclo } = req.params;

    // Validar formato de ciclo
    const cicloRegex = /^\d{4}-[12]$/;
    if (!cicloRegex.test(ciclo)) {
      return res.status(400).json({
        success: false,
        error: "Formato de ciclo inválido",
        message: "El ciclo debe tener formato YYYY-1 o YYYY-2",
      });
    }

    const result = await SeccionService.obtenerReporteDemanda(ciclo);

    if (result.success) {
      res.json({
        success: true,
        data: result.data,
        message: `Reporte de demanda del ciclo ${ciclo} generado exitosamente`,
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
 * GET /api/secciones/profesor/:profesorId
 * Obtener secciones de un profesor específico
 */
router.get(
  "/profesor/:profesorId",
  asyncHandler(async (req, res) => {
    const { profesorId } = req.params;
    const { ciclo, activa } = req.query;

    if (isNaN(parseInt(profesorId))) {
      return res.status(400).json({
        success: false,
        error: "ID de profesor inválido",
        message: "El ID del profesor debe ser un número",
      });
    }

    const filtros = { profesor_id: parseInt(profesorId) };
    if (ciclo) filtros.ciclo = ciclo;
    if (activa !== undefined) filtros.activa = activa === "true";

    const result = await SeccionService.obtenerSecciones(filtros);

    if (result.success) {
      res.json({
        success: true,
        data: result.data,
        total: result.data.length,
        message: `Se encontraron ${result.data.length} secciones del profesor`,
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
 * GET /api/secciones/materia/:materiaId
 * Obtener secciones de una materia específica
 */
router.get(
  "/materia/:materiaId",
  asyncHandler(async (req, res) => {
    const { materiaId } = req.params;
    const { ciclo, modalidad } = req.query;

    if (isNaN(parseInt(materiaId))) {
      return res.status(400).json({
        success: false,
        error: "ID de materia inválido",
        message: "El ID de la materia debe ser un número",
      });
    }

    const filtros = { materia_id: parseInt(materiaId) };
    if (ciclo) filtros.ciclo = ciclo;
    if (modalidad) filtros.modalidad = modalidad;

    const result = await SeccionService.obtenerSecciones(filtros);

    if (result.success) {
      res.json({
        success: true,
        data: result.data,
        total: result.data.length,
        message: `Se encontraron ${result.data.length} secciones de la materia`,
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

// ====================================
// LISTADO GENERAL CON FILTROS Y PAGINACIÓN
// ====================================

/**
 * GET /api/secciones
 * Listar secciones con filtros
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const {
      page = 1,
      limit = 20,
      ciclo,
      modalidad,
      activa,
      materia_id,
      profesor_id,
      con_cupo,
      codigo_seccion,
      nombre_materia,
      facultad_id,
      orden = "codigo_seccion",
    } = req.query;

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

    const filtros = {};
    if (ciclo) filtros.ciclo = ciclo;
    if (modalidad) filtros.modalidad = modalidad;
    if (activa !== undefined) filtros.activa = activa === "true";
    if (materia_id) filtros.materia_id = parseInt(materia_id);
    if (profesor_id) filtros.profesor_id = parseInt(profesor_id);
    if (con_cupo === "true") filtros.con_cupo = true;
    if (codigo_seccion) filtros.codigo_seccion = codigo_seccion;
    if (nombre_materia) filtros.nombre_materia = nombre_materia;
    if (facultad_id) filtros.facultad_id = parseInt(facultad_id);

    const result = await SeccionService.obtenerSecciones(
      filtros,
      pageNum,
      limitNum,
      orden
    );

    if (result.success) {
      res.json({
        success: true,
        data: result.data.secciones,
        pagination: result.data.pagination,
        filtros_aplicados: filtros,
        message: `Se encontraron ${result.data.pagination.total} secciones`,
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

// ====================================
// ESTUDIANTES DE UNA SECCIÓN
// ====================================

/**
 * GET /api/secciones/:id/estudiantes
 * Obtener estudiantes inscritos en una sección
 */
router.get(
  "/:id/estudiantes",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { incluir_notas = "false", estado_inscripcion } = req.query;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: "ID inválido",
        message: "El ID debe ser un número",
      });
    }

    try {
      const {
        Seccion,
        Inscripcion,
        Estudiante,
        Materia,
        Profesor,
        Evaluacion,
        Nota,
      } = require("../models");

      // Verificar que la sección existe
      const seccion = await Seccion.findByPk(parseInt(id), {
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
      });

      if (!seccion) {
        return res.status(404).json({
          success: false,
          message: "Sección no encontrada",
        });
      }

      // Construir filtros para inscripciones
      const whereInscripcion = { seccion_id: parseInt(id) };
      if (estado_inscripcion) {
        whereInscripcion.estado = estado_inscripcion;
      }

      const includeOptions = [
        {
          model: Estudiante,
          as: "estudiante",
          attributes: [
            "id",
            "carnet",
            "nombres",
            "apellidos",
            "email",
            "promedio_general",
          ],
        },
      ];

      // Si se requieren notas, incluir evaluaciones
      if (incluir_notas === "true") {
        includeOptions.push({
          model: Nota,
          as: "notas",
          include: [
            {
              model: Evaluacion,
              as: "evaluacion",
              attributes: ["id", "nombre", "tipo", "ponderacion"],
            },
          ],
        });
      }

      const inscripciones = await Inscripcion.findAll({
        where: whereInscripcion,
        include: includeOptions,
        order: [
          [{ model: Estudiante, as: "estudiante" }, "apellidos", "ASC"],
          [{ model: Estudiante, as: "estudiante" }, "nombres", "ASC"],
        ],
      });

      // Calcular estadísticas
      const estadisticas = {
        total_inscritos: inscripciones.length,
        cupo_maximo: seccion.cupo_maximo,
        cupos_disponibles:
          seccion.cupo_maximo -
          inscripciones.filter((i) => i.estado !== "retirado").length,
        por_estado: {
          inscrito: inscripciones.filter((i) => i.estado === "inscrito").length,
          aprobado: inscripciones.filter((i) => i.estado === "aprobado").length,
          reprobado: inscripciones.filter((i) => i.estado === "reprobado")
            .length,
          retirado: inscripciones.filter((i) => i.estado === "retirado").length,
        },
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
          seccion: {
            id: seccion.id,
            codigo_seccion: seccion.codigo_seccion,
            ciclo: seccion.ciclo,
            materia: seccion.materia,
            profesor: seccion.profesor,
            modalidad: seccion.modalidad,
            horario: seccion.horario,
          },
          estudiantes: inscripciones,
          estadisticas,
        },
        parametros: { incluir_notas, estado_inscripcion },
        message: `Se encontraron ${inscripciones.length} estudiantes en la sección`,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
        message: "Error al obtener estudiantes de la sección",
      });
    }
  })
);

// ====================================
// INSCRIPCIÓN DE ESTUDIANTES
// ====================================

/**
 * POST /api/secciones/:id/inscribir-estudiante
 * Inscribir estudiante en sección específica
 */
router.post(
  "/:id/inscribir-estudiante",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { estudiante_id, forzar_inscripcion = false } = req.body;

    if (isNaN(parseInt(id)) || isNaN(parseInt(estudiante_id))) {
      return res.status(400).json({
        success: false,
        error: "IDs inválidos",
        message: "Los IDs deben ser números enteros",
      });
    }

    try {
      const { sequelize } = require("../models");
      const transaction = await sequelize.transaction();

      try {
        // Verificar que la sección existe y tiene cupo
        const seccionQuery = await sequelize.query(
          `
        SELECT 
          s.*,
          m.nombre AS materia_nombre,
          (s.cupo_maximo - COUNT(i.id) FILTER (WHERE i.estado != 'retirado')) AS cupos_disponibles
        FROM secciones s
        INNER JOIN materias m ON s.materia_id = m.id
        LEFT JOIN inscripciones i ON s.id = i.seccion_id
        WHERE s.id = $1 AND s.activa = true
        GROUP BY s.id, m.nombre
      `,
          {
            type: sequelize.QueryTypes.SELECT,
            bind: [parseInt(id)],
            transaction,
          }
        );

        if (seccionQuery.length === 0) {
          await transaction.rollback();
          return res.status(404).json({
            success: false,
            message: "Sección no encontrada o inactiva",
          });
        }

        const seccion = seccionQuery[0];

        // Verificar cupo disponible
        if (seccion.cupos_disponibles <= 0 && !forzar_inscripcion) {
          await transaction.rollback();
          return res.status(409).json({
            success: false,
            error: "Sin cupo disponible",
            message: "La sección no tiene cupos disponibles",
          });
        }

        // Verificar que el estudiante existe y está activo
        const estudianteQuery = await sequelize.query(
          `
        SELECT id, carnet, nombres, apellidos, estado
        FROM estudiantes
        WHERE id = $1
      `,
          {
            type: sequelize.QueryTypes.SELECT,
            bind: [parseInt(estudiante_id)],
            transaction,
          }
        );

        if (estudianteQuery.length === 0) {
          await transaction.rollback();
          return res.status(404).json({
            success: false,
            message: "Estudiante no encontrado",
          });
        }

        const estudiante = estudianteQuery[0];

        if (estudiante.estado !== "activo") {
          await transaction.rollback();
          return res.status(400).json({
            success: false,
            error: "Estudiante inactivo",
            message: "Solo se pueden inscribir estudiantes activos",
          });
        }

        // Verificar si ya está inscrito
        const inscripcionExistente = await sequelize.query(
          `
        SELECT id, estado
        FROM inscripciones
        WHERE estudiante_id = $1 AND seccion_id = $2
      `,
          {
            type: sequelize.QueryTypes.SELECT,
            bind: [parseInt(estudiante_id), parseInt(id)],
            transaction,
          }
        );

        if (inscripcionExistente.length > 0) {
          await transaction.rollback();
          return res.status(409).json({
            success: false,
            error: "Ya inscrito",
            message: `El estudiante ya está inscrito en esta sección con estado: ${inscripcionExistente[0].estado}`,
          });
        }

        // Crear la inscripción
        const [nuevaInscripcion] = await sequelize.query(
          `
        INSERT INTO inscripciones (estudiante_id, seccion_id, fecha_inscripcion, estado)
        VALUES ($1, $2, CURRENT_DATE, 'inscrito')
        RETURNING *
      `,
          {
            type: sequelize.QueryTypes.INSERT,
            bind: [parseInt(estudiante_id), parseInt(id)],
            transaction,
          }
        );

        await transaction.commit();

        res.status(201).json({
          success: true,
          data: nuevaInscripcion,
          message: "Estudiante inscrito exitosamente",
        });
      } catch (err) {
        await transaction.rollback();
        throw err;
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
        message: "Error al inscribir estudiante",
      });
    }
  })
);

// ====================================
// EXPORTACIÓN DEL ROUTER
// ====================================

module.exports = router;
