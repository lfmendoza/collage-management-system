# Sistema de Gestión Universitaria

**Proyecto 4 - Base de Datos**  
**Universidad del Valle de Guatemala**  
**CC3088 - Bases de Datos 1, Ciclo 1 2025**

---

## 📋 Descripción

Sistema completo de gestión universitaria desarrollado con **PostgreSQL** y **Node.js/Express** usando **Sequelize ORM**. Incluye gestión de estudiantes, profesores, secciones, inscripciones, evaluaciones y reportería académica.

### 🎯 Características Principales

- ✅ **20+ tablas** normalizadas hasta 3FN
- ✅ **3 tipos de datos personalizados** (ENUM)
- ✅ **3 funciones SQL** definidas por usuario
- ✅ **3 triggers** automáticos para integridad
- ✅ **3 vistas SQL** para consultas complejas
- ✅ **2 CRUDs completos** con Sequelize ORM
- ✅ **1000+ registros** de prueba coherentes
- ✅ **API REST** completa con validaciones
- ✅ **Docker** ready para deployment

---

## 🚀 Inicio Rápido

### Opción 1: Con Docker (Recomendado)

```bash
# 1. Clonar el repositorio
git clone https://github.com/lfmendoza/collage-management-system
cd collage-management-system

# 2. Copiar archivo de configuración
cp .env.example .env

# 3. Iniciar con Docker
npm run docker:up

# 4. Verificar que esté funcionando
curl http://localhost:3000/health
```

**¡Listo!** La aplicación estará disponible en:

- **API**: http://localhost:3000
- **Adminer**: http://localhost:8080 (admin BD)
- **pgAdmin**: http://localhost:5050 (admin@universidad.edu.gt / admin123)

### Opción 2: Instalación Local

#### Prerequisitos

- **Node.js** 16+ y npm 8+
- **PostgreSQL** 12+
- **Git**

#### Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/lfmendoza/collage-management-system
cd collage-management-system

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con sus credenciales de PostgreSQL

# 4. Configurar base de datos
npm run setup

# 5. Cargar datos de prueba
npm run seed

# 6. Iniciar el servidor
npm run dev
```

---

## ⚙️ Configuración

### Variables de Entorno (.env)

```bash
# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=universidad_sistema
DB_USER=postgres
DB_PASSWORD=tu_password

# Servidor
PORT=3000
NODE_ENV=development
```

### Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Iniciar con nodemon
npm start           # Iniciar en producción

# Base de Datos
npm run setup       # Crear schema y estructura
npm run seed        # Cargar datos de prueba

# Docker
npm run docker:up    # Iniciar contenedores
npm run docker:down  # Detener contenedores
npm run docker:logs  # Ver logs

# Testing
npm test            # Ejecutar pruebas
```

---

## 🗃️ Estructura de la Base de Datos

### Diagrama E-R

```
PAÍSES (1:N) DEPARTAMENTOS (1:N) MUNICIPIOS
                                     ↓
FACULTADES (1:N) CARRERAS ← ESTUDIANTES → INSCRIPCIONES_CARRERA
     ↓                           ↓
DEPARTAMENTOS_ACADÉMICOS     INSCRIPCIONES (N:M)
     ↓                           ↓
PROFESORES → SECCIONES ← MATERIAS
                ↓
           EVALUACIONES → NOTAS
```

### Tablas Principales

| Tabla           | Descripción                | Registros |
| --------------- | -------------------------- | --------- |
| `estudiantes`   | Información de estudiantes | 100+      |
| `profesores`    | Cuerpo docente             | 35+       |
| `materias`      | Catálogo de materias       | 50+       |
| `secciones`     | Instancias por ciclo       | 65+       |
| `inscripciones` | Estudiante-sección (N:M)   | 200+      |
| `facultades`    | Facultades universitarias  | 10        |
| `carreras`      | Programas académicos       | 30        |

### Tipos de Datos Personalizados

```sql
-- Estados de estudiante
CREATE TYPE estado_estudiante AS ENUM
('activo', 'inactivo', 'graduado', 'suspendido', 'retirado');

-- Modalidades de curso
CREATE TYPE modalidad_curso AS ENUM
('presencial', 'virtual', 'hibrido');

-- Tipos de evaluación
CREATE TYPE tipo_evaluacion AS ENUM
('parcial', 'final', 'tarea', 'proyecto', 'quiz', 'laboratorio');
```

---

## 🔧 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Endpoints Principales

#### Estudiantes

```bash
# Listar estudiantes (con paginación y filtros)
GET /api/estudiantes?page=1&limit=10&estado=activo&nombre=juan

# Obtener estudiante específico
GET /api/estudiantes/1

# Crear nuevo estudiante
POST /api/estudiantes
Content-Type: application/json
{
  "carnet": "2025001",
  "nombres": "Juan Carlos",
  "apellidos": "García López",
  "email": "jgarcia2025001@universidad.edu.gt",
  "fechaNacimiento": "2005-03-15"
}

# Actualizar estudiante
PUT /api/estudiantes/1
Content-Type: application/json
{
  "telefono": "2234-5678",
  "direccion": "Zona 14, Guatemala"
}

# Eliminar estudiante
DELETE /api/estudiantes/1

# Inscribir en sección
POST /api/estudiantes/1/inscripciones
Content-Type: application/json
{
  "seccionId": 21
}
```

#### Secciones

```bash
# Listar secciones
GET /api/secciones?ciclo=2025-1&modalidad=presencial

# Obtener sección con estudiantes
GET /api/secciones/1

# Crear nueva sección
POST /api/secciones
Content-Type: application/json
{
  "materiaId": 1,
  "profesorId": 1,
  "codigoSeccion": "A",
  "ciclo": "2025-1",
  "cupoMaximo": 35,
  "modalidad": "presencial",
  "horario": "Lunes y Miércoles 7:00-9:00"
}
```

#### Reportes

```bash
# Estudiantes por facultad
GET /api/reportes/estudiantes-por-facultad

# Demanda de secciones
GET /api/reportes/secciones-demanda?ciclo=2025-1

# Rendimiento académico
GET /api/reportes/rendimiento-academico?carrera_id=1
```

### Ejemplo de Respuesta

```json
{
  "success": true,
  "data": {
    "estudiantes": [
      {
        "id": 1,
        "carnet": "2020001",
        "nombres": "José María",
        "apellidos": "González Pérez",
        "email": "jgonzalez2020001@universidad.edu.gt",
        "estado": "activo",
        "promedioGeneral": 88.5,
        "creditosAprobados": 120
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

---

## 🐳 Docker

### Servicios Incluidos

- **postgres**: Base de datos PostgreSQL 15
- **app**: Aplicación Node.js
- **adminer**: Administrador web de BD
- **pgadmin**: Administrador avanzado de PostgreSQL

### Comandos Docker

```bash
# Iniciar todos los servicios
docker-compose -f docker/docker-compose.yml up -d

# Ver logs en tiempo real
docker-compose -f docker/docker-compose.yml logs -f app

# Reiniciar solo la aplicación
docker-compose -f docker/docker-compose.yml restart app

# Ejecutar comandos en el contenedor
docker-compose -f docker/docker-compose.yml exec app npm run seed

# Detener todos los servicios
docker-compose -f docker/docker-compose.yml down

# Eliminar volúmenes (datos)
docker-compose -f docker/docker-compose.yml down -v
```

### Acceso a Servicios

| Servicio | URL                   | Credenciales                      |
| -------- | --------------------- | --------------------------------- |
| API      | http://localhost:3000 | -                                 |
| Adminer  | http://localhost:8080 | postgres/password123              |
| pgAdmin  | http://localhost:5050 | admin@universidad.edu.gt/admin123 |

---

## 🧪 Testing

### Ejecutar Pruebas

```bash
# Todas las pruebas
npm test

# Con coverage
npm test -- --coverage

# Pruebas específicas
npm test -- --testNamePattern="Estudiante"
```

### Estructura de Tests

```
tests/
├── estudiantes.test.js    # Tests CRUD estudiantes
├── secciones.test.js      # Tests CRUD secciones
└── database.test.js       # Tests de integridad BD
```

---

## 📊 Datos de Prueba

### Resumen de Datos Incluidos

- **10 países** con estructura geográfica completa
- **100 estudiantes** de diferentes cohortes (2020-2024)
- **35 profesores** con especialidades diversas
- **10 facultades** con 30 carreras
- **52 materias** con pensum estructurado
- **65+ secciones** en múltiples ciclos
- **200+ inscripciones** con notas variadas
- **15 becas** otorgadas a estudiantes destacados

### Datos Destacados

```sql
-- Estudiantes por estado
SELECT estado, COUNT(*) FROM estudiantes GROUP BY estado;
-- activo: 85, graduado: 10, otros: 5

-- Secciones por modalidad
SELECT modalidad, COUNT(*) FROM secciones GROUP BY modalidad;
-- presencial: 50, virtual: 10, hibrido: 5

-- Distribución de notas
SELECT
  CASE
    WHEN nota_final >= 90 THEN 'Excelente'
    WHEN nota_final >= 80 THEN 'Muy Bueno'
    WHEN nota_final >= 70 THEN 'Bueno'
    WHEN nota_final >= 61 THEN 'Satisfactorio'
    ELSE 'Necesita Mejorar'
  END as nivel,
  COUNT(*)
FROM inscripciones
WHERE nota_final IS NOT NULL
GROUP BY 1;
```

---

## 🔍 Funciones y Triggers

### Funciones SQL

1. **`calcular_promedio_estudiante(id)`**: Calcula promedio basado en materias aprobadas
2. **`obtener_creditos_aprobados(id)`**: Suma créditos de materias aprobadas
3. **`verificar_cupo_seccion(id)`**: Verifica disponibilidad de cupo

### Triggers Automáticos

1. **`trigger_actualizar_inscritos`**: Mantiene contador de inscritos por sección
2. **`trigger_actualizar_datos_estudiante`**: Recalcula promedio y créditos automáticamente
3. **`trigger_validar_cupo`**: Previene inscripciones sin cupo disponible

### Vistas SQL

1. **`vista_estudiantes_completa`**: Información completa con datos geográficos y académicos
2. **`vista_secciones_detalle`**: Secciones con información de materia y profesor
3. **`vista_notas_estudiante`**: Historial académico con cálculos de estado

---

## 🛠️ Desarrollo

### Estructura del Proyecto

```
collage-management-system/
├── 📦 package.json                 # Dependencias y scripts
├── 🔧 .env.example                # Variables de entorno
├── 📄 README.md                   # Documentación completa
├── 🚫 .gitignore                  # Archivos a ignorar
├── 🚀 server.js                   # Servidor principal
│
├── 🐳 docker/
│   ├── docker-compose.yml         # Orquestación Docker
│   ├── node/Dockerfile           # Imagen Node.js
│   └── postgres/init.sql         # Inicialización PostgreSQL
│
├── 🗃️ database/
│   ├── schema.sql                # Estructura completa (20 tablas)
│   └── data.sql                  # Datos de prueba (1000+ registros)
│
├── 💻 src/
│   ├── app.js                    # Configuración Express
│   ├── config/database.js       # Configuración BD
│   │
│   ├── models/                   # ✅ TODOS LOS MODELOS
│   │   ├── index.js             # Exporta y relaciona todos
│   │   ├── Estudiante.js        # Modelo estudiante completo
│   │   ├── Profesor.js          # Modelo profesor completo
│   │   ├── Materia.js           # Modelo materia completo
│   │   ├── Seccion.js           # Modelo sección completo
│   │   ├── Inscripcion.js       # Modelo inscripción completo
│   │   ├── Facultad.js          # Modelo facultad completo
│   │   ├── Carrera.js           # Modelo carrera completo
│   │   ├── Evaluacion.js        # Modelo evaluación completo
│   │   ├── Nota.js              # Modelo nota completo
│   │   ├── Pais.js              # Modelo país
│   │   ├── Departamento.js      # Modelo departamento
│   │   └── Municipio.js         # Modelo municipio
│   │
│   ├── services/                 # Servicios de negocio
│   │   ├── EstudianteService.js # CRUD estudiantes completo
│   │   └── SeccionService.js    # CRUD secciones completo
│   │
│   ├── routes/                   # Rutas de la API
│   │   ├── index.js             # Rutas principales
│   │   ├── estudiantes.js       # Rutas estudiantes
│   │   ├── secciones.js         # Rutas secciones
│   │   └── reportes.js          # Rutas reportes
│   │
│   └── middleware/
│       └── errorHandler.js      # Manejo de errores
│
└── 🔨 scripts/
    ├── setup-db.sh             # Configurar BD
    ├── seed-db.sh              # Cargar datos
    └── start-dev.sh             # Inicio desarrollo
```

### Contribuir

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

---

## 📝 Solución de Problemas

### Errores Comunes

#### Error de Conexión a PostgreSQL

```bash
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solución:**

```bash
# Verificar que PostgreSQL esté ejecutándose
pg_isready -h localhost -p 5432

# Para Docker
docker-compose -f docker/docker-compose.yml up postgres -d

# Verificar configuración en .env
cat .env | grep DB_
```

#### Error de Autenticación

```bash
Error: password authentication failed for user "postgres"
```

**Solución:**

- Verificar credenciales en `.env`
- Resetear password de PostgreSQL
- Para Docker, usar las credenciales del compose

#### Tablas No Encontradas

```bash
Error: relation "estudiantes" does not exist
```

**Solución:**

```bash
# Ejecutar setup de BD
npm run setup

# Verificar que se crearon las tablas
npm run seed
```

#### Puerto Ya en Uso

```bash
Error: listen EADDRINUSE: address already in use :::3000
```

**Solución:**

```bash
# Cambiar puerto en .env
echo "PORT=3001" >> .env

# O matar proceso que usa el puerto
lsof -ti:3000 | xargs kill -9
```

### Logs y Debugging

```bash
# Ver logs de aplicación
npm run docker:logs

# Logs solo de BD
docker-compose -f docker/docker-compose.yml logs postgres

# Conectar a BD para debugging
docker-compose -f docker/docker-compose.yml exec postgres psql -U postgres -d universidad_sistema
```

---

## 📚 Recursos Adicionales

### Documentación Relacionada

- [Sequelize ORM Documentation](https://sequelize.org/docs/v6/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/)
- [Docker Compose Reference](https://docs.docker.com/compose/)

### Herramientas Recomendadas

- **IDE**: VSCode con extensiones PostgreSQL y Thunder Client
- **BD Client**: pgAdmin, DBeaver, o Adminer (incluido)
- **API Testing**: Postman, Insomnia, o Thunder Client
- **Monitoring**: pgAdmin para queries y performance

### Performance Tips

- Usar índices en campos de búsqueda frecuente
- Limitar resultados con paginación
- Usar vistas para queries complejas repetitivas
- Monitorer slow queries en desarrollo

---

## 👥 Equipo de Desarrollo

**Proyecto Académico**  
Universidad del Valle de Guatemala  
Facultad de Ingeniería  
CC3088 - Bases de Datos 1  
Ciclo 1, 2025

### Roles del Equipo (Ejemplo)

- **Arquitecto de Datos**: Diseño del modelo E-R y normalización
- **Especialista SQL**: Triggers, funciones y optimización
- **Desarrollador Backend**: API REST y servicios ORM
- **Analista de Datos**: Vistas SQL y reportería
- **DevOps/QA**: Docker, testing y documentación

---

## 📄 Licencia

Este proyecto es desarrollado con fines académicos para el curso de Bases de Datos 1 en la Universidad del Valle de Guatemala.

**Uso Educativo Únicamente**

---

## 🆘 Soporte

Para soporte técnico:

1. **Revisar esta documentación** completa
2. **Consultar logs** de error específicos
3. **Verificar configuración** de entorno
4. **Contactar al instructor** del curso

### Información de Sistema

```bash
# Verificar versiones
node --version
npm --version
psql --version

# Estado de la aplicación
curl http://localhost:3000/health

# Información de BD
curl http://localhost:3000/api/database-info
```
