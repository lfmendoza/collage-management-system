/**
 * Modelo Departamento
 * Sistema Universitario
 */

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Departamento = sequelize.define(
    "Departamento",
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
            msg: "El nombre del departamento no puede estar vacío",
          },
          len: {
            args: [3, 100],
            msg: "El nombre debe tener entre 3 y 100 caracteres",
          },
        },
      },
      pais_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "pais_id",
      },
    },
    {
      tableName: "departamentos",
      indexes: [
        {
          unique: true,
          fields: ["nombre", "pais_id"],
        },
        {
          fields: ["pais_id"],
        },
      ],
    }
  );

  return Departamento;
};
