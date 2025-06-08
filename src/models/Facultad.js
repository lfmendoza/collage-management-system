/**
 * Modelo Facultad
 * Sistema Universitario
 */

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Facultad = sequelize.define(
    "Facultad",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: {
        type: DataTypes.STRING(200),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: "El nombre de la facultad no puede estar vacío",
          },
          len: {
            args: [5, 200],
            msg: "El nombre debe tener entre 5 y 200 caracteres",
          },
        },
      },
      codigo: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: "El código de la facultad no puede estar vacío",
          },
          len: {
            args: [2, 10],
            msg: "El código debe tener entre 2 y 10 caracteres",
          },
          isUppercase: {
            msg: "El código debe estar en mayúsculas",
          },
          is: {
            args: /^[A-Z]{2,10}$/,
            msg: "El código debe contener solo letras mayúsculas",
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
      fecha_fundacion: {
        type: DataTypes.DATEONLY,
        field: "fecha_fundacion",
        validate: {
          isDate: {
            msg: "Debe ser una fecha válida",
          },
          isBefore: {
            args: new Date().toISOString().split("T")[0],
            msg: "La fecha de fundación debe ser anterior a hoy",
          },
          isAfter: {
            args: "1900-01-01",
            msg: "La fecha de fundación debe ser posterior a 1900",
          },
        },
      },
      activa: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "facultades",
      indexes: [
        {
          unique: true,
          fields: ["nombre"],
        },
        {
          unique: true,
          fields: ["codigo"],
        },
        {
          fields: ["activa"],
        },
        {
          fields: ["fecha_fundacion"],
        },
      ],
      hooks: {
        beforeValidate: (facultad) => {
          // Normalizar código a mayúsculas
          if (facultad.codigo) {
            facultad.codigo = facultad.codigo.trim().toUpperCase();
          }

          // Normalizar nombre
          if (facultad.nombre) {
            facultad.nombre = facultad.nombre.trim();
          }
        },
      },
    }
  );

  // Métodos de instancia
  Facultad.prototype.isActiva = function () {
    return this.activa === true;
  };

  Facultad.prototype.getAntiguedad = function () {
    if (!this.fecha_fundacion) return null;
    const today = new Date();
    const fundacion = new Date(this.fecha_fundacion);
    return Math.floor((today - fundacion) / (365.25 * 24 * 60 * 60 * 1000));
  };

  Facultad.prototype.getCodigoCompleto = function () {
    return `${this.codigo} - ${this.nombre}`;
  };

  // Métodos de clase
  Facultad.findByCodigo = function (codigo) {
    return this.findOne({
      where: {
        codigo: codigo.trim().toUpperCase(),
        activa: true,
      },
    });
  };

  Facultad.findActivas = function (options = {}) {
    return this.findAll({
      where: { activa: true },
      order: [["nombre", "ASC"]],
      ...options,
    });
  };

  Facultad.findByNombre = function (nombre, options = {}) {
    return this.findAll({
      where: {
        nombre: { [sequelize.Op.iLike]: `%${nombre}%` },
        activa: true,
      },
      ...options,
    });
  };

  Facultad.findConCarreras = function (options = {}) {
    return this.findAll({
      where: { activa: true },
      include: [
        {
          association: "carreras",
          where: { activa: true },
          required: false,
        },
      ],
      ...options,
    });
  };

  Facultad.findMasAntiguas = function (limit = 5, options = {}) {
    return this.findAll({
      where: {
        activa: true,
        fecha_fundacion: { [sequelize.Op.not]: null },
      },
      order: [["fecha_fundacion", "ASC"]],
      limit,
      ...options,
    });
  };

  return Facultad;
};
