/**
 * Servicio de Secciones
 * Sistema Universitario
 */

const {
  Seccion,
  Materia,
  Profesor,
  Estudiante,
  Inscripcion,
  Evaluacion,
  sequelize,
} = require("../models");
const { Op } = require("sequelize");

class SeccionService {
  /**
   * CREATE - Crear nueva sección
   */
  static async crearSeccion(datosSeccion) {
    const transaction = await sequelize.transaction();

    try {
      // Validar que existe la materia
      const materia = await Materia.findByPk(datosSeccion.materia_id, {
        transaction,
      });
      if (!materia) {
        throw new Error("Materia no encontrada");
      }

      if (!materia.isActiva()) {
        throw new Error("La materia no está activa");
      }

      // Validar que existe el profesor
      const profesor = await Profesor.findByPk(datosSeccion.profesor_id, {
        transaction,
      });
      if (!profesor) {
        throw new Error("Profesor no encontrado");
      }

      if (!profesor.isActivo()) {
        throw new Error("El profesor no está activo");
      }

      // Validar que no exista ya la combinación materia-sección-ciclo
      const seccionExistente = await Seccion.findOne({
        where: {
          materia_id: datosSeccion.materia_id,
          codigo_seccion: datosSeccion.codigo_seccion,
          ciclo: datosSeccion.ciclo,
        },
        transaction,
      });

      if (seccionExistente) {
        throw new Error(
          `Ya existe la sección ${datosSeccion.codigo_seccion} para esta materia en el ciclo ${datosSeccion.ciclo}`
        );
      }

      // Validar formato de ciclo
      const cicloRegex = /^\d{4}-[12]$/;
      if (!cicloRegex.test(datosSeccion.ciclo)) {
        throw new Error("El ciclo debe tener formato YYYY-1 o YYYY-2");
      }

      const nuevaSeccion = await Seccion.create(datosSeccion, { transaction });
      await transaction.commit();

      // Obtener sección completa con relaciones
      const seccionCompleta = await this.obtenerSeccionPorId(nuevaSeccion.id);

      return {
        success: true,
        data: seccionCompleta.data,
        message: "Sección creada exitosamente",
      };
    } catch (error) {
      await transaction.rollback();
      return {
        success: false,
        error: error.message,
        message: "Error al crear sección",
      };
    }
  }

  /**
   * READ - Obtener secciones con filtros
   */
  static async obtenerSecciones(filtros = {}, page = 1, limit = 20) {
    try {
      const whereClause = {};
      const includeClause = [
        {
          model: Materia,
          as: "materia",
          attributes: ["id", "nombre", "codigo", "creditos"],
        },
        {
          model: Profesor,
          as: "profesor",
          attributes: ["id", "nombres", "apellidos", "especialidad"],
        },
      ];

      // Aplicar filtros
      if (filtros.ciclo) {
        whereClause.ciclo = filtros.ciclo;
      }

      if (filtros.modalidad) {
        whereClause.modalidad = filtros.modalidad;
      }

      if (filtros.activa !== undefined) {
        whereClause.activa = filtros.activa;
      }

      if (filtros.materia_id) {
        whereClause.materia_id = filtros.materia_id;
      }

      if (filtros.profesor_id) {
        whereClause.profesor_id = filtros.profesor_id;
      }

      if (filtros.con_cupo) {
        whereClause[Op.and] = sequelize.where(
          sequelize.col("inscritos"),
          Op.lt,
          sequelize.col("cupo_maximo")
        );
      }

      if (filtros.codigo_seccion) {
        whereClause.codigo_seccion = {
          [Op.iLike]: `%${filtros.codigo_seccion}%`,
        };
      }

      // Filtro por nombre de materia
      if (filtros.nombre_materia) {
        includeClause[0].where = {
          nombre: { [Op.iLike]: `%${filtros.nombre_materia}%` },
        };
      }

      let queryOptions = {
        where: whereClause,
        include: includeClause,
        order: [
          ["ciclo", "DESC"],
          ["codigo_seccion", "ASC"],
        ],
      };

      // Aplicar paginación si se especifica
      if (page && limit) {
        const offset = (page - 1) * limit;
        queryOptions.limit = parseInt(limit);
        queryOptions.offset = offset;

        const { count, rows } = await Seccion.findAndCountAll(queryOptions);

        return {
          success: true,
          data: {
            secciones: rows,
            pagination: {
              page: parseInt(page),
              limit: parseInt(limit),
              total: count,
              totalPages: Math.ceil(count / limit),
            },
          },
        };
      } else {
        const secciones = await Seccion.findAll(queryOptions);
        return {
          success: true,
          data: secciones,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "Error al obtener secciones",
      };
    }
  }

  /**
   * READ - Obtener sección por ID con estudiantes inscritos
   */
  static async obtenerSeccionPorId(id) {
    try {
      const seccion = await Seccion.findByPk(id, {
        include: [
          {
            model: Materia,
            as: "materia",
          },
          {
            model: Profesor,
            as: "profesor",
          },
          {
            model: Estudiante,
            as: "estudiantes",
            through: {
              model: Inscripcion,
              attributes: ["id", "fecha_inscripcion", "nota_final", "estado"],
            },
            attributes: [
              "id",
              "carnet",
              "nombres",
              "apellidos",
              "email",
              "estado",
            ],
          },
          {
            model: Evaluacion,
            as: "evaluaciones",
            attributes: [
              "id",
              "nombre",
              "tipo",
              "ponderacion",
              "fecha_evaluacion",
            ],
          },
        ],
      });

      if (!seccion) {
        return {
          success: false,
          message: "Sección no encontrada",
        };
      }

      return {
        success: true,
        data: seccion,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "Error al obtener sección",
      };
    }
  }

  /**
   * UPDATE - Actualizar sección
   */
  static async actualizarSeccion(id, datosActualizacion) {
    const transaction = await sequelize.transaction();

    try {
      const seccion = await Seccion.findByPk(id, { transaction });
      if (!seccion) {
        throw new Error("Sección no encontrada");
      }

      // Validar materia si se está actualizando
      if (
        datosActualizacion.materia_id &&
        datosActualizacion.materia_id !== seccion.materia_id
      ) {
        const materia = await Materia.findByPk(datosActualizacion.materia_id, {
          transaction,
        });
        if (!materia || !materia.isActiva()) {
          throw new Error("Materia no encontrada o inactiva");
        }
      }

      // Validar profesor si se está actualizando
      if (
        datosActualizacion.profesor_id &&
        datosActualizacion.profesor_id !== seccion.profesor_id
      ) {
        const profesor = await Profesor.findByPk(
          datosActualizacion.profesor_id,
          { transaction }
        );
        if (!profesor || !profesor.isActivo()) {
          throw new Error("Profesor no encontrado o inactivo");
        }
      }

      // Validar código de sección único si se está actualizando
      if (
        datosActualizacion.codigo_seccion &&
        (datosActualizacion.codigo_seccion !== seccion.codigo_seccion ||
          datosActualizacion.ciclo !== seccion.ciclo ||
          datosActualizacion.materia_id !== seccion.materia_id)
      ) {
        const seccionExistente = await Seccion.findOne({
          where: {
            materia_id: datosActualizacion.materia_id || seccion.materia_id,
            codigo_seccion: datosActualizacion.codigo_seccion,
            ciclo: datosActualizacion.ciclo || seccion.ciclo,
            id: { [Op.ne]: id },
          },
          transaction,
        });

        if (seccionExistente) {
          throw new Error(
            "Ya existe una sección con este código para esta materia y ciclo"
          );
        }
      }

      // Validar que el nuevo cupo no sea menor que los inscritos actuales
      if (
        datosActualizacion.cupo_maximo &&
        datosActualizacion.cupo_maximo < seccion.inscritos
      ) {
        throw new Error(
          `El cupo máximo no puede ser menor a los estudiantes ya inscritos (${seccion.inscritos})`
        );
      }

      await seccion.update(datosActualizacion, { transaction });
      await transaction.commit();

      // Obtener sección actualizada
      const seccionActualizada = await this.obtenerSeccionPorId(id);

      return {
        success: true,
        data: seccionActualizada.data,
        message: "Sección actualizada exitosamente",
      };
    } catch (error) {
      await transaction.rollback();
      return {
        success: false,
        error: error.message,
        message: "Error al actualizar sección",
      };
    }
  }

  /**
   * DELETE - Eliminar sección
   */
  static async eliminarSeccion(id) {
    const transaction = await sequelize.transaction();

    try {
      const seccion = await Seccion.findByPk(id, { transaction });
      if (!seccion) {
        throw new Error("Sección no encontrada");
      }

      // Verificar que no tenga estudiantes inscritos
      const inscripciones = await Inscripcion.count({
        where: { seccion_id: id },
        transaction,
      });

      if (inscripciones > 0) {
        throw new Error(
          "No se puede eliminar la sección porque tiene estudiantes inscritos"
        );
      }

      // Verificar que no tenga evaluaciones
      const evaluaciones = await Evaluacion.count({
        where: { seccion_id: id },
        transaction,
      });

      if (evaluaciones > 0) {
        throw new Error(
          "No se puede eliminar la sección porque tiene evaluaciones registradas"
        );
      }

      await seccion.destroy({ transaction });
      await transaction.commit();

      return {
        success: true,
        message: "Sección eliminada exitosamente",
      };
    } catch (error) {
      await transaction.rollback();
      return {
        success: false,
        error: error.message,
        message: "Error al eliminar sección",
      };
    }
  }

  /**
   * MÉTODO ESPECIAL - Obtener estadísticas de sección
   */
  static async obtenerEstadisticasSeccion(id) {
    try {
      const seccion = await Seccion.findByPk(id, {
        include: [
          {
            model: Materia,
            as: "materia",
            attributes: ["nombre", "creditos"],
          },
          {
            model: Inscripcion,
            as: "inscripciones",
            attributes: ["estado", "nota_final"],
          },
        ],
      });

      if (!seccion) {
        return {
          success: false,
          message: "Sección no encontrada",
        };
      }

      const inscripciones = seccion.inscripciones;

      const stats = {
        cupo_total: seccion.cupo_maximo,
        inscritos: seccion.inscritos,
        cupos_disponibles: seccion.getCuposDisponibles(),
        porcentaje_ocupacion: seccion.getPorcentajeOcupacion(),

        // Estadísticas por estado
        estados: {
          inscrito: inscripciones.filter((i) => i.estado === "inscrito").length,
          aprobado: inscripciones.filter((i) => i.estado === "aprobado").length,
          reprobado: inscripciones.filter((i) => i.estado === "reprobado")
            .length,
          retirado: inscripciones.filter((i) => i.estado === "retirado").length,
        },

        // Estadísticas de notas (solo finalizados)
        notas: this.calcularEstadisticasNotas(
          inscripciones
            .filter((i) => i.nota_final !== null)
            .map((i) => i.nota_final)
        ),
      };

      return {
        success: true,
        data: {
          seccion: {
            id: seccion.id,
            codigo_completo: seccion.getCodigoCompleto(),
            materia: seccion.materia.nombre,
            ciclo: seccion.ciclo,
            modalidad: seccion.modalidad,
          },
          estadisticas: stats,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "Error al obtener estadísticas de sección",
      };
    }
  }

  /**
   * MÉTODO ESPECIAL - Obtener secciones por ciclo
   */
  static async obtenerSeccionesPorCiclo(ciclo, filtros = {}) {
    try {
      const whereClause = { ciclo, activa: true };

      if (filtros.modalidad) {
        whereClause.modalidad = filtros.modalidad;
      }

      if (filtros.con_cupo) {
        whereClause[Op.and] = sequelize.where(
          sequelize.col("inscritos"),
          Op.lt,
          sequelize.col("cupo_maximo")
        );
      }

      const secciones = await Seccion.findAll({
        where: whereClause,
        include: [
          {
            model: Materia,
            as: "materia",
            attributes: ["nombre", "codigo", "creditos"],
          },
          {
            model: Profesor,
            as: "profesor",
            attributes: ["nombres", "apellidos", "especialidad"],
          },
        ],
        order: [
          [{ model: Materia, as: "materia" }, "nombre", "ASC"],
          ["codigo_seccion", "ASC"],
        ],
      });

      // Agrupar por materia
      const seccionesAgrupadas = secciones.reduce((acc, seccion) => {
        const materiaId = seccion.materia.id;
        if (!acc[materiaId]) {
          acc[materiaId] = {
            materia: seccion.materia,
            secciones: [],
          };
        }
        acc[materiaId].secciones.push(seccion);
        return acc;
      }, {});

      return {
        success: true,
        data: {
          ciclo,
          total_secciones: secciones.length,
          materias: Object.values(seccionesAgrupadas),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "Error al obtener secciones por ciclo",
      };
    }
  }

  /**
   * MÉTODO ESPECIAL - Obtener reporte de demanda
   */
  static async obtenerReporteDemanda(ciclo) {
    try {
      const secciones = await Seccion.findAll({
        where: { ciclo, activa: true },
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
        order: [
          [sequelize.literal("(inscritos::DECIMAL / cupo_maximo)"), "DESC"],
        ],
      });

      const reporte = secciones.map((seccion) => ({
        id: seccion.id,
        materia: seccion.materia.nombre,
        codigo_materia: seccion.materia.codigo,
        codigo_seccion: seccion.codigo_seccion,
        profesor: seccion.profesor.getNombreCompleto(),
        cupo_maximo: seccion.cupo_maximo,
        inscritos: seccion.inscritos,
        cupos_disponibles: seccion.getCuposDisponibles(),
        porcentaje_ocupacion: seccion.getPorcentajeOcupacion(),
        modalidad: seccion.modalidad,
        estado:
          seccion.getPorcentajeOcupacion() >= 100
            ? "Llena"
            : seccion.getPorcentajeOcupacion() >= 80
            ? "Alta demanda"
            : seccion.getPorcentajeOcupacion() >= 50
            ? "Media demanda"
            : "Baja demanda",
      }));

      return {
        success: true,
        data: {
          ciclo,
          fecha_reporte: new Date().toISOString().split("T")[0],
          total_secciones: reporte.length,
          resumen: {
            llenas: reporte.filter((s) => s.porcentaje_ocupacion >= 100).length,
            alta_demanda: reporte.filter(
              (s) =>
                s.porcentaje_ocupacion >= 80 && s.porcentaje_ocupacion < 100
            ).length,
            media_demanda: reporte.filter(
              (s) => s.porcentaje_ocupacion >= 50 && s.porcentaje_ocupacion < 80
            ).length,
            baja_demanda: reporte.filter((s) => s.porcentaje_ocupacion < 50)
              .length,
          },
          secciones: reporte,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "Error al generar reporte de demanda",
      };
    }
  }

  /**
   * MÉTODO AUXILIAR - Calcular estadísticas de notas
   */
  static calcularEstadisticasNotas(notas) {
    if (!notas || notas.length === 0) {
      return {
        total: 0,
        promedio: null,
        nota_maxima: null,
        nota_minima: null,
        desviacion_estandar: null,
        distribucion: {
          excelente: 0, // 90-100
          muy_bueno: 0, // 80-89
          bueno: 0, // 70-79
          satisfactorio: 0, // 61-69
          reprobado: 0, // 0-60
        },
      };
    }

    const total = notas.length;
    const suma = notas.reduce((acc, nota) => acc + parseFloat(nota), 0);
    const promedio = suma / total;

    // Distribución de notas
    const distribucion = notas.reduce(
      (acc, nota) => {
        const n = parseFloat(nota);
        if (n >= 90) acc.excelente++;
        else if (n >= 80) acc.muy_bueno++;
        else if (n >= 70) acc.bueno++;
        else if (n >= 61) acc.satisfactorio++;
        else acc.reprobado++;
        return acc;
      },
      {
        excelente: 0,
        muy_bueno: 0,
        bueno: 0,
        satisfactorio: 0,
        reprobado: 0,
      }
    );

    // Desviación estándar
    const varianza =
      notas.reduce((acc, nota) => {
        return acc + Math.pow(parseFloat(nota) - promedio, 2);
      }, 0) / total;
    const desviacionEstandar = Math.sqrt(varianza);

    return {
      total,
      promedio: Math.round(promedio * 100) / 100,
      nota_maxima: Math.max(...notas.map((n) => parseFloat(n))),
      nota_minima: Math.min(...notas.map((n) => parseFloat(n))),
      desviacion_estandar: Math.round(desviacionEstandar * 100) / 100,
      distribucion,
    };
  }

  /**
   * MÉTODO ESPECIAL - Buscar secciones disponibles para inscripción
   */
  static async buscarSeccionesDisponibles(filtros = {}) {
    try {
      const whereClause = {
        activa: true,
        [Op.and]: sequelize.where(
          sequelize.col("inscritos"),
          Op.lt,
          sequelize.col("cupo_maximo")
        ),
      };

      if (filtros.ciclo) {
        whereClause.ciclo = filtros.ciclo;
      }

      if (filtros.modalidad) {
        whereClause.modalidad = filtros.modalidad;
      }

      const includeClause = [
        {
          model: Materia,
          as: "materia",
          attributes: ["id", "nombre", "codigo", "creditos"],
          where: filtros.materia_codigo
            ? {
                codigo: { [Op.iLike]: `%${filtros.materia_codigo}%` },
              }
            : undefined,
        },
        {
          model: Profesor,
          as: "profesor",
          attributes: ["nombres", "apellidos", "especialidad"],
        },
      ];

      const secciones = await Seccion.findAll({
        where: whereClause,
        include: includeClause,
        order: [
          ["ciclo", "DESC"],
          [{ model: Materia, as: "materia" }, "nombre", "ASC"],
          ["codigo_seccion", "ASC"],
        ],
      });

      const seccionesConDisponibilidad = secciones.map((seccion) => ({
        ...seccion.toJSON(),
        cupos_disponibles: seccion.getCuposDisponibles(),
        porcentaje_ocupacion: seccion.getPorcentajeOcupacion(),
        disponible_para_inscripcion: seccion.tieneCupo(),
      }));

      return {
        success: true,
        data: seccionesConDisponibilidad,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "Error al buscar secciones disponibles",
      };
    }
  }
}

module.exports = SeccionService;
