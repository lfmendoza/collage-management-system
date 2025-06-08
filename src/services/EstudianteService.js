/**
 * Servicio de Estudiantes
 * Sistema Universitario
 */

const {
  Estudiante,
  Seccion,
  Inscripcion,
  Materia,
  Profesor,
  sequelize,
} = require("../models");
const { Op } = require("sequelize");

class EstudianteService {
  /**
   * CREATE - Crear nuevo estudiante
   */
  static async crearEstudiante(datosEstudiante) {
    const transaction = await sequelize.transaction();

    try {
      // Validar que el carnet no exista
      const estudianteExistente = await Estudiante.findByCarnet(
        datosEstudiante.carnet
      );
      if (estudianteExistente) {
        throw new Error("Ya existe un estudiante con este carnet");
      }

      // Validar que el email no exista
      if (datosEstudiante.email) {
        const emailExistente = await Estudiante.findByEmail(
          datosEstudiante.email
        );
        if (emailExistente) {
          throw new Error("Ya existe un estudiante con este email");
        }
      }

      const nuevoEstudiante = await Estudiante.create(datosEstudiante, {
        transaction,
      });
      await transaction.commit();

      return {
        success: true,
        data: nuevoEstudiante,
        message: "Estudiante creado exitosamente",
      };
    } catch (error) {
      await transaction.rollback();
      return {
        success: false,
        error: error.message,
        message: "Error al crear estudiante",
      };
    }
  }

  /**
   * READ - Obtener estudiantes con paginación y filtros
   */
  static async obtenerEstudiantes(page = 1, limit = 10, filtros = {}) {
    try {
      const offset = (page - 1) * limit;
      const whereClause = {};

      // Aplicar filtros
      if (filtros.estado) {
        whereClause.estado = filtros.estado;
      }

      if (filtros.carnet) {
        whereClause.carnet = { [Op.iLike]: `%${filtros.carnet}%` };
      }

      if (filtros.nombre) {
        whereClause[Op.or] = [
          { nombres: { [Op.iLike]: `%${filtros.nombre}%` } },
          { apellidos: { [Op.iLike]: `%${filtros.nombre}%` } },
        ];
      }

      if (filtros.email) {
        whereClause.email = { [Op.iLike]: `%${filtros.email}%` };
      }

      if (filtros.promedio_min) {
        whereClause.promedio_general = { [Op.gte]: filtros.promedio_min };
      }

      if (filtros.promedio_max) {
        whereClause.promedio_general = whereClause.promedio_general || {};
        whereClause.promedio_general[Op.lte] = filtros.promedio_max;
      }

      const { count, rows } = await Estudiante.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset,
        order: [
          ["apellidos", "ASC"],
          ["nombres", "ASC"],
        ],
        include: [
          {
            model: require("../models").Municipio,
            as: "municipio",
            include: [
              {
                model: require("../models").Departamento,
                as: "departamento",
                include: [
                  {
                    model: require("../models").Pais,
                    as: "pais",
                  },
                ],
              },
            ],
          },
        ],
      });

      return {
        success: true,
        data: {
          estudiantes: rows,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: count,
            totalPages: Math.ceil(count / limit),
          },
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "Error al obtener estudiantes",
      };
    }
  }

  /**
   * READ - Obtener estudiante por ID con inscripciones
   */
  static async obtenerEstudiantePorId(id) {
    try {
      const estudiante = await Estudiante.findByPk(id, {
        include: [
          {
            model: require("../models").Municipio,
            as: "municipio",
            include: [
              {
                model: require("../models").Departamento,
                as: "departamento",
                include: [
                  {
                    model: require("../models").Pais,
                    as: "pais",
                  },
                ],
              },
            ],
          },
          {
            model: Seccion,
            as: "secciones",
            through: {
              model: Inscripcion,
              attributes: ["id", "fecha_inscripcion", "nota_final", "estado"],
            },
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
      });

      if (!estudiante) {
        return {
          success: false,
          message: "Estudiante no encontrado",
        };
      }

      return {
        success: true,
        data: estudiante,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "Error al obtener estudiante",
      };
    }
  }

  /**
   * UPDATE - Actualizar estudiante
   */
  static async actualizarEstudiante(id, datosActualizacion) {
    const transaction = await sequelize.transaction();

    try {
      // Verificar que existe el estudiante
      const estudiante = await Estudiante.findByPk(id, { transaction });
      if (!estudiante) {
        throw new Error("Estudiante no encontrado");
      }

      // Validar carnet único si se está actualizando
      if (
        datosActualizacion.carnet &&
        datosActualizacion.carnet !== estudiante.carnet
      ) {
        const carnetExistente = await Estudiante.findByCarnet(
          datosActualizacion.carnet
        );
        if (carnetExistente && carnetExistente.id !== id) {
          throw new Error("Ya existe un estudiante con este carnet");
        }
      }

      // Validar email único si se está actualizando
      if (
        datosActualizacion.email &&
        datosActualizacion.email !== estudiante.email
      ) {
        const emailExistente = await Estudiante.findByEmail(
          datosActualizacion.email
        );
        if (emailExistente && emailExistente.id !== id) {
          throw new Error("Ya existe un estudiante con este email");
        }
      }

      await estudiante.update(datosActualizacion, { transaction });
      await transaction.commit();

      // Obtener estudiante actualizado con relaciones
      const estudianteActualizado = await this.obtenerEstudiantePorId(id);

      return {
        success: true,
        data: estudianteActualizado.data,
        message: "Estudiante actualizado exitosamente",
      };
    } catch (error) {
      await transaction.rollback();
      return {
        success: false,
        error: error.message,
        message: "Error al actualizar estudiante",
      };
    }
  }

  /**
   * DELETE - Eliminar estudiante
   */
  static async eliminarEstudiante(id) {
    const transaction = await sequelize.transaction();

    try {
      const estudiante = await Estudiante.findByPk(id, { transaction });
      if (!estudiante) {
        throw new Error("Estudiante no encontrado");
      }

      // Verificar que no tenga inscripciones activas
      const inscripcionesActivas = await Inscripcion.count({
        where: {
          estudiante_id: id,
          estado: "inscrito",
        },
        transaction,
      });

      if (inscripcionesActivas > 0) {
        throw new Error(
          "No se puede eliminar el estudiante porque tiene inscripciones activas"
        );
      }

      await estudiante.destroy({ transaction });
      await transaction.commit();

      return {
        success: true,
        message: "Estudiante eliminado exitosamente",
      };
    } catch (error) {
      await transaction.rollback();
      return {
        success: false,
        error: error.message,
        message: "Error al eliminar estudiante",
      };
    }
  }

  /**
   * MÉTODO ESPECIAL - Inscribir estudiante en sección
   */
  static async inscribirEnSeccion(estudianteId, seccionId) {
    const transaction = await sequelize.transaction();

    try {
      // Verificar que existe el estudiante
      const estudiante = await Estudiante.findByPk(estudianteId, {
        transaction,
      });
      if (!estudiante) {
        throw new Error("Estudiante no encontrado");
      }

      if (!estudiante.isActivo()) {
        throw new Error("El estudiante no está activo");
      }

      // Verificar que existe la sección y hay cupo
      const seccion = await Seccion.findByPk(seccionId, {
        include: [
          {
            model: Materia,
            as: "materia",
          },
        ],
        transaction,
      });

      if (!seccion) {
        throw new Error("Sección no encontrada");
      }

      if (!seccion.isActiva()) {
        throw new Error("La sección no está activa");
      }

      if (!seccion.tieneCupo()) {
        throw new Error("No hay cupo disponible en esta sección");
      }

      // Verificar que no esté ya inscrito
      const inscripcionExistente = await Inscripcion.findOne({
        where: {
          estudiante_id: estudianteId,
          seccion_id: seccionId,
        },
        transaction,
      });

      if (inscripcionExistente) {
        throw new Error("El estudiante ya está inscrito en esta sección");
      }

      // Verificar que no esté inscrito en otra sección de la misma materia en el mismo ciclo
      const inscripcionMismaMateria = await Inscripcion.findOne({
        where: { estudiante_id: estudianteId },
        include: [
          {
            model: Seccion,
            as: "seccion",
            where: {
              materia_id: seccion.materia_id,
              ciclo: seccion.ciclo,
              id: { [Op.ne]: seccionId },
            },
          },
        ],
        transaction,
      });

      if (inscripcionMismaMateria) {
        throw new Error(
          `Ya está inscrito en otra sección de ${seccion.materia.nombre} en el ciclo ${seccion.ciclo}`
        );
      }

      // Crear la inscripción
      const nuevaInscripcion = await Inscripcion.create(
        {
          estudiante_id: estudianteId,
          seccion_id: seccionId,
        },
        { transaction }
      );

      await transaction.commit();

      // Obtener inscripción completa
      const inscripcionCompleta = await Inscripcion.findByPk(
        nuevaInscripcion.id,
        {
          include: [
            {
              model: Estudiante,
              as: "estudiante",
              attributes: ["id", "carnet", "nombres", "apellidos"],
            },
            {
              model: Seccion,
              as: "seccion",
              include: [
                {
                  model: Materia,
                  as: "materia",
                  attributes: ["nombre", "codigo", "creditos"],
                },
                {
                  model: Profesor,
                  as: "profesor",
                  attributes: ["nombres", "apellidos"],
                },
              ],
            },
          ],
        }
      );

      return {
        success: true,
        data: inscripcionCompleta,
        message: "Estudiante inscrito exitosamente",
      };
    } catch (error) {
      await transaction.rollback();
      return {
        success: false,
        error: error.message,
        message: "Error al inscribir estudiante",
      };
    }
  }

  /**
   * MÉTODO ESPECIAL - Obtener historial académico
   */
  static async obtenerHistorialAcademico(estudianteId, filtros = {}) {
    try {
      const whereInscripcion = { estudiante_id: estudianteId };
      const whereSeccion = {};

      if (filtros.ciclo) {
        whereSeccion.ciclo = filtros.ciclo;
      }

      if (filtros.estado) {
        whereInscripcion.estado = filtros.estado;
      }

      const inscripciones = await Inscripcion.findAll({
        where: whereInscripcion,
        include: [
          {
            model: Seccion,
            as: "seccion",
            where: whereSeccion,
            include: [
              {
                model: Materia,
                as: "materia",
              },
              {
                model: Profesor,
                as: "profesor",
                attributes: ["nombres", "apellidos"],
              },
            ],
          },
        ],
        order: [
          [{ model: Seccion, as: "seccion" }, "ciclo", "DESC"],
          [
            { model: Seccion, as: "seccion" },
            { model: Materia, as: "materia" },
            "nombre",
            "ASC",
          ],
        ],
      });

      // Calcular estadísticas
      const stats = {
        total_materias: inscripciones.length,
        aprobadas: inscripciones.filter((i) => i.estado === "aprobado").length,
        reprobadas: inscripciones.filter((i) => i.estado === "reprobado")
          .length,
        en_curso: inscripciones.filter((i) => i.estado === "inscrito").length,
        retiradas: inscripciones.filter((i) => i.estado === "retirado").length,
        creditos_cursados: inscripciones.reduce((total, i) => {
          return total + (i.seccion?.materia?.creditos || 0);
        }, 0),
        creditos_aprobados: inscripciones
          .filter((i) => i.estado === "aprobado")
          .reduce((total, i) => total + (i.seccion?.materia?.creditos || 0), 0),
      };

      return {
        success: true,
        data: {
          inscripciones,
          estadisticas: stats,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "Error al obtener historial académico",
      };
    }
  }

  /**
   * MÉTODO ESPECIAL - Buscar estudiantes avanzada
   */
  static async buscarEstudiantes(criterios) {
    try {
      const whereClause = {};
      const includeClause = [];

      // Filtros básicos
      if (criterios.carnet) {
        whereClause.carnet = { [Op.iLike]: `%${criterios.carnet}%` };
      }

      if (criterios.nombres) {
        whereClause[Op.or] = [
          { nombres: { [Op.iLike]: `%${criterios.nombres}%` } },
          { apellidos: { [Op.iLike]: `%${criterios.nombres}%` } },
        ];
      }

      if (criterios.estado) {
        whereClause.estado = criterios.estado;
      }

      // Filtro por ubicación
      if (
        criterios.municipio_id ||
        criterios.departamento_id ||
        criterios.pais_id
      ) {
        const municipioWhere = {};
        const departamentoWhere = {};
        const paisWhere = {};

        if (criterios.municipio_id) municipioWhere.id = criterios.municipio_id;
        if (criterios.departamento_id)
          departamentoWhere.id = criterios.departamento_id;
        if (criterios.pais_id) paisWhere.id = criterios.pais_id;

        includeClause.push({
          model: require("../models").Municipio,
          as: "municipio",
          where: Object.keys(municipioWhere).length
            ? municipioWhere
            : undefined,
          include: [
            {
              model: require("../models").Departamento,
              as: "departamento",
              where: Object.keys(departamentoWhere).length
                ? departamentoWhere
                : undefined,
              include: [
                {
                  model: require("../models").Pais,
                  as: "pais",
                  where: Object.keys(paisWhere).length ? paisWhere : undefined,
                },
              ],
            },
          ],
        });
      }

      const estudiantes = await Estudiante.findAll({
        where: whereClause,
        include: includeClause.length
          ? includeClause
          : [
              {
                model: require("../models").Municipio,
                as: "municipio",
                include: [
                  {
                    model: require("../models").Departamento,
                    as: "departamento",
                    include: [
                      {
                        model: require("../models").Pais,
                        as: "pais",
                      },
                    ],
                  },
                ],
              },
            ],
        order: [
          ["apellidos", "ASC"],
          ["nombres", "ASC"],
        ],
      });

      return {
        success: true,
        data: estudiantes,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "Error en búsqueda de estudiantes",
      };
    }
  }
}

module.exports = EstudianteService;
