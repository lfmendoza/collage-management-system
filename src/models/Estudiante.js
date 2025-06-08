/**
 * Modelo Estudiante
 * Sistema Universitario
 */

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Estudiante = sequelize.define(
    "Estudiante",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      carnet: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: "El carnet no puede estar vacío",
          },
          len: {
            args: [5, 20],
            msg: "El carnet debe tener entre 5 y 20 caracteres",
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
        allowNull: false,
        field: "fecha_nacimiento",
        validate: {
          isDate: {
            msg: "Debe ser una fecha válida",
          },
          isBefore: {
            args: new Date().toISOString().split("T")[0],
            msg: "La fecha de nacimiento debe ser anterior a hoy",
          },
          isAdult(value) {
            const today = new Date();
            const birth = new Date(value);
            const age = today.getFullYear() - birth.getFullYear();
            if (age < 16 || age > 100) {
              throw new Error("La edad debe estar entre 16 y 100 años");
            }
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
      estado: {
        type: DataTypes.ENUM(
          "activo",
          "inactivo",
          "graduado",
          "suspendido",
          "retirado"
        ),
        defaultValue: "activo",
        validate: {
          isIn: {
            args: [
              ["activo", "inactivo", "graduado", "suspendido", "retirado"],
            ],
            msg: "Estado debe ser: activo, inactivo, graduado, suspendido o retirado",
          },
        },
      },
      fecha_ingreso: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "fecha_ingreso",
        validate: {
          isDate: {
            msg: "Debe ser una fecha válida",
          },
        },
      },
      promedio_general: {
        type: DataTypes.DECIMAL(4, 2),
        defaultValue: 0.0,
        field: "promedio_general",
        validate: {
          min: {
            args: [0],
            msg: "El promedio no puede ser negativo",
          },
          max: {
            args: [100],
            msg: "El promedio no puede ser mayor a 100",
          },
        },
      },
      creditos_aprobados: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: "creditos_aprobados",
        validate: {
          min: {
            args: [0],
            msg: "Los créditos no pueden ser negativos",
          },
        },
      },
    },
    {
      tableName: "estudiantes",
      indexes: [
        {
          unique: true,
          fields: ["carnet"],
        },
        {
          unique: true,
          fields: ["email"],
        },
        {
          fields: ["estado"],
        },
        {
          fields: ["promedio_general"],
        },
      ],
      hooks: {
        beforeValidate: (estudiante) => {
          // Normalizar email a minúsculas
          if (estudiante.email) {
            estudiante.email = estudiante.email.toLowerCase().trim();
          }

          // Normalizar nombres y apellidos
          if (estudiante.nombres) {
            estudiante.nombres = estudiante.nombres.trim();
          }
          if (estudiante.apellidos) {
            estudiante.apellidos = estudiante.apellidos.trim();
          }

          // Normalizar carnet
          if (estudiante.carnet) {
            estudiante.carnet = estudiante.carnet.trim().toUpperCase();
          }
        },
      },
    }
  );

  // Métodos de instancia
  Estudiante.prototype.getNombreCompleto = function () {
    return `${this.nombres} ${this.apellidos}`;
  };

  Estudiante.prototype.getEdad = function () {
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

  Estudiante.prototype.isActivo = function () {
    return this.estado === "activo";
  };

  // Métodos de clase
  Estudiante.findByCarnet = function (carnet) {
    return this.findOne({ where: { carnet: carnet.trim().toUpperCase() } });
  };

  Estudiante.findByEmail = function (email) {
    return this.findOne({ where: { email: email.toLowerCase().trim() } });
  };

  Estudiante.findActivos = function (options = {}) {
    return this.findAll({
      where: { estado: "activo" },
      ...options,
    });
  };

  return Estudiante;
};
