/**
 * Modelo Sección
 * Sistema Universitario
 */

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Seccion = sequelize.define(
    "Seccion",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      materia_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "materia_id",
      },
      profesor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "profesor_id",
      },
      codigo_seccion: {
        type: DataTypes.STRING(10),
        allowNull: false,
        field: "codigo_seccion",
        validate: {
          notEmpty: {
            msg: "El código de sección no puede estar vacío",
          },
          len: {
            args: [1, 10],
            msg: "El código debe tener entre 1 y 10 caracteres",
          },
        },
      },
      ciclo: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "El ciclo no puede estar vacío",
          },
          is: {
            args: /^\d{4}-[12]$/,
            msg: "El ciclo debe tener formato YYYY-1 o YYYY-2",
          },
        },
      },
      cupo_maximo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "cupo_maximo",
        validate: {
          min: {
            args: [1],
            msg: "El cupo máximo debe ser al menos 1",
          },
          max: {
            args: [200],
            msg: "El cupo máximo no puede exceder 200 estudiantes",
          },
        },
      },
      inscritos: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: {
            args: [0],
            msg: "Los inscritos no pueden ser negativos",
          },
        },
      },
      modalidad: {
        type: DataTypes.ENUM("presencial", "virtual", "hibrido"),
        defaultValue: "presencial",
        validate: {
          isIn: {
            args: [["presencial", "virtual", "hibrido"]],
            msg: "Modalidad debe ser: presencial, virtual o hibrido",
          },
        },
      },
      horario: {
        type: DataTypes.TEXT,
        validate: {
          len: {
            args: [0, 500],
            msg: "El horario no puede exceder 500 caracteres",
          },
        },
      },
      aula: {
        type: DataTypes.STRING(20),
        validate: {
          len: {
            args: [0, 20],
            msg: "El aula no puede exceder 20 caracteres",
          },
        },
      },
      fecha_inicio: {
        type: DataTypes.DATEONLY,
        field: "fecha_inicio",
        validate: {
          isDate: {
            msg: "Debe ser una fecha válida",
          },
        },
      },
      fecha_fin: {
        type: DataTypes.DATEONLY,
        field: "fecha_fin",
        validate: {
          isDate: {
            msg: "Debe ser una fecha válida",
          },
          isAfterStart(value) {
            if (
              this.fecha_inicio &&
              value &&
              new Date(value) <= new Date(this.fecha_inicio)
            ) {
              throw new Error(
                "La fecha de fin debe ser posterior a la fecha de inicio"
              );
            }
          },
        },
      },
      activa: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "secciones",
      indexes: [
        {
          unique: true,
          fields: ["materia_id", "codigo_seccion", "ciclo"],
        },
        {
          fields: ["ciclo"],
        },
        {
          fields: ["modalidad"],
        },
        {
          fields: ["activa"],
        },
      ],
      validate: {
        inscritosNoPuedeExcederCupo() {
          if (this.inscritos > this.cupo_maximo) {
            throw new Error("Los inscritos no pueden exceder el cupo máximo");
          }
        },
      },
      hooks: {
        beforeValidate: (seccion) => {
          // Normalizar código de sección
          if (seccion.codigo_seccion) {
            seccion.codigo_seccion = seccion.codigo_seccion
              .trim()
              .toUpperCase();
          }

          // Normalizar aula
          if (seccion.aula) {
            seccion.aula = seccion.aula.trim().toUpperCase();
          }
        },
      },
    }
  );

  // Métodos de instancia
  Seccion.prototype.tieneCupo = function () {
    return this.inscritos < this.cupo_maximo;
  };

  Seccion.prototype.getCuposDisponibles = function () {
    return Math.max(0, this.cupo_maximo - this.inscritos);
  };

  Seccion.prototype.getPorcentajeOcupacion = function () {
    if (this.cupo_maximo === 0) return 0;
    return Math.round((this.inscritos / this.cupo_maximo) * 100);
  };

  Seccion.prototype.isActiva = function () {
    return this.activa === true;
  };

  Seccion.prototype.getCodigoCompleto = function () {
    return `${this.ciclo}-${this.codigo_seccion}`;
  };

  // Métodos de clase
  Seccion.findByCiclo = function (ciclo, options = {}) {
    return this.findAll({
      where: { ciclo, activa: true },
      ...options,
    });
  };

  Seccion.findByModalidad = function (modalidad, options = {}) {
    return this.findAll({
      where: { modalidad, activa: true },
      ...options,
    });
  };

  Seccion.findConCupo = function (options = {}) {
    return this.findAll({
      where: {
        activa: true,
        [sequelize.Op.and]: [
          sequelize.where(
            sequelize.col("inscritos"),
            sequelize.Op.lt,
            sequelize.col("cupo_maximo")
          ),
        ],
      },
      ...options,
    });
  };

  Seccion.findByProfesor = function (profesorId, options = {}) {
    return this.findAll({
      where: { profesor_id: profesorId, activa: true },
      ...options,
    });
  };

  Seccion.findByMateria = function (materiaId, options = {}) {
    return this.findAll({
      where: { materia_id: materiaId, activa: true },
      ...options,
    });
  };

  return Seccion;
};
