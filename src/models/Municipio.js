/**
 * Modelo Municipio
 * Sistema Universitario
 */

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Municipio = sequelize.define(
    "Municipio",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "El nombre del municipio no puede estar vacío",
          },
          len: {
            args: [2, 100],
            msg: "El nombre debe tener entre 2 y 100 caracteres",
          },
        },
      },
      departamento_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "departamento_id",
      },
    },
    {
      tableName: "municipios",
      indexes: [
        {
          unique: true,
          fields: ["nombre", "departamento_id"],
        },
        {
          fields: ["departamento_id"],
        },
      ],
    }
  );

  return Municipio;
};
