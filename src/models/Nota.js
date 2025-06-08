/**
 * Modelo Nota
 * Sistema Universitario
 */

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Nota = sequelize.define(
    "Nota",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      inscripcion_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "inscripcion_id",
      },
      evaluacion_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "evaluacion_id",
      },
      nota: {
        type: DataTypes.DECIMAL(5, 2),
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
      fecha_calificacion: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
        field: "fecha_calificacion",
        validate: {
          isDate: {
            msg: "Debe ser una fecha válida",
          },
        },
      },
      observaciones: {
        type: DataTypes.TEXT,
        validate: {
          len: {
            args: [0, 500],
            msg: "Las observaciones no pueden exceder 500 caracteres",
          },
        },
      },
    },
    {
      tableName: "notas",
      indexes: [
        {
          unique: true,
          fields: ["inscripcion_id", "evaluacion_id"],
        },
        {
          fields: ["inscripcion_id"],
        },
        {
          fields: ["evaluacion_id"],
        },
        {
          fields: ["nota"],
        },
      ],
    }
  );

  // Métodos de instancia
  Nota.prototype.getLetra = function () {
    if (this.nota === null) return null;

    if (this.nota >= 90) return "A";
    if (this.nota >= 80) return "B";
    if (this.nota >= 70) return "C";
    if (this.nota >= 61) return "D";
    return "F";
  };

  Nota.prototype.getEstado = function () {
    if (this.nota === null) return "Sin Calificar";
    return this.nota >= 61 ? "Aprobado" : "Reprobado";
  };

  Nota.prototype.getNivel = function () {
    if (this.nota === null) return "Sin Calificar";

    if (this.nota >= 90) return "Excelente";
    if (this.nota >= 80) return "Muy Bueno";
    if (this.nota >= 70) return "Bueno";
    if (this.nota >= 61) return "Satisfactorio";
    return "Necesita Mejorar";
  };

  // Métodos de clase
  Nota.findByInscripcion = function (inscripcionId, options = {}) {
    return this.findAll({
      where: { inscripcion_id: inscripcionId },
      ...options,
    });
  };

  Nota.findByEvaluacion = function (evaluacionId, options = {}) {
    return this.findAll({
      where: { evaluacion_id: evaluacionId },
      ...options,
    });
  };

  return Nota;
};
