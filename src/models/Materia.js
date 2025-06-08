/**
 * Modelo Materia
 * Sistema Universitario
 */

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Materia = sequelize.define(
    "Materia",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "El nombre de la materia no puede estar vacío",
          },
          len: {
            args: [3, 200],
            msg: "El nombre debe tener entre 3 y 200 caracteres",
          },
        },
      },
      codigo: {
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: "El código de la materia no puede estar vacío",
          },
          len: {
            args: [3, 15],
            msg: "El código debe tener entre 3 y 15 caracteres",
          },
          is: {
            args: /^[A-Z]{2,4}[0-9]{2,4}$/,
            msg: "El código debe tener formato: 2-4 letras seguidas de 2-4 números (ej: MAT101)",
          },
        },
      },
      creditos: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: [1],
            msg: "Los créditos deben ser al menos 1",
          },
          max: {
            args: [10],
            msg: "Los créditos no pueden exceder 10",
          },
        },
      },
      horas_teoricas: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: "horas_teoricas",
        validate: {
          min: {
            args: [0],
            msg: "Las horas teóricas no pueden ser negativas",
          },
          max: {
            args: [8],
            msg: "Las horas teóricas no pueden exceder 8 por semana",
          },
        },
      },
      horas_practicas: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: "horas_practicas",
        validate: {
          min: {
            args: [0],
            msg: "Las horas prácticas no pueden ser negativas",
          },
          max: {
            args: [8],
            msg: "Las horas prácticas no pueden exceder 8 por semana",
          },
        },
      },
      prerequisitos: {
        type: DataTypes.TEXT,
        validate: {
          len: {
            args: [0, 1000],
            msg: "Los prerequisitos no pueden exceder 1000 caracteres",
          },
        },
      },
      descripcion: {
        type: DataTypes.TEXT,
        validate: {
          len: {
            args: [0, 2000],
            msg: "La descripción no puede exceder 2000 caracteres",
          },
        },
      },
      activa: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "materias",
      indexes: [
        {
          unique: true,
          fields: ["codigo"],
        },
        {
          fields: ["creditos"],
        },
        {
          fields: ["activa"],
        },
        {
          fields: ["nombre"],
        },
      ],
      validate: {
        horasValidas() {
          const totalHoras = this.horas_teoricas + this.horas_practicas;
          if (totalHoras === 0) {
            throw new Error(
              "La materia debe tener al menos horas teóricas o prácticas"
            );
          }
          if (totalHoras > 10) {
            throw new Error("El total de horas no puede exceder 10 por semana");
          }
        },
      },
      hooks: {
        beforeValidate: (materia) => {
          // Normalizar código a mayúsculas
          if (materia.codigo) {
            materia.codigo = materia.codigo.trim().toUpperCase();
          }

          // Normalizar nombre
          if (materia.nombre) {
            materia.nombre = materia.nombre.trim();
          }
        },
      },
    }
  );

  // Métodos de instancia
  Materia.prototype.getTotalHoras = function () {
    return this.horas_teoricas + this.horas_practicas;
  };

  Materia.prototype.isActiva = function () {
    return this.activa === true;
  };

  Materia.prototype.getTipoMateria = function () {
    if (this.horas_practicas === 0) return "Teórica";
    if (this.horas_teoricas === 0) return "Práctica";
    return "Teórico-Práctica";
  };

  Materia.prototype.getIntensidad = function () {
    const totalHoras = this.getTotalHoras();
    if (totalHoras <= 2) return "Baja";
    if (totalHoras <= 4) return "Media";
    if (totalHoras <= 6) return "Alta";
    return "Muy Alta";
  };

  // Métodos de clase
  Materia.findByCodigo = function (codigo) {
    return this.findOne({
      where: {
        codigo: codigo.trim().toUpperCase(),
        activa: true,
      },
    });
  };

  Materia.findActivas = function (options = {}) {
    return this.findAll({
      where: { activa: true },
      ...options,
    });
  };

  Materia.findByCreditos = function (creditos, options = {}) {
    return this.findAll({
      where: { creditos, activa: true },
      ...options,
    });
  };

  Materia.findByNombre = function (nombre, options = {}) {
    return this.findAll({
      where: {
        nombre: { [sequelize.Op.iLike]: `%${nombre}%` },
        activa: true,
      },
      ...options,
    });
  };

  Materia.findTeoricasOPracticas = function (tipo, options = {}) {
    let whereClause = { activa: true };

    if (tipo === "teorica") {
      whereClause.horas_practicas = 0;
    } else if (tipo === "practica") {
      whereClause.horas_teoricas = 0;
    }

    return this.findAll({
      where: whereClause,
      ...options,
    });
  };

  return Materia;
};
