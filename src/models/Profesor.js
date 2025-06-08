/**
 * Modelo Profesor
 * Sistema Universitario
 */

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Profesor = sequelize.define(
    "Profesor",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      codigo_empleado: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        field: "codigo_empleado",
        validate: {
          notEmpty: {
            msg: "El código de empleado no puede estar vacío",
          },
          len: {
            args: [3, 20],
            msg: "El código debe tener entre 3 y 20 caracteres",
          },
        },
      },
      nombres: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Los nombres no pueden estar vacíos",
          },
          len: {
            args: [2, 100],
            msg: "Los nombres deben tener entre 2 y 100 caracteres",
          },
        },
      },
      apellidos: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Los apellidos no pueden estar vacíos",
          },
          len: {
            args: [2, 100],
            msg: "Los apellidos deben tener entre 2 y 100 caracteres",
          },
        },
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: "Debe ser un email válido",
          },
          notEmpty: {
            msg: "El email no puede estar vacío",
          },
        },
      },
      telefono: {
        type: DataTypes.STRING(20),
        validate: {
          len: {
            args: [8, 20],
            msg: "El teléfono debe tener entre 8 y 20 caracteres",
          },
        },
      },
      fecha_nacimiento: {
        type: DataTypes.DATEONLY,
        field: "fecha_nacimiento",
        validate: {
          isDate: {
            msg: "Debe ser una fecha válida",
          },
          isBefore: {
            args: new Date().toISOString().split("T")[0],
            msg: "La fecha de nacimiento debe ser anterior a hoy",
          },
        },
      },
      dpi: {
        type: DataTypes.STRING(20),
        unique: true,
        validate: {
          len: {
            args: [13, 20],
            msg: "El DPI debe tener entre 13 y 20 caracteres",
          },
        },
      },
      direccion: {
        type: DataTypes.TEXT,
      },
      municipio_id: {
        type: DataTypes.INTEGER,
        field: "municipio_id",
      },
      especialidad: {
        type: DataTypes.STRING(200),
        validate: {
          len: {
            args: [0, 200],
            msg: "La especialidad no puede exceder 200 caracteres",
          },
        },
      },
      grado_academico: {
        type: DataTypes.STRING(100),
        field: "grado_academico",
        validate: {
          len: {
            args: [0, 100],
            msg: "El grado académico no puede exceder 100 caracteres",
          },
        },
      },
      fecha_contratacion: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "fecha_contratacion",
        validate: {
          isDate: {
            msg: "Debe ser una fecha válida",
          },
        },
      },
      salario: {
        type: DataTypes.DECIMAL(10, 2),
        validate: {
          min: {
            args: [0],
            msg: "El salario no puede ser negativo",
          },
          max: {
            args: [999999.99],
            msg: "El salario excede el límite permitido",
          },
        },
      },
      activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "profesores",
      indexes: [
        {
          unique: true,
          fields: ["codigo_empleado"],
        },
        {
          unique: true,
          fields: ["email"],
        },
        {
          fields: ["activo"],
        },
        {
          fields: ["especialidad"],
        },
      ],
      hooks: {
        beforeValidate: (profesor) => {
          // Normalizar email a minúsculas
          if (profesor.email) {
            profesor.email = profesor.email.toLowerCase().trim();
          }

          // Normalizar nombres y apellidos
          if (profesor.nombres) {
            profesor.nombres = profesor.nombres.trim();
          }
          if (profesor.apellidos) {
            profesor.apellidos = profesor.apellidos.trim();
          }

          // Normalizar código de empleado
          if (profesor.codigo_empleado) {
            profesor.codigo_empleado = profesor.codigo_empleado
              .trim()
              .toUpperCase();
          }
        },
      },
    }
  );

  // Métodos de instancia
  Profesor.prototype.getNombreCompleto = function () {
    return `${this.nombres} ${this.apellidos}`;
  };

  Profesor.prototype.getEdad = function () {
    if (!this.fecha_nacimiento) return null;
    const today = new Date();
    const birth = new Date(this.fecha_nacimiento);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  Profesor.prototype.isActivo = function () {
    return this.activo === true;
  };

  Profesor.prototype.getAntiguedad = function () {
    if (!this.fecha_contratacion) return null;
    const today = new Date();
    const contratacion = new Date(this.fecha_contratacion);
    return Math.floor((today - contratacion) / (365.25 * 24 * 60 * 60 * 1000));
  };

  // Métodos de clase
  Profesor.findByCodigo = function (codigo) {
    return this.findOne({
      where: { codigo_empleado: codigo.trim().toUpperCase() },
    });
  };

  Profesor.findByEmail = function (email) {
    return this.findOne({ where: { email: email.toLowerCase().trim() } });
  };

  Profesor.findActivos = function (options = {}) {
    return this.findAll({
      where: { activo: true },
      ...options,
    });
  };

  Profesor.findByEspecialidad = function (especialidad, options = {}) {
    return this.findAll({
      where: {
        especialidad: { [sequelize.Op.iLike]: `%${especialidad}%` },
        activo: true,
      },
      ...options,
    });
  };

  return Profesor;
};
