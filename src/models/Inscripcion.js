/**
 * Modelo Inscripción
 * Sistema Universitario
 */

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Inscripcion = sequelize.define(
    "Inscripcion",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      estudiante_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "estudiante_id",
      },
      seccion_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "seccion_id",
      },
      fecha_inscripcion: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "fecha_inscripcion",
        validate: {
          isDate: {
            msg: "Debe ser una fecha válida",
          },
          notFuture(value) {
            if (new Date(value) > new Date()) {
              throw new Error("La fecha de inscripción no puede ser futura");
            }
          },
        },
      },
      nota_final: {
        type: DataTypes.DECIMAL(5, 2),
        field: "nota_final",
        validate: {
          min: {
            args: [0],
            msg: "La nota no puede ser negativa",
          },
          max: {
            args: [100],
            msg: "La nota no puede exceder 100",
          },
        },
      },
      estado: {
        type: DataTypes.STRING(20),
        defaultValue: "inscrito",
        validate: {
          isIn: {
            args: [["inscrito", "aprobado", "reprobado", "retirado"]],
            msg: "Estado debe ser: inscrito, aprobado, reprobado o retirado",
          },
        },
      },
    },
    {
      tableName: "inscripciones",
      indexes: [
        {
          unique: true,
          fields: ["estudiante_id", "seccion_id"],
        },
        {
          fields: ["estudiante_id"],
        },
        {
          fields: ["seccion_id"],
        },
        {
          fields: ["estado"],
        },
        {
          fields: ["fecha_inscripcion"],
        },
      ],
      validate: {
        notaCoherenteConEstado() {
          // Si tiene nota final, debe tener estado apropiado
          if (this.nota_final !== null && this.nota_final !== undefined) {
            if (this.estado === "inscrito") {
              throw new Error("No puede tener nota final si está inscrito");
            }

            // Validar coherencia entre nota y estado
            if (this.nota_final >= 61 && this.estado === "reprobado") {
              throw new Error(
                "Nota aprobatoria no puede tener estado reprobado"
              );
            }

            if (this.nota_final < 61 && this.estado === "aprobado") {
              throw new Error(
                "Nota reprobatoria no puede tener estado aprobado"
              );
            }
          }

          // Si está aprobado o reprobado, debe tener nota
          if (["aprobado", "reprobado"].includes(this.estado)) {
            if (this.nota_final === null || this.nota_final === undefined) {
              throw new Error("Estado finalizado requiere nota final");
            }
          }
        },
      },
      hooks: {
        beforeUpdate: (inscripcion) => {
          // Actualizar estado automáticamente basado en nota
          if (
            inscripcion.nota_final !== null &&
            inscripcion.nota_final !== undefined
          ) {
            if (inscripcion.estado === "inscrito") {
              inscripcion.estado =
                inscripcion.nota_final >= 61 ? "aprobado" : "reprobado";
            }
          }
        },
      },
    }
  );

  // Métodos de instancia
  Inscripcion.prototype.isAprobado = function () {
    return this.estado === "aprobado";
  };

  Inscripcion.prototype.isReprobado = function () {
    return this.estado === "reprobado";
  };

  Inscripcion.prototype.isActivo = function () {
    return this.estado === "inscrito";
  };

  Inscripcion.prototype.isFinalizado = function () {
    return ["aprobado", "reprobado", "retirado"].includes(this.estado);
  };

  Inscripcion.prototype.getResultado = function () {
    if (this.estado === "inscrito") return "En Curso";
    if (this.estado === "retirado") return "Retirado";
    if (this.nota_final === null) return "Sin Calificar";

    if (this.nota_final >= 90) return "Excelente";
    if (this.nota_final >= 80) return "Muy Bueno";
    if (this.nota_final >= 70) return "Bueno";
    if (this.nota_final >= 61) return "Satisfactorio";
    return "Necesita Mejorar";
  };

  Inscripcion.prototype.getLetraNota = function () {
    if (this.nota_final === null) return null;

    if (this.nota_final >= 90) return "A";
    if (this.nota_final >= 80) return "B";
    if (this.nota_final >= 70) return "C";
    if (this.nota_final >= 61) return "D";
    return "F";
  };

  // Métodos de clase
  Inscripcion.findByEstudiante = function (estudianteId, options = {}) {
    return this.findAll({
      where: { estudiante_id: estudianteId },
      ...options,
    });
  };

  Inscripcion.findBySeccion = function (seccionId, options = {}) {
    return this.findAll({
      where: { seccion_id: seccionId },
      ...options,
    });
  };

  Inscripcion.findByEstado = function (estado, options = {}) {
    return this.findAll({
      where: { estado },
      ...options,
    });
  };

  Inscripcion.findAprobadas = function (estudianteId, options = {}) {
    return this.findAll({
      where: {
        estudiante_id: estudianteId,
        estado: "aprobado",
      },
      ...options,
    });
  };

  Inscripcion.findActivas = function (estudianteId, options = {}) {
    return this.findAll({
      where: {
        estudiante_id: estudianteId,
        estado: "inscrito",
      },
      ...options,
    });
  };

  Inscripcion.findPorCiclo = function (ciclo, options = {}) {
    return this.findAll({
      include: [
        {
          association: "seccion",
          where: { ciclo },
          required: true,
        },
      ],
      ...options,
    });
  };

  return Inscripcion;
};
