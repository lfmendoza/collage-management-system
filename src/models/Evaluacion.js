/**
 * Modelo Evaluación
 * Sistema Universitario
 */

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Evaluacion = sequelize.define(
    "Evaluacion",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      seccion_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "seccion_id",
      },
      nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "El nombre de la evaluación no puede estar vacío",
          },
          len: {
            args: [3, 100],
            msg: "El nombre debe tener entre 3 y 100 caracteres",
          },
        },
      },
      tipo: {
        type: DataTypes.ENUM(
          "parcial",
          "final",
          "tarea",
          "proyecto",
          "quiz",
          "laboratorio"
        ),
        allowNull: false,
        validate: {
          isIn: {
            args: [
              ["parcial", "final", "tarea", "proyecto", "quiz", "laboratorio"],
            ],
            msg: "Tipo debe ser: parcial, final, tarea, proyecto, quiz o laboratorio",
          },
        },
      },
      ponderacion: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        validate: {
          min: {
            args: [0.01],
            msg: "La ponderación debe ser mayor a 0",
          },
          max: {
            args: [100.0],
            msg: "La ponderación no puede exceder 100%",
          },
        },
      },
      fecha_evaluacion: {
        type: DataTypes.DATEONLY,
        field: "fecha_evaluacion",
        validate: {
          isDate: {
            msg: "Debe ser una fecha válida",
          },
        },
      },
      descripcion: {
        type: DataTypes.TEXT,
        validate: {
          len: {
            args: [0, 1000],
            msg: "La descripción no puede exceder 1000 caracteres",
          },
        },
      },
    },
    {
      tableName: "evaluaciones",
      indexes: [
        {
          fields: ["seccion_id"],
        },
        {
          fields: ["tipo"],
        },
        {
          fields: ["fecha_evaluacion"],
        },
      ],
      hooks: {
        beforeValidate: (evaluacion) => {
          if (evaluacion.nombre) {
            evaluacion.nombre = evaluacion.nombre.trim();
          }
        },
      },
    }
  );

  // Métodos de instancia
  Evaluacion.prototype.isParcial = function () {
    return this.tipo === "parcial";
  };

  Evaluacion.prototype.isFinal = function () {
    return this.tipo === "final";
  };

  Evaluacion.prototype.isPractica = function () {
    return ["tarea", "proyecto", "laboratorio"].includes(this.tipo);
  };

  Evaluacion.prototype.getPesoRelativo = function () {
    return `${this.ponderacion}%`;
  };

  // Métodos de clase
  Evaluacion.findBySeccion = function (seccionId, options = {}) {
    return this.findAll({
      where: { seccion_id: seccionId },
      order: [["fecha_evaluacion", "ASC"]],
      ...options,
    });
  };

  Evaluacion.findByTipo = function (tipo, options = {}) {
    return this.findAll({
      where: { tipo },
      ...options,
    });
  };

  return Evaluacion;
};
