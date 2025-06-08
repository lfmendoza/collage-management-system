/**
 * Rutas de Reportes
 * Sistema Universitario - COMPLETO
 */

const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../middleware/errorHandler");

// ====================================
// REPORTES DE ESTUDIANTES
// ====================================

/**
 * GET /api/reportes/estudiantes-por-facultad
 * Reporte de distribución de estudiantes por facultad
 */
router.get(
  "/estudiantes-por-facultad",
  asyncHandler(async (req, res) => {
    const { incluir_inactivos = "false", formato = "json" } = req.query;

    try {
      const { sequelize } = require("../models");

      const whereClause =
        incluir_inactivos === "true" ? "" : "WHERE e.estado = 'activo'";

      const query = `
      SELECT 
        f.id as facultad_id,
        f.nombre as facultad,
        f.codigo as codigo_facultad,
        COUNT(DISTINCT e.id) as total_estudiantes,
        COUNT(DISTINCT CASE WHEN e.estado = 'activo' THEN e.id END) as estudiantes_activos,
        COUNT(DISTINCT CASE WHEN e.estado = 'graduado' THEN e.id END) as estudiantes_graduados,
        COUNT(DISTINCT CASE WHEN e.estado = 'suspendido' THEN e.id END) as estudiantes_suspendidos,
        COUNT(DISTINCT c.id) as total_carreras,
        ROUND(AVG(CASE WHEN e.promedio_general > 0 THEN e.promedio_general END), 2) as promedio_facultad,
        ROUND(
          (COUNT(DISTINCT CASE WHEN e.estado = 'activo' THEN e.id END) * 100.0 / 
           NULLIF(COUNT(DISTINCT e.id), 0)), 2
        ) as porcentaje_activos
      FROM facultades f
      LEFT JOIN carreras c ON f.id = c.facultad_id AND c.activa = true
      LEFT JOIN inscripciones_carrera ic ON c.id = ic.carrera_id AND ic.activa = true
      LEFT JOIN estudiantes e ON ic.estudiante_id = e.id
      ${whereClause}
      GROUP BY f.id, f.nombre, f.codigo
      HAVING COUNT(DISTINCT e.id) > 0
      ORDER BY total_estudiantes DESC
    `;

      const result = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
      });

      if (formato === "csv") {
        // Generar CSV
        const csvHeader =
          "Facultad,Código,Total Estudiantes,Activos,Graduados,Suspendidos,Carreras,Promedio,% Activos\n";
        const csvContent = result
          .map(
            (row) =>
              `"${row.facultad}","${row.codigo_facultad}",${
                row.total_estudiantes
              },${row.estudiantes_activos},${row.estudiantes_graduados},${
                row.estudiantes_suspendidos
              },${row.total_carreras},${row.promedio_facultad || 0},${
                row.porcentaje_activos || 0
              }`
          )
          .join("\n");

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          'attachment; filename="estudiantes_por_facultad.csv"'
        );
        res.send(csvHeader + csvContent);
      } else {
        const estadisticas = {
          total_facultades: result.length,
          total_estudiantes_sistema: result.reduce(
            (sum, f) => sum + parseInt(f.total_estudiantes),
            0
          ),
          facultad_mas_estudiantes: result[0]?.facultad || "N/A",
          promedio_general_sistema:
            result.length > 0
              ? Math.round(
                  (result.reduce(
                    (sum, f) => sum + (parseFloat(f.promedio_facultad) || 0),
                    0
                  ) /
                    result.length) *
                    100
                ) / 100
              : 0,
        };

        res.json({
          success: true,
          data: {
            facultades: result,
            estadisticas,
            parametros: { incluir_inactivos },
          },
          message: `Reporte generado para ${result.length} facultades`,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
        message: "Error al generar reporte de estudiantes por facultad",
      });
    }
  })
);

/**
 * GET /api/reportes/rendimiento-academico
 * Reporte de rendimiento académico por carrera
 */
router.get(
  "/rendimiento-academico",
  asyncHandler(async (req, res) => {
    const {
      carrera_id,
      facultad_id,
      promedio_min = 0,
      formato = "json",
      incluir_detalle = "false",
    } = req.query;

    try {
      const { sequelize } = require("../models");

      let whereClause = "WHERE e.estado = 'activo'";
      const params = [];

      if (carrera_id) {
        whereClause += ` AND c.id = $${params.length + 1}`;
        params.push(parseInt(carrera_id));
      }

      if (facultad_id) {
        whereClause += ` AND f.id = $${params.length + 1}`;
        params.push(parseInt(facultad_id));
      }

      if (promedio_min > 0) {
        whereClause += ` AND e.promedio_general >= $${params.length + 1}`;
        params.push(parseFloat(promedio_min));
      }

      const query = `
      SELECT 
        c.id as carrera_id,
        c.nombre as carrera,
        c.codigo as codigo_carrera,
        f.nombre as facultad,
        COUNT(DISTINCT e.id) as total_estudiantes,
        ROUND(AVG(e.promedio_general), 2) as promedio_carrera,
        ROUND(AVG(e.creditos_aprobados), 0) as promedio_creditos,
        MAX(e.promedio_general) as mejor_promedio,
        MIN(e.promedio_general) as menor_promedio,
        COUNT(CASE WHEN e.promedio_general >= 90 THEN 1 END) as excelentes,
        COUNT(CASE WHEN e.promedio_general >= 80 AND e.promedio_general < 90 THEN 1 END) as muy_buenos,
        COUNT(CASE WHEN e.promedio_general >= 70 AND e.promedio_general < 80 THEN 1 END) as buenos,
        COUNT(CASE WHEN e.promedio_general >= 61 AND e.promedio_general < 70 THEN 1 END) as satisfactorios,
        COUNT(CASE WHEN e.promedio_general > 0 AND e.promedio_general < 61 THEN 1 END) as necesitan_mejorar,
        ROUND(
          (COUNT(CASE WHEN e.promedio_general >= 80 THEN 1 END) * 100.0 / 
           NULLIF(COUNT(CASE WHEN e.promedio_general > 0 THEN 1 END), 0)), 2
        ) as porcentaje_alto_rendimiento
      FROM carreras c
      INNER JOIN facultades f ON c.facultad_id = f.id
      LEFT JOIN inscripciones_carrera ic ON c.id = ic.carrera_id AND ic.activa = true
      LEFT JOIN estudiantes e ON ic.estudiante_id = e.id
      ${whereClause}
      GROUP BY c.id, c.nombre, c.codigo, f.nombre
      HAVING COUNT(DISTINCT e.id) > 0
      ORDER BY promedio_carrera DESC
    `;

      const result = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
        bind: params,
      });

      if (formato === "csv") {
        const csvHeader =
          "Carrera,Código,Facultad,Total Estudiantes,Promedio,Créditos Promedio,Mejor Promedio,Menor Promedio,Excelentes,Muy Buenos,Buenos,Satisfactorios,Necesitan Mejorar,% Alto Rendimiento\n";
        const csvContent = result
          .map(
            (row) =>
              `"${row.carrera}","${row.codigo_carrera}","${row.facultad}",${
                row.total_estudiantes
              },${row.promedio_carrera},${row.promedio_creditos},${
                row.mejor_promedio
              },${row.menor_promedio},${row.excelentes},${row.muy_buenos},${
                row.buenos
              },${row.satisfactorios},${row.necesitan_mejorar},${
                row.porcentaje_alto_rendimiento || 0
              }`
          )
          .join("\n");

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          'attachment; filename="rendimiento_academico.csv"'
        );
        res.send(csvHeader + csvContent);
      } else {
        let detalleEstudiantes = null;

        if (incluir_detalle === "true" && result.length > 0) {
          const detalleQuery = `
          SELECT 
            e.carnet,
            e.nombres || ' ' || e.apellidos as nombre_completo,
            e.promedio_general,
            e.creditos_aprobados,
            c.nombre as carrera,
            ic.semestre_actual,
            CASE 
              WHEN e.promedio_general >= 90 THEN 'Excelente'
              WHEN e.promedio_general >= 80 THEN 'Muy Bueno'
              WHEN e.promedio_general >= 70 THEN 'Bueno'
              WHEN e.promedio_general >= 61 THEN 'Satisfactorio'
              ELSE 'Necesita Mejorar'
            END as categoria_rendimiento
          FROM estudiantes e
          INNER JOIN inscripciones_carrera ic ON e.id = ic.estudiante_id AND ic.activa = true
          INNER JOIN carreras c ON ic.carrera_id = c.id
          INNER JOIN facultades f ON c.facultad_id = f.id
          ${whereClause}
          ORDER BY e.promedio_general DESC
          LIMIT 50
        `;

          detalleEstudiantes = await sequelize.query(detalleQuery, {
            type: sequelize.QueryTypes.SELECT,
            bind: params,
          });
        }

        res.json({
          success: true,
          data: {
            resumen_por_carrera: result,
            detalle_estudiantes: detalleEstudiantes,
            estadisticas_generales: {
              total_carreras: result.length,
              promedio_sistema:
                result.length > 0
                  ? Math.round(
                      (result.reduce(
                        (sum, c) => sum + parseFloat(c.promedio_carrera),
                        0
                      ) /
                        result.length) *
                        100
                    ) / 100
                  : 0,
              carrera_mejor_rendimiento: result[0]?.carrera || "N/A",
            },
          },
          filtros_aplicados: { carrera_id, facultad_id, promedio_min },
          message: `Reporte de rendimiento generado para ${result.length} carreras`,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
        message: "Error al generar reporte de rendimiento académico",
      });
    }
  })
);

// ====================================
// REPORTES DE SECCIONES
// ====================================

/**
 * GET /api/reportes/demanda-secciones/:ciclo
 * Reporte de demanda de secciones por ciclo
 */
router.get(
  "/demanda-secciones/:ciclo",
  asyncHandler(async (req, res) => {
    const { ciclo } = req.params;
    const { modalidad, formato = "json" } = req.query;

    // Validar formato de ciclo
    const cicloRegex = /^\d{4}-[12]$/;
    if (!cicloRegex.test(ciclo)) {
      return res.status(400).json({
        success: false,
        error: "Formato de ciclo inválido",
        message: "El ciclo debe tener formato YYYY-1 o YYYY-2",
      });
    }

    try {
      const { sequelize } = require("../models");

      let whereClause = `WHERE s.ciclo = $1 AND s.activa = true`;
      const params = [ciclo];

      if (modalidad) {
        whereClause += ` AND s.modalidad = $${params.length + 1}`;
        params.push(modalidad);
      }

      const query = `
      SELECT 
        m.codigo as codigo_materia,
        m.nombre as materia,
        m.creditos,
        COUNT(s.id) as total_secciones,
        SUM(s.cupo_maximo) as cupo_total,
        SUM(s.inscritos) as total_inscritos,
        ROUND((SUM(s.inscritos) * 100.0 / NULLIF(SUM(s.cupo_maximo), 0)), 2) as porcentaje_ocupacion,
        ROUND(AVG(s.inscritos), 1) as promedio_inscritos_seccion,
        MAX(s.inscritos) as max_inscritos,
        MIN(s.inscritos) as min_inscritos,
        COUNT(CASE WHEN s.inscritos >= s.cupo_maximo THEN 1 END) as secciones_llenas,
        COUNT(CASE WHEN s.inscritos = 0 THEN 1 END) as secciones_vacias,
        f.nombre as facultad,
        STRING_AGG(DISTINCT s.modalidad, ', ') as modalidades_disponibles
      FROM secciones s
      INNER JOIN materias m ON s.materia_id = m.id
      LEFT JOIN pensum p ON m.id = p.materia_id
      LEFT JOIN carreras c ON p.carrera_id = c.id
      LEFT JOIN facultades f ON c.facultad_id = f.id
      ${whereClause}
      GROUP BY m.id, m.codigo, m.nombre, m.creditos, f.nombre
      ORDER BY porcentaje_ocupacion DESC, total_inscritos DESC
    `;

      const result = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
        bind: params,
      });

      if (formato === "csv") {
        const csvHeader =
          "Código Materia,Materia,Créditos,Total Secciones,Cupo Total,Total Inscritos,% Ocupación,Promedio por Sección,Máx Inscritos,Mín Inscritos,Secciones Llenas,Secciones Vacías,Facultad,Modalidades\n";
        const csvContent = result
          .map(
            (row) =>
              `"${row.codigo_materia}","${row.materia}",${row.creditos},${
                row.total_secciones
              },${row.cupo_total},${row.total_inscritos},${
                row.porcentaje_ocupacion || 0
              },${row.promedio_inscritos_seccion},${row.max_inscritos},${
                row.min_inscritos
              },${row.secciones_llenas},${row.secciones_vacias},"${
                row.facultad || "N/A"
              }","${row.modalidades_disponibles}"`
          )
          .join("\n");

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="demanda_secciones_${ciclo}.csv"`
        );
        res.send(csvHeader + csvContent);
      } else {
        const estadisticas = {
          ciclo_analizado: ciclo,
          total_materias: result.length,
          total_secciones: result.reduce(
            (sum, m) => sum + parseInt(m.total_secciones),
            0
          ),
          total_cupos: result.reduce(
            (sum, m) => sum + parseInt(m.cupo_total),
            0
          ),
          total_inscritos: result.reduce(
            (sum, m) => sum + parseInt(m.total_inscritos),
            0
          ),
          porcentaje_ocupacion_global:
            result.length > 0
              ? Math.round(
                  (result.reduce(
                    (sum, m) => sum + parseInt(m.total_inscritos),
                    0
                  ) /
                    result.reduce(
                      (sum, m) => sum + parseInt(m.cupo_total),
                      0
                    )) *
                    100 *
                    100
                ) / 100
              : 0,
          materias_alta_demanda: result.filter(
            (m) => parseFloat(m.porcentaje_ocupacion) >= 90
          ).length,
          materias_baja_demanda: result.filter(
            (m) => parseFloat(m.porcentaje_ocupacion) <= 50
          ).length,
        };

        res.json({
          success: true,
          data: {
            demanda_por_materia: result,
            estadisticas_globales: estadisticas,
          },
          filtros_aplicados: { ciclo, modalidad },
          message: `Reporte de demanda generado para ${result.length} materias del ciclo ${ciclo}`,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
        message: "Error al generar reporte de demanda de secciones",
      });
    }
  })
);

/**
 * GET /api/reportes/carga-profesores
 * Reporte de carga académica de profesores
 */
router.get(
  "/carga-profesores",
  asyncHandler(async (req, res) => {
    const { ciclo = "2025-1", departamento_id, formato = "json" } = req.query;

    try {
      const { sequelize } = require("../models");

      let whereClause = `WHERE s.ciclo = $1 AND s.activa = true AND p.activo = true`;
      const params = [ciclo];

      if (departamento_id) {
        whereClause += ` AND da.id = $${params.length + 1}`;
        params.push(parseInt(departamento_id));
      }

      const query = `
      SELECT 
        p.codigo_empleado,
        p.nombres || ' ' || p.apellidos as profesor,
        p.especialidad,
        da.nombre as departamento,
        COUNT(s.id) as total_secciones,
        SUM(s.inscritos) as total_estudiantes,
        SUM(m.creditos * s.inscritos) as creditos_estudiante,
        ROUND(AVG(s.inscritos), 1) as promedio_estudiantes_seccion,
        STRING_AGG(DISTINCT s.modalidad, ', ') as modalidades,
        STRING_AGG(DISTINCT s.horario, ' | ') as horarios,
        ROUND(pd.porcentaje_tiempo, 2) as porcentaje_tiempo_departamento,
        COUNT(DISTINCT m.id) as materias_distintas
      FROM profesores p
      LEFT JOIN profesor_departamento pd ON p.id = pd.profesor_id AND pd.activa = true
      LEFT JOIN departamentos_academicos da ON pd.departamento_id = da.id
      LEFT JOIN secciones s ON p.id = s.profesor_id
      LEFT JOIN materias m ON s.materia_id = m.id
      ${whereClause}
      GROUP BY p.id, p.codigo_empleado, p.nombres, p.apellidos, p.especialidad, da.nombre, pd.porcentaje_tiempo
      HAVING COUNT(s.id) > 0
      ORDER BY total_estudiantes DESC, total_secciones DESC
    `;

      const result = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
        bind: params,
      });

      if (formato === "csv") {
        const csvHeader =
          "Código Empleado,Profesor,Especialidad,Departamento,Total Secciones,Total Estudiantes,Créditos×Estudiante,Promedio por Sección,Modalidades,% Tiempo,Materias Distintas\n";
        const csvContent = result
          .map(
            (row) =>
              `"${row.codigo_empleado}","${row.profesor}","${
                row.especialidad || ""
              }","${row.departamento || ""}",${row.total_secciones},${
                row.total_estudiantes
              },${row.creditos_estudiante},${
                row.promedio_estudiantes_seccion
              },"${row.modalidades}",${
                row.porcentaje_tiempo_departamento || 100
              },${row.materias_distintas}`
          )
          .join("\n");

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="carga_profesores_${ciclo}.csv"`
        );
        res.send(csvHeader + csvContent);
      } else {
        const estadisticas = {
          ciclo_analizado: ciclo,
          total_profesores_activos: result.length,
          total_estudiantes_sistema: result.reduce(
            (sum, p) => sum + parseInt(p.total_estudiantes),
            0
          ),
          promedio_estudiantes_profesor:
            result.length > 0
              ? Math.round(
                  (result.reduce(
                    (sum, p) => sum + parseInt(p.total_estudiantes),
                    0
                  ) /
                    result.length) *
                    100
                ) / 100
              : 0,
          profesor_mayor_carga: result[0]?.profesor || "N/A",
          distribucion_carga: {
            alta_carga: result.filter(
              (p) => parseInt(p.total_estudiantes) >= 100
            ).length,
            media_carga: result.filter(
              (p) =>
                parseInt(p.total_estudiantes) >= 50 &&
                parseInt(p.total_estudiantes) < 100
            ).length,
            baja_carga: result.filter((p) => parseInt(p.total_estudiantes) < 50)
              .length,
          },
        };

        res.json({
          success: true,
          data: {
            carga_por_profesor: result,
            estadisticas_sistema: estadisticas,
          },
          filtros_aplicados: { ciclo, departamento_id },
          message: `Reporte de carga generado para ${result.length} profesores del ciclo ${ciclo}`,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
        message: "Error al generar reporte de carga de profesores",
      });
    }
  })
);

// ====================================
// REPORTES ESPECIALES
// ====================================

/**
 * GET /api/reportes/materias-criticas
 * Reporte de materias con alta tasa de reprobación
 */
router.get(
  "/materias-criticas",
  asyncHandler(async (req, res) => {
    const {
      ciclo,
      porcentaje_min = 30,
      incluir_actuales = "true",
      formato = "json",
    } = req.query;

    try {
      const { sequelize } = require("../models");

      let whereClause = `WHERE i.estado IN ('aprobado', 'reprobado')`;
      const params = [];

      if (ciclo) {
        whereClause += ` AND s.ciclo = $${params.length + 1}`;
        params.push(ciclo);
      }

      if (incluir_actuales === "false") {
        whereClause += ` AND s.ciclo != '2025-1'`;
      }

      const query = `
      SELECT 
        m.codigo,
        m.nombre as materia,
        m.creditos,
        COUNT(i.id) as total_estudiantes,
        COUNT(CASE WHEN i.estado = 'reprobado' THEN 1 END) as reprobados,
        COUNT(CASE WHEN i.estado = 'aprobado' THEN 1 END) as aprobados,
        ROUND(
          (COUNT(CASE WHEN i.estado = 'reprobado' THEN 1 END) * 100.0 / 
           NULLIF(COUNT(i.id), 0)), 2
        ) as porcentaje_reprobacion,
        ROUND(AVG(CASE WHEN i.estado = 'aprobado' THEN i.nota_final END), 2) as promedio_aprobados,
        ROUND(AVG(CASE WHEN i.estado = 'reprobado' THEN i.nota_final END), 2) as promedio_reprobados,
        COUNT(DISTINCT s.id) as secciones_analizadas,
        STRING_AGG(DISTINCT s.ciclo, ', ' ORDER BY s.ciclo DESC) as ciclos,
        STRING_AGG(DISTINCT f.nombre, ', ') as facultades
      FROM materias m
      INNER JOIN secciones s ON m.id = s.materia_id
      INNER JOIN inscripciones i ON s.id = i.seccion_id
      LEFT JOIN pensum p ON m.id = p.materia_id
      LEFT JOIN carreras c ON p.carrera_id = c.id
      LEFT JOIN facultades f ON c.facultad_id = f.id
      ${whereClause}
      GROUP BY m.id, m.codigo, m.nombre, m.creditos
      HAVING (COUNT(CASE WHEN i.estado = 'reprobado' THEN 1 END) * 100.0 / 
              NULLIF(COUNT(i.id), 0)) >= $${params.length + 1}
      ORDER BY porcentaje_reprobacion DESC, total_estudiantes DESC
    `;

      params.push(parseFloat(porcentaje_min));

      const result = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
        bind: params,
      });

      if (formato === "csv") {
        const csvHeader =
          "Código,Materia,Créditos,Total Estudiantes,Reprobados,Aprobados,% Reprobación,Promedio Aprobados,Promedio Reprobados,Secciones,Ciclos,Facultades\n";
        const csvContent = result
          .map(
            (row) =>
              `"${row.codigo}","${row.materia}",${row.creditos},${
                row.total_estudiantes
              },${row.reprobados},${row.aprobados},${
                row.porcentaje_reprobacion
              },${row.promedio_aprobados || 0},${
                row.promedio_reprobados || 0
              },${row.secciones_analizadas},"${row.ciclos}","${
                row.facultades || "N/A"
              }"`
          )
          .join("\n");

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          'attachment; filename="materias_criticas.csv"'
        );
        res.send(csvHeader + csvContent);
      } else {
        const analisis = {
          criterio_reprobacion: `${porcentaje_min}% o más`,
          total_materias_criticas: result.length,
          promedio_reprobacion:
            result.length > 0
              ? Math.round(
                  (result.reduce(
                    (sum, m) => sum + parseFloat(m.porcentaje_reprobacion),
                    0
                  ) /
                    result.length) *
                    100
                ) / 100
              : 0,
          materia_mas_critica: result[0]?.materia || "N/A",
          estudiantes_afectados: result.reduce(
            (sum, m) => sum + parseInt(m.total_estudiantes),
            0
          ),
          recomendaciones: [
            "Revisar metodologías de enseñanza en materias críticas",
            "Implementar tutorías adicionales",
            "Analizar prerequisitos y contenido curricular",
            "Capacitar profesores en técnicas pedagógicas",
          ],
        };

        res.json({
          success: true,
          data: {
            materias_criticas: result,
            analisis_global: analisis,
          },
          filtros_aplicados: { ciclo, porcentaje_min, incluir_actuales },
          message: `Se identificaron ${result.length} materias críticas con más del ${porcentaje_min}% de reprobación`,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
        message: "Error al generar reporte de materias críticas",
      });
    }
  })
);

/**
 * GET /api/reportes/historial-estudiante/:carnet
 * Reporte completo del historial académico de un estudiante
 */
router.get(
  "/historial-estudiante/:carnet",
  asyncHandler(async (req, res) => {
    const { carnet } = req.params;
    const { formato = "json", incluir_notas_parciales = "false" } = req.query;

    try {
      const { sequelize } = require("../models");

      // Información básica del estudiante
      const infoEstudiante = await sequelize.query(
        `
      SELECT 
        e.id,
        e.carnet,
        e.nombres || ' ' || e.apellidos as nombre_completo,
        e.email,
        e.estado,
        e.promedio_general,
        e.creditos_aprobados,
        e.fecha_ingreso,
        c.nombre as carrera,
        c.creditos_totales as creditos_carrera,
        f.nombre as facultad,
        ic.semestre_actual,
        ROUND((e.creditos_aprobados * 100.0 / c.creditos_totales), 2) as porcentaje_avance
      FROM estudiantes e
      LEFT JOIN inscripciones_carrera ic ON e.id = ic.estudiante_id AND ic.activa = true
      LEFT JOIN carreras c ON ic.carrera_id = c.id
      LEFT JOIN facultades f ON c.facultad_id = f.id
      WHERE e.carnet = $1
    `,
        {
          type: sequelize.QueryTypes.SELECT,
          bind: [carnet],
        }
      );

      if (infoEstudiante.length === 0) {
        return res.status(404).json({
          success: false,
          message: `No se encontró estudiante con carnet: ${carnet}`,
        });
      }

      const estudiante = infoEstudiante[0];

      // Historial de materias cursadas
      const historialMaterias = await sequelize.query(
        `
      SELECT 
        s.ciclo,
        m.codigo as codigo_materia,
        m.nombre as materia,
        m.creditos,
        s.codigo_seccion,
        p.nombres || ' ' || p.apellidos as profesor,
        i.nota_final,
        i.estado,
        i.fecha_inscripcion,
        CASE 
          WHEN i.nota_final >= 61 THEN 'Aprobado'
          WHEN i.nota_final < 61 AND i.nota_final IS NOT NULL THEN 'Reprobado'
          WHEN i.estado = 'retirado' THEN 'Retirado'
          ELSE 'En Curso'
        END as resultado
      FROM inscripciones i
      INNER JOIN secciones s ON i.seccion_id = s.id
      INNER JOIN materias m ON s.materia_id = m.id
      INNER JOIN profesores p ON s.profesor_id = p.id
      WHERE i.estudiante_id = $1
      ORDER BY s.ciclo DESC, m.nombre
    `,
        {
          type: sequelize.QueryTypes.SELECT,
          bind: [estudiante.id],
        }
      );

      // Estadísticas del historial
      const estadisticas = {
        total_materias_cursadas: historialMaterias.length,
        materias_aprobadas: historialMaterias.filter(
          (m) => m.estado === "aprobado"
        ).length,
        materias_reprobadas: historialMaterias.filter(
          (m) => m.estado === "reprobado"
        ).length,
        materias_retiradas: historialMaterias.filter(
          (m) => m.estado === "retirado"
        ).length,
        materias_en_curso: historialMaterias.filter(
          (m) => m.estado === "inscrito"
        ).length,
        mejor_nota: Math.max(
          ...historialMaterias
            .filter((m) => m.nota_final)
            .map((m) => m.nota_final),
          0
        ),
        peor_nota: Math.min(
          ...historialMaterias
            .filter((m) => m.nota_final && m.estado !== "retirado")
            .map((m) => m.nota_final),
          100
        ),
        ciclos_cursados: [...new Set(historialMaterias.map((m) => m.ciclo))]
          .length,
      };

      if (formato === "csv") {
        const csvHeader =
          "Carnet,Estudiante,Carrera,Estado,Promedio General,Créditos Aprobados,% Avance\nCiclo,Código,Materia,Créditos,Sección,Profesor,Nota,Estado,Resultado\n";
        const infoBasica = `"${estudiante.carnet}","${estudiante.nombre_completo}","${estudiante.carrera}","${estudiante.estado}",${estudiante.promedio_general},${estudiante.creditos_aprobados},${estudiante.porcentaje_avance}\n`;
        const csvContent = historialMaterias
          .map(
            (row) =>
              `"${row.ciclo}","${row.codigo_materia}","${row.materia}",${
                row.creditos
              },"${row.codigo_seccion}","${row.profesor}",${
                row.nota_final || ""
              },${row.estado},"${row.resultado}"`
          )
          .join("\n");

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="historial_${carnet}.csv"`
        );
        res.send(csvHeader + infoBasica + csvContent);
      } else {
        let notasParciales = null;

        if (incluir_notas_parciales === "true") {
          notasParciales = await sequelize.query(
            `
          SELECT 
            s.ciclo,
            m.codigo as codigo_materia,
            m.nombre as materia,
            ev.nombre as evaluacion,
            ev.tipo,
            ev.ponderacion,
            n.nota,
            n.fecha_calificacion,
            n.observaciones
          FROM notas n
          INNER JOIN evaluaciones ev ON n.evaluacion_id = ev.id
          INNER JOIN inscripciones i ON n.inscripcion_id = i.id
          INNER JOIN secciones s ON i.seccion_id = s.id
          INNER JOIN materias m ON s.materia_id = m.id
          WHERE i.estudiante_id = $1
          ORDER BY s.ciclo DESC, m.nombre, ev.id
        `,
            {
              type: sequelize.QueryTypes.SELECT,
              bind: [estudiante.id],
            }
          );
        }

        res.json({
          success: true,
          data: {
            informacion_estudiante: estudiante,
            historial_academico: historialMaterias,
            estadisticas_academicas: estadisticas,
            notas_parciales: notasParciales,
          },
          parametros: { incluir_notas_parciales },
          message: `Historial académico generado para el estudiante ${carnet}`,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
        message: "Error al generar historial académico del estudiante",
      });
    }
  })
);

// ====================================
// REPORTES DE DASHBOARD EJECUTIVO
// ====================================

/**
 * GET /api/reportes/dashboard-ejecutivo
 * Dashboard con métricas clave del sistema
 */
router.get(
  "/dashboard-ejecutivo",
  asyncHandler(async (req, res) => {
    const { ciclo = "2025-1" } = req.query;

    try {
      const { sequelize } = require("../models");

      // Métricas generales del sistema
      const metricas = await sequelize.query(
        `
      SELECT 
        (SELECT COUNT(*) FROM estudiantes WHERE estado = 'activo') as estudiantes_activos,
        (SELECT COUNT(*) FROM estudiantes WHERE estado = 'graduado') as estudiantes_graduados,
        (SELECT COUNT(*) FROM estudiantes) as total_estudiantes,
        (SELECT COUNT(*) FROM profesores WHERE activo = true) as profesores_activos,
        (SELECT COUNT(*) FROM secciones WHERE ciclo = $1 AND activa = true) as secciones_ciclo_actual,
        (SELECT COUNT(*) FROM inscripciones i 
         INNER JOIN secciones s ON i.seccion_id = s.id 
         WHERE s.ciclo = $1) as inscripciones_ciclo_actual,
        (SELECT COUNT(*) FROM facultades WHERE activa = true) as facultades_activas,
        (SELECT COUNT(*) FROM carreras WHERE activa = true) as carreras_activas,
        (SELECT ROUND(AVG(promedio_general), 2) FROM estudiantes WHERE promedio_general > 0) as promedio_sistema
    `,
        {
          type: sequelize.QueryTypes.SELECT,
          bind: [ciclo],
        }
      );

      // Top 5 carreras con más estudiantes
      const topCarreras = await sequelize.query(
        `
      SELECT 
        c.nombre as carrera,
        f.nombre as facultad,
        COUNT(DISTINCT e.id) as total_estudiantes,
        ROUND(AVG(e.promedio_general), 2) as promedio_carrera
      FROM carreras c
      INNER JOIN facultades f ON c.facultad_id = f.id
      LEFT JOIN inscripciones_carrera ic ON c.id = ic.carrera_id AND ic.activa = true
      LEFT JOIN estudiantes e ON ic.estudiante_id = e.id AND e.estado = 'activo'
      GROUP BY c.id, c.nombre, f.nombre
      HAVING COUNT(DISTINCT e.id) > 0
      ORDER BY total_estudiantes DESC
      LIMIT 5
    `,
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );

      // Top 5 materias más demandadas del ciclo
      const topMaterias = await sequelize.query(
        `
      SELECT 
        m.codigo,
        m.nombre as materia,
        COUNT(i.id) as total_inscripciones,
        COUNT(DISTINCT s.id) as total_secciones,
        ROUND((COUNT(i.id) * 1.0 / COUNT(DISTINCT s.id)), 1) as promedio_por_seccion
      FROM materias m
      INNER JOIN secciones s ON m.id = s.materia_id
      LEFT JOIN inscripciones i ON s.id = i.seccion_id
      WHERE s.ciclo = $1 AND s.activa = true
      GROUP BY m.id, m.codigo, m.nombre
      ORDER BY total_inscripciones DESC
      LIMIT 5
    `,
        {
          type: sequelize.QueryTypes.SELECT,
          bind: [ciclo],
        }
      );

      // Distribución de estudiantes por estado
      const distribucionEstados = await sequelize.query(
        `
      SELECT 
        estado,
        COUNT(*) as cantidad,
        ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM estudiantes)), 2) as porcentaje
      FROM estudiantes
      GROUP BY estado
      ORDER BY cantidad DESC
    `,
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );

      // Tendencia de inscripciones (últimos 5 ciclos)
      const tendenciaInscripciones = await sequelize.query(
        `
      SELECT 
        s.ciclo,
        COUNT(DISTINCT i.id) as total_inscripciones,
        COUNT(DISTINCT i.estudiante_id) as estudiantes_unicos,
        COUNT(DISTINCT s.id) as secciones_ofertadas
      FROM inscripciones i
      INNER JOIN secciones s ON i.seccion_id = s.id
      WHERE s.ciclo IN (
        SELECT DISTINCT ciclo 
        FROM secciones 
        WHERE activa = true
        ORDER BY ciclo DESC 
        LIMIT 5
      )
      GROUP BY s.ciclo
      ORDER BY s.ciclo DESC
    `,
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );

      // Indicadores de rendimiento
      const indicadores = {
        tasa_graduacion:
          metricas[0].total_estudiantes > 0
            ? Math.round(
                (metricas[0].estudiantes_graduados /
                  metricas[0].total_estudiantes) *
                  100 *
                  100
              ) / 100
            : 0,
        ratio_estudiante_profesor:
          metricas[0].profesores_activos > 0
            ? Math.round(
                (metricas[0].estudiantes_activos /
                  metricas[0].profesores_activos) *
                  100
              ) / 100
            : 0,
        ocupacion_secciones:
          metricas[0].secciones_ciclo_actual > 0
            ? Math.round(
                (metricas[0].inscripciones_ciclo_actual /
                  metricas[0].secciones_ciclo_actual) *
                  100
              ) / 100
            : 0,
      };

      res.json({
        success: true,
        data: {
          metricas_generales: metricas[0],
          indicadores_clave: indicadores,
          top_carreras: topCarreras,
          top_materias_demandadas: topMaterias,
          distribucion_estudiantes: distribucionEstados,
          tendencia_inscripciones: tendenciaInscripciones,
          ciclo_analizado: ciclo,
          fecha_generacion: new Date().toISOString(),
        },
        message: "Dashboard ejecutivo generado exitosamente",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
        message: "Error al generar dashboard ejecutivo",
      });
    }
  })
);

// ====================================
// REPORTES PERSONALIZADOS
// ====================================

/**
 * POST /api/reportes/personalizado
 * Ejecutar consulta personalizada (solo SELECT)
 */
router.post(
  "/personalizado",
  asyncHandler(async (req, res) => {
    const { consulta, parametros = [], titulo, descripcion } = req.body;

    if (!consulta || typeof consulta !== "string") {
      return res.status(400).json({
        success: false,
        error: "Consulta requerida",
        message: "Debe proporcionar una consulta SQL válida",
      });
    }

    // Validaciones de seguridad
    const consultaLimpia = consulta.toLowerCase().trim();
    const operacionesProhibidas = [
      "insert",
      "update",
      "delete",
      "drop",
      "alter",
      "create",
      "truncate",
      "grant",
      "revoke",
      "exec",
      "execute",
    ];

    if (operacionesProhibidas.some((op) => consultaLimpia.includes(op))) {
      return res.status(400).json({
        success: false,
        error: "Operación no permitida",
        message: "Solo se permiten consultas SELECT para reportes",
      });
    }

    if (!consultaLimpia.startsWith("select")) {
      return res.status(400).json({
        success: false,
        error: "Consulta inválida",
        message: "La consulta debe comenzar con SELECT",
      });
    }

    // Limitar longitud de la consulta
    if (consulta.length > 5000) {
      return res.status(400).json({
        success: false,
        error: "Consulta muy larga",
        message: "La consulta no puede exceder 5000 caracteres",
      });
    }

    try {
      const { sequelize } = require("../models");

      const resultado = await sequelize.query(consulta, {
        type: sequelize.QueryTypes.SELECT,
        bind: parametros,
        timeout: 30000, // 30 segundos máximo
      });

      res.json({
        success: true,
        data: {
          resultados: resultado,
          metadatos: {
            titulo: titulo || "Consulta Personalizada",
            descripcion: descripcion || "",
            total_registros: resultado.length,
            fecha_ejecucion: new Date().toISOString(),
            parametros_utilizados: parametros,
          },
        },
        message: `Consulta ejecutada exitosamente. ${resultado.length} registros encontrados.`,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: "Error en la consulta",
        message: error.message,
        detalle: "Verifique la sintaxis SQL y los parámetros proporcionados",
      });
    }
  })
);

// ====================================
// UTILIDADES DE EXPORTACIÓN
// ====================================

/**
 * GET /api/reportes/exportar-estudiantes
 * Exportar listado completo de estudiantes
 */
router.get(
  "/exportar-estudiantes",
  asyncHandler(async (req, res) => {
    const {
      formato = "csv",
      estado = "activo",
      carrera_id,
      facultad_id,
      incluir_historial = "false",
    } = req.query;

    try {
      const { sequelize } = require("../models");

      let whereClause = `WHERE e.estado = $1`;
      const params = [estado];

      if (carrera_id) {
        whereClause += ` AND c.id = ${params.length + 1}`;
        params.push(parseInt(carrera_id));
      }

      if (facultad_id) {
        whereClause += ` AND f.id = ${params.length + 1}`;
        params.push(parseInt(facultad_id));
      }

      const query = `
      SELECT 
        e.carnet,
        e.nombres,
        e.apellidos,
        e.email,
        e.telefono,
        e.fecha_nacimiento,
        e.direccion,
        e.estado,
        e.promedio_general,
        e.creditos_aprobados,
        e.fecha_ingreso,
        c.nombre as carrera,
        c.codigo as codigo_carrera,
        f.nombre as facultad,
        ic.semestre_actual,
        m.nombre as municipio,
        d.nombre as departamento,
        p.nombre as pais
      FROM estudiantes e
      LEFT JOIN inscripciones_carrera ic ON e.id = ic.estudiante_id AND ic.activa = true
      LEFT JOIN carreras c ON ic.carrera_id = c.id
      LEFT JOIN facultades f ON c.facultad_id = f.id
      LEFT JOIN municipios m ON e.municipio_id = m.id
      LEFT JOIN departamentos d ON m.departamento_id = d.id
      LEFT JOIN paises p ON d.pais_id = p.id
      ${whereClause}
      ORDER BY e.carnet
    `;

      const estudiantes = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
        bind: params,
      });

      if (formato === "csv") {
        const csvHeader =
          "Carnet,Nombres,Apellidos,Email,Teléfono,Fecha Nacimiento,Dirección,Estado,Promedio,Créditos,Fecha Ingreso,Carrera,Código Carrera,Facultad,Semestre,Municipio,Departamento,País\n";
        const csvContent = estudiantes
          .map(
            (e) =>
              `"${e.carnet}","${e.nombres}","${e.apellidos}","${e.email}","${
                e.telefono || ""
              }","${e.fecha_nacimiento}","${e.direccion || ""}","${e.estado}",${
                e.promedio_general
              },${e.creditos_aprobados},"${e.fecha_ingreso}","${
                e.carrera || ""
              }","${e.codigo_carrera || ""}","${e.facultad || ""}",${
                e.semestre_actual || ""
              },"${e.municipio || ""}","${e.departamento || ""}","${
                e.pais || ""
              }"`
          )
          .join("\n");

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="estudiantes_${estado}_${
            new Date().toISOString().split("T")[0]
          }.csv"`
        );
        res.send(csvHeader + csvContent);
      } else {
        res.json({
          success: true,
          data: {
            estudiantes,
            metadatos: {
              total_registros: estudiantes.length,
              filtros_aplicados: { estado, carrera_id, facultad_id },
              fecha_exportacion: new Date().toISOString(),
            },
          },
          message: `Exportación completada: ${estudiantes.length} estudiantes`,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
        message: "Error al exportar datos de estudiantes",
      });
    }
  })
);

module.exports = router;
