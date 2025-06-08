-- ====================================
-- SISTEMA DE GESTIÓN UNIVERSITARIA
-- Proyecto 4 - Base de Datos
-- ====================================

-- Eliminar base de datos si existe y crearla nuevamente
DROP DATABASE IF EXISTS universidad_sistema;
CREATE DATABASE universidad_sistema;
\c universidad_sistema;

-- ====================================
-- TIPOS DE DATOS PERSONALIZADOS
-- ====================================

-- Tipo para estado de estudiante
CREATE TYPE estado_estudiante AS ENUM ('activo', 'inactivo', 'graduado', 'suspendido', 'retirado');

-- Tipo para modalidad de curso
CREATE TYPE modalidad_curso AS ENUM ('presencial', 'virtual', 'hibrido');

-- Tipo para tipo de evaluación
CREATE TYPE tipo_evaluacion AS ENUM ('parcial', 'final', 'tarea', 'proyecto', 'quiz', 'laboratorio');

-- ====================================
-- CREACIÓN DE TABLAS
-- ====================================

-- 1. Tabla de Países
CREATE TABLE paises (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    codigo_iso CHAR(2) NOT NULL UNIQUE,
    codigo_telefono VARCHAR(5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Departamentos/Estados
CREATE TABLE departamentos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    pais_id INTEGER NOT NULL REFERENCES paises(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(nombre, pais_id)
);

-- 3. Tabla de Municipios/Ciudades
CREATE TABLE municipios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    departamento_id INTEGER NOT NULL REFERENCES departamentos(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(nombre, departamento_id)
);

-- 4. Tabla de Facultades
CREATE TABLE facultades (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL UNIQUE,
    codigo VARCHAR(10) NOT NULL UNIQUE,
    descripcion TEXT,
    fecha_fundacion DATE,
    activa BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabla de Carreras
CREATE TABLE carreras (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    codigo VARCHAR(15) NOT NULL UNIQUE,
    facultad_id INTEGER NOT NULL REFERENCES facultades(id) ON DELETE CASCADE,
    duracion_semestres INTEGER NOT NULL CHECK (duracion_semestres > 0),
    creditos_totales INTEGER NOT NULL CHECK (creditos_totales > 0),
    activa BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(nombre, facultad_id)
);

-- 6. Tabla de Materias/Cursos
CREATE TABLE materias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    codigo VARCHAR(15) NOT NULL UNIQUE,
    creditos INTEGER NOT NULL CHECK (creditos > 0),
    horas_teoricas INTEGER DEFAULT 0 CHECK (horas_teoricas >= 0),
    horas_practicas INTEGER DEFAULT 0 CHECK (horas_practicas >= 0),
    prerequisitos TEXT,
    descripcion TEXT,
    activa BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Tabla de Pensum (relación carrera-materia con semestre)
CREATE TABLE pensum (
    id SERIAL PRIMARY KEY,
    carrera_id INTEGER NOT NULL REFERENCES carreras(id) ON DELETE CASCADE,
    materia_id INTEGER NOT NULL REFERENCES materias(id) ON DELETE CASCADE,
    semestre INTEGER NOT NULL CHECK (semestre > 0),
    obligatoria BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(carrera_id, materia_id)
);

-- 8. Tabla de Estudiantes
CREATE TABLE estudiantes (
    id SERIAL PRIMARY KEY,
    carnet VARCHAR(20) NOT NULL UNIQUE,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    fecha_nacimiento DATE NOT NULL,
    dpi VARCHAR(20) UNIQUE,
    direccion TEXT,
    municipio_id INTEGER REFERENCES municipios(id),
    estado estado_estudiante DEFAULT 'activo',
    fecha_ingreso DATE NOT NULL DEFAULT CURRENT_DATE,
    promedio_general DECIMAL(4,2) DEFAULT 0.00 CHECK (promedio_general >= 0 AND promedio_general <= 100),
    creditos_aprobados INTEGER DEFAULT 0 CHECK (creditos_aprobados >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Tabla de Inscripciones de Carrera
CREATE TABLE inscripciones_carrera (
    id SERIAL PRIMARY KEY,
    estudiante_id INTEGER NOT NULL REFERENCES estudiantes(id) ON DELETE CASCADE,
    carrera_id INTEGER NOT NULL REFERENCES carreras(id) ON DELETE CASCADE,
    fecha_inscripcion DATE NOT NULL DEFAULT CURRENT_DATE,
    semestre_actual INTEGER DEFAULT 1 CHECK (semestre_actual > 0),
    activa BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(estudiante_id, carrera_id)
);

-- 10. Tabla de Profesores
CREATE TABLE profesores (
    id SERIAL PRIMARY KEY,
    codigo_empleado VARCHAR(20) NOT NULL UNIQUE,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    fecha_nacimiento DATE,
    dpi VARCHAR(20) UNIQUE,
    direccion TEXT,
    municipio_id INTEGER REFERENCES municipios(id),
    especialidad VARCHAR(200),
    grado_academico VARCHAR(100),
    fecha_contratacion DATE NOT NULL DEFAULT CURRENT_DATE,
    salario DECIMAL(10,2) CHECK (salario > 0),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Tabla de Secciones (instancias de materias por ciclo)
CREATE TABLE secciones (
    id SERIAL PRIMARY KEY,
    materia_id INTEGER NOT NULL REFERENCES materias(id) ON DELETE CASCADE,
    profesor_id INTEGER NOT NULL REFERENCES profesores(id) ON DELETE CASCADE,
    codigo_seccion VARCHAR(10) NOT NULL,
    ciclo VARCHAR(10) NOT NULL, -- Ej: "2025-1"
    cupo_maximo INTEGER NOT NULL CHECK (cupo_maximo > 0),
    inscritos INTEGER DEFAULT 0 CHECK (inscritos >= 0),
    modalidad modalidad_curso DEFAULT 'presencial',
    horario TEXT,
    aula VARCHAR(20),
    fecha_inicio DATE,
    fecha_fin DATE,
    activa BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(materia_id, codigo_seccion, ciclo)
);

-- 12. Tabla de Inscripciones (estudiante-sección) - N:M
CREATE TABLE inscripciones (
    id SERIAL PRIMARY KEY,
    estudiante_id INTEGER NOT NULL REFERENCES estudiantes(id) ON DELETE CASCADE,
    seccion_id INTEGER NOT NULL REFERENCES secciones(id) ON DELETE CASCADE,
    fecha_inscripcion DATE NOT NULL DEFAULT CURRENT_DATE,
    nota_final DECIMAL(5,2) CHECK (nota_final >= 0 AND nota_final <= 100),
    estado VARCHAR(20) DEFAULT 'inscrito' CHECK (estado IN ('inscrito', 'aprobado', 'reprobado', 'retirado')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(estudiante_id, seccion_id)
);

-- 13. Tabla de Evaluaciones
CREATE TABLE evaluaciones (
    id SERIAL PRIMARY KEY,
    seccion_id INTEGER NOT NULL REFERENCES secciones(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    tipo tipo_evaluacion NOT NULL,
    ponderacion DECIMAL(5,2) NOT NULL CHECK (ponderacion > 0 AND ponderacion <= 100),
    fecha_evaluacion DATE,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. Tabla de Notas (estudiante-evaluación) - N:M
CREATE TABLE notas (
    id SERIAL PRIMARY KEY,
    inscripcion_id INTEGER NOT NULL REFERENCES inscripciones(id) ON DELETE CASCADE,
    evaluacion_id INTEGER NOT NULL REFERENCES evaluaciones(id) ON DELETE CASCADE,
    nota DECIMAL(5,2) CHECK (nota >= 0 AND nota <= 100),
    fecha_calificacion DATE DEFAULT CURRENT_DATE,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(inscripcion_id, evaluacion_id)
);

-- 15. Tabla de Edificios
CREATE TABLE edificios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    codigo VARCHAR(10) NOT NULL UNIQUE,
    direccion TEXT,
    niveles INTEGER DEFAULT 1 CHECK (niveles > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 16. Tabla de Aulas
CREATE TABLE aulas (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    edificio_id INTEGER NOT NULL REFERENCES edificios(id) ON DELETE CASCADE,
    capacidad INTEGER NOT NULL CHECK (capacidad > 0),
    tipo VARCHAR(50) DEFAULT 'aula_normal',
    equipamiento TEXT,
    activa BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 17. Tabla de Departamentos Académicos
CREATE TABLE departamentos_academicos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL UNIQUE,
    facultad_id INTEGER NOT NULL REFERENCES facultades(id) ON DELETE CASCADE,
    jefe_departamento_id INTEGER REFERENCES profesores(id),
    presupuesto DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 18. Tabla de Asignaciones Profesor-Departamento - N:M
CREATE TABLE profesor_departamento (
    id SERIAL PRIMARY KEY,
    profesor_id INTEGER NOT NULL REFERENCES profesores(id) ON DELETE CASCADE,
    departamento_id INTEGER NOT NULL REFERENCES departamentos_academicos(id) ON DELETE CASCADE,
    fecha_asignacion DATE NOT NULL DEFAULT CURRENT_DATE,
    activa BOOLEAN DEFAULT true,
    porcentaje_tiempo DECIMAL(5,2) DEFAULT 100.00 CHECK (porcentaje_tiempo > 0 AND porcentaje_tiempo <= 100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(profesor_id, departamento_id)
);

-- 19. Tabla de Becas
CREATE TABLE becas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    monto DECIMAL(10,2) CHECK (monto > 0),
    porcentaje_cobertura DECIMAL(5,2) CHECK (porcentaje_cobertura > 0 AND porcentaje_cobertura <= 100),
    requisitos TEXT,
    vigente BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 20. Tabla de Estudiantes con Becas - N:M
CREATE TABLE estudiante_becas (
    id SERIAL PRIMARY KEY,
    estudiante_id INTEGER NOT NULL REFERENCES estudiantes(id) ON DELETE CASCADE,
    beca_id INTEGER NOT NULL REFERENCES becas(id) ON DELETE CASCADE,
    fecha_otorgamiento DATE NOT NULL DEFAULT CURRENT_DATE,
    fecha_vencimiento DATE,
    monto_otorgado DECIMAL(10,2) CHECK (monto_otorgado > 0),
    activa BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(estudiante_id, beca_id, fecha_otorgamiento)
);

-- ====================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ====================================

CREATE INDEX idx_estudiantes_carnet ON estudiantes(carnet);
CREATE INDEX idx_estudiantes_email ON estudiantes(email);
CREATE INDEX idx_estudiantes_estado ON estudiantes(estado);
CREATE INDEX idx_profesores_codigo ON profesores(codigo_empleado);
CREATE INDEX idx_profesores_email ON profesores(email);
CREATE INDEX idx_inscripciones_estudiante ON inscripciones(estudiante_id);
CREATE INDEX idx_inscripciones_seccion ON inscripciones(seccion_id);
CREATE INDEX idx_notas_inscripcion ON notas(inscripcion_id);
CREATE INDEX idx_secciones_ciclo ON secciones(ciclo);
CREATE INDEX idx_secciones_materia ON secciones(materia_id);

-- ====================================
-- FUNCIONES SQL DEFINIDAS POR EL USUARIO
-- ====================================

-- Función 1: Calcular promedio de estudiante
CREATE OR REPLACE FUNCTION calcular_promedio_estudiante(p_estudiante_id INTEGER)
RETURNS DECIMAL(5,2) AS $$
DECLARE
    promedio DECIMAL(5,2);
BEGIN
    SELECT COALESCE(AVG(i.nota_final), 0.00)
    INTO promedio
    FROM inscripciones i
    WHERE i.estudiante_id = p_estudiante_id 
    AND i.nota_final IS NOT NULL
    AND i.estado = 'aprobado';
    
    RETURN promedio;
END;
$$ LANGUAGE plpgsql;

-- Función 2: Obtener créditos aprobados por estudiante
CREATE OR REPLACE FUNCTION obtener_creditos_aprobados(p_estudiante_id INTEGER)
RETURNS INTEGER AS $$
DECLARE
    creditos_total INTEGER;
BEGIN
    SELECT COALESCE(SUM(m.creditos), 0)
    INTO creditos_total
    FROM inscripciones i
    INNER JOIN secciones s ON i.seccion_id = s.id
    INNER JOIN materias m ON s.materia_id = m.id
    WHERE i.estudiante_id = p_estudiante_id 
    AND i.estado = 'aprobado';
    
    RETURN creditos_total;
END;
$$ LANGUAGE plpgsql;

-- Función 3: Verificar disponibilidad de cupo en sección
CREATE OR REPLACE FUNCTION verificar_cupo_seccion(p_seccion_id INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    cupo_maximo INTEGER;
    inscritos_actual INTEGER;
BEGIN
    SELECT s.cupo_maximo, COUNT(i.id)
    INTO cupo_maximo, inscritos_actual
    FROM secciones s
    LEFT JOIN inscripciones i ON s.id = i.seccion_id AND i.estado != 'retirado'
    WHERE s.id = p_seccion_id
    GROUP BY s.cupo_maximo;
    
    RETURN (inscritos_actual < cupo_maximo);
END;
$$ LANGUAGE plpgsql;

-- ====================================
-- TRIGGERS
-- ====================================

-- Trigger 1: Actualizar contador de inscritos en sección
CREATE OR REPLACE FUNCTION actualizar_inscritos_seccion()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE secciones 
        SET inscritos = inscritos + 1 
        WHERE id = NEW.seccion_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE secciones 
        SET inscritos = inscritos - 1 
        WHERE id = OLD.seccion_id;
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.seccion_id != NEW.seccion_id OR OLD.estado != NEW.estado THEN
            -- Si cambió de sección o estado, recalcular ambas secciones
            UPDATE secciones 
            SET inscritos = (
                SELECT COUNT(*) 
                FROM inscripciones 
                WHERE seccion_id = secciones.id AND estado != 'retirado'
            ) 
            WHERE id IN (OLD.seccion_id, NEW.seccion_id);
        END IF;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_inscritos
AFTER INSERT OR UPDATE OR DELETE ON inscripciones
FOR EACH ROW EXECUTE FUNCTION actualizar_inscritos_seccion();

-- Trigger 2: Actualizar promedio y créditos del estudiante
CREATE OR REPLACE FUNCTION actualizar_datos_estudiante()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP IN ('INSERT', 'UPDATE') THEN
        UPDATE estudiantes 
        SET 
            promedio_general = calcular_promedio_estudiante(NEW.estudiante_id),
            creditos_aprobados = obtener_creditos_aprobados(NEW.estudiante_id),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.estudiante_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE estudiantes 
        SET 
            promedio_general = calcular_promedio_estudiante(OLD.estudiante_id),
            creditos_aprobados = obtener_creditos_aprobados(OLD.estudiante_id),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = OLD.estudiante_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_datos_estudiante
AFTER INSERT OR UPDATE OR DELETE ON inscripciones
FOR EACH ROW EXECUTE FUNCTION actualizar_datos_estudiante();

-- Trigger 3: Validar cupo antes de inscripción
CREATE OR REPLACE FUNCTION validar_cupo_inscripcion()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT verificar_cupo_seccion(NEW.seccion_id) THEN
        RAISE EXCEPTION 'No hay cupo disponible en esta sección';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validar_cupo
BEFORE INSERT ON inscripciones
FOR EACH ROW EXECUTE FUNCTION validar_cupo_inscripcion();

-- ====================================
-- VISTAS SQL
-- ====================================

-- Vista 1: Información completa de estudiantes con carrera
CREATE VIEW vista_estudiantes_completa AS
SELECT 
    e.id,
    e.carnet,
    e.nombres || ' ' || e.apellidos AS nombre_completo,
    e.email,
    e.telefono,
    e.estado,
    e.promedio_general,
    e.creditos_aprobados,
    c.nombre AS carrera,
    f.nombre AS facultad,
    m.nombre AS municipio,
    d.nombre AS departamento,
    p.nombre AS pais
FROM estudiantes e
LEFT JOIN inscripciones_carrera ic ON e.id = ic.estudiante_id AND ic.activa = true
LEFT JOIN carreras c ON ic.carrera_id = c.id
LEFT JOIN facultades f ON c.facultad_id = f.id
LEFT JOIN municipios m ON e.municipio_id = m.id
LEFT JOIN departamentos d ON m.departamento_id = d.id
LEFT JOIN paises p ON d.pais_id = p.id;

-- Vista 2: Secciones con información detallada
CREATE VIEW vista_secciones_detalle AS
SELECT 
    s.id,
    m.codigo AS codigo_materia,
    m.nombre AS materia,
    s.codigo_seccion,
    s.ciclo,
    p.nombres || ' ' || p.apellidos AS profesor,
    s.cupo_maximo,
    s.inscritos,
    s.modalidad,
    s.horario,
    s.aula,
    f.nombre AS facultad,
    m.creditos
FROM secciones s
INNER JOIN materias m ON s.materia_id = m.id
INNER JOIN profesores p ON s.profesor_id = p.id
LEFT JOIN pensum pe ON m.id = pe.materia_id
LEFT JOIN carreras c ON pe.carrera_id = c.id
LEFT JOIN facultades f ON c.facultad_id = f.id
WHERE s.activa = true;

-- Vista 3: Reporte de notas por estudiante
CREATE VIEW vista_notas_estudiante AS
SELECT 
    e.carnet,
    e.nombres || ' ' || e.apellidos AS estudiante,
    m.codigo AS codigo_materia,
    m.nombre AS materia,
    s.ciclo,
    i.nota_final,
    i.estado,
    m.creditos,
    CASE 
        WHEN i.nota_final >= 61 THEN 'Aprobado'
        WHEN i.nota_final < 61 AND i.nota_final IS NOT NULL THEN 'Reprobado'
        ELSE 'Sin Calificar'
    END AS resultado
FROM estudiantes e
INNER JOIN inscripciones i ON e.id = i.estudiante_id
INNER JOIN secciones s ON i.seccion_id = s.id
INNER JOIN materias m ON s.materia_id = m.id
ORDER BY e.carnet, s.ciclo, m.nombre;

-- ====================================
-- FUNCIONES DE ACTUALIZACIÓN DE TIMESTAMPS
-- ====================================
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger de timestamp a todas las tablas principales
CREATE TRIGGER trigger_update_timestamp_estudiantes BEFORE UPDATE ON estudiantes FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trigger_update_timestamp_profesores BEFORE UPDATE ON profesores FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trigger_update_timestamp_inscripciones BEFORE UPDATE ON inscripciones FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trigger_update_timestamp_secciones BEFORE UPDATE ON secciones FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trigger_update_timestamp_materias BEFORE UPDATE ON materias FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trigger_update_timestamp_carreras BEFORE UPDATE ON carreras FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trigger_update_timestamp_facultades BEFORE UPDATE ON facultades FOR EACH ROW EXECUTE FUNCTION update_timestamp();