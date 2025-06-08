/**
 * Modelo Carrera
 * Sistema Universitario
 */

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Carrera = sequelize.define(
    "Carrera",
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
            msg: "El nombre de la carrera no puede estar vacío",
          },
          len: {
            args: [5, 200],
            msg: "El nombre debe tener entre 5 y 200 caracteres",
          },
        },
      },
      codigo: {
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: "El código de la carrera no puede estar vacío",
          },
          len: {
            args: [3, 15],
            msg: "El código debe tener entre 3 y 15 caracteres",
          },
          isUppercase: {
            msg: "El código debe estar en mayúsculas",
          },
        },
      },
      facultad_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "facultad_id",
      },
      duracion_semestres: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "duracion_semestres",
        validate: {
          min: {
            args: [6],
            msg: "La duración mínima es de 6 semestres",
          },
          max: {
            args: [20],
            msg: "La duración máxima es de 20 semestres",
          },
        },
      },
      creditos_totales: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "creditos_totales",
        validate: {
          min: {
            args: [120],
            msg: "Los créditos mínimos son 120",
          },
          max: {
            args: [400],
            msg: "Los créditos máximos son 400",
          },
        },
      },
      activa: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "carreras",
      indexes: [
        {
          unique: true,
          fields: ["codigo"],
        },
        {
          unique: true,
          fields: ["nombre", "facultad_id"],
        },
        {
          fields: ["facultad_id"],
        },
        {
          fields: ["activa"],
        },
        {
          fields: ["duracion_semestres"],
        },
      ],
      validate: {
        creditosCoherentes() {
          // Validar que los créditos sean coherentes con la duración
          const creditosPorSemestre =
            this.creditos_totales / this.duracion_semestres;
          if (creditosPorSemestre < 12 || creditosPorSemestre > 25) {
            throw new Error(
              "Los créditos por semestre deben estar entre 12 y 25"
            );
          }
        },
      },
      hooks: {
        beforeValidate: (carrera) => {
          // Normalizar código a mayúsculas
          if (carrera.codigo) {
            carrera.codigo = carrera.codigo.trim().toUpperCase();
          }

          // Normalizar nombre
          if (carrera.nombre) {
            carrera.nombre = carrera.nombre.trim();
          }
        },
      },
    }
  );

  // Métodos de instancia
  Carrera.prototype.isActiva = function () {
    return this.activa === true;
  };

  Carrera.prototype.getCreditosPorSemestre = function () {
    return Math.round(this.creditos_totales / this.duracion_semestres);
  };

  Carrera.prototype.getDuracionAnos = function () {
    return Math.ceil(this.duracion_semestres / 2);
  };

  Carrera.prototype.getCodigoCompleto = function () {
    return `${this.codigo} - ${this.nombre}`;
  };

  Carrera.prototype.getTipo = function () {
    if (this.duracion_semestres <= 8) return "Técnico";
    if (this.duracion_semestres <= 10) return "Licenciatura";
    if (this.duracion_semestres <= 12) return "Ingeniería";
    return "Especialización";
  };

  Carrera.prototype.getIntensidad = function () {
    const creditosPorSemestre = this.getCreditosPorSemestre();
    if (creditosPorSemestre <= 15) return "Baja";
    if (creditosPorSemestre <= 18) return "Media";
    if (creditosPorSemestre <= 22) return "Alta";
    return "Muy Alta";
  };

  // Métodos de clase
  Carrera.findByCodigo = function (codigo) {
    return this.findOne({
      where: {
        codigo: codigo.trim().toUpperCase(),
        activa: true,
      },
    });
  };

  Carrera.findActivas = function (options = {}) {
    return this.findAll({
      where: { activa: true },
      order: [["nombre", "ASC"]],
      ...options,
    });
  };

  Carrera.findByFacultad = function (facultadId, options = {}) {
    return this.findAll({
      where: {
        facultad_id: facultadId,
        activa: true,
      },
      order: [["nombre", "ASC"]],
      ...options,
    });
  };

  Carrera.findByNombre = function (nombre, options = {}) {
    return this.findAll({
      where: {
        nombre: { [sequelize.Op.iLike]: `%${nombre}%` },
        activa: true,
      },
      ...options,
    });
  };

  Carrera.findByDuracion = function (semestres, options = {}) {
    return this.findAll({
      where: {
        duracion_semestres: semestres,
        activa: true,
      },
      ...options,
    });
  };

  Carrera.findPorTipo = function (tipo, options = {}) {
    let whereClause = { activa: true };

    switch (tipo.toLowerCase()) {
      case "tecnico":
        whereClause.duracion_semestres = { [sequelize.Op.lte]: 8 };
        break;
      case "licenciatura":
        whereClause.duracion_semestres = { [sequelize.Op.between]: [9, 10] };
        break;
      case "ingenieria":
        whereClause.duracion_semestres = { [sequelize.Op.between]: [11, 12] };
        break;
      case "especializacion":
        whereClause.duracion_semestres = { [sequelize.Op.gt]: 12 };
        break;
    }

    return this.findAll({
      where: whereClause,
      ...options,
    });
  };

  Carrera.findConEstudiantes = function (options = {}) {
    return this.findAll({
      where: { activa: true },
      include: [
        {
          association: "estudiantes",
          through: {
            where: { activa: true },
          },
          required: false,
        },
      ],
      ...options,
    });
  };

  return Carrera;
};
