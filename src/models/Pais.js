/**
 * Modelo País
 * Sistema Universitario
 */

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Pais = sequelize.define(
    "Pais",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: "El nombre del país no puede estar vacío",
          },
          len: {
            args: [3, 100],
            msg: "El nombre debe tener entre 3 y 100 caracteres",
          },
        },
      },
      codigo_iso: {
        type: DataTypes.CHAR(2),
        allowNull: false,
        unique: true,
        field: "codigo_iso",
        validate: {
          len: {
            args: [2, 2],
            msg: "El código ISO debe tener exactamente 2 caracteres",
          },
          isUppercase: {
            msg: "El código ISO debe estar en mayúsculas",
          },
        },
      },
      codigo_telefono: {
        type: DataTypes.STRING(5),
        field: "codigo_telefono",
        validate: {
          len: {
            args: [2, 5],
            msg: "El código telefónico debe tener entre 2 y 5 caracteres",
          },
        },
      },
    },
    {
      tableName: "paises",
      indexes: [
        {
          unique: true,
          fields: ["nombre"],
        },
        {
          unique: true,
          fields: ["codigo_iso"],
        },
      ],
      hooks: {
        beforeValidate: (pais) => {
          if (pais.codigo_iso) {
            pais.codigo_iso = pais.codigo_iso.trim().toUpperCase();
          }
          if (pais.nombre) {
            pais.nombre = pais.nombre.trim();
          }
        },
      },
    }
  );

  return Pais;
};
