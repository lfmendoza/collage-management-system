#!/bin/bash

# ====================================
# Script para Cargar Datos de Prueba
# Sistema Universitario - PostgreSQL
# ====================================

set -e  # Salir si cualquier comando falla

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_message() {
    echo -e "${GREEN}[SEED]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Cargar variables de entorno
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
    print_info "Variables de entorno cargadas desde .env"
else
    print_warning "Archivo .env no encontrado, usando valores por defecto"
fi

# Variables por defecto
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-universidad_sistema}
DB_USER=${DB_USER:-postgres}
DB_PASSWORD=${DB_PASSWORD:-password123}

print_message "=== Carga de Datos de Prueba ==="
print_info "Host: $DB_HOST"
print_info "Puerto: $DB_PORT"
print_info "Base de datos: $DB_NAME"
print_info "Usuario: $DB_USER"
echo ""

# Verificar que PostgreSQL esté disponible
print_message "Verificando conexión a PostgreSQL..."
if ! pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" > /dev/null 2>&1; then
    print_error "No se puede conectar a PostgreSQL en $DB_HOST:$DB_PORT"
    print_info "Asegúrese de que PostgreSQL esté ejecutándose"
    exit 1
fi

print_message "✅ PostgreSQL está disponible"

# Verificar que la base de datos existe
print_message "Verificando que la base de datos existe..."
if ! PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "\q" > /dev/null 2>&1; then
    print_error "No se puede conectar a la base de datos '$DB_NAME'"
    print_info "Ejecute primero: npm run setup"
    exit 1
fi

# Verificar que las tablas existen
print_message "Verificando estructura de base de datos..."
TABLE_COUNT=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | tr -d ' ')

if [ "$TABLE_COUNT" -lt 15 ]; then
    print_error "La base de datos no tiene la estructura correcta ($TABLE_COUNT tablas)"
    print_info "Ejecute primero: npm run setup"
    exit 1
fi

print_message "✅ Estructura de base de datos verificada ($TABLE_COUNT tablas)"

# Verificar si ya hay datos
print_message "Verificando datos existentes..."
STUDENT_COUNT=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM estudiantes;" | tr -d ' ')

if [ "$STUDENT_COUNT" -gt 0 ]; then
    print_warning "La base de datos ya contiene $STUDENT_COUNT estudiantes"
    read -p "¿Desea continuar y sobrescribir los datos? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Operación cancelada por el usuario"
        exit 0
    fi
    
    print_message "Limpiando datos existentes..."
    PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
        TRUNCATE TABLE notas CASCADE;
        TRUNCATE TABLE evaluaciones CASCADE;
        TRUNCATE TABLE inscripciones CASCADE;
        TRUNCATE TABLE estudiante_becas CASCADE;
        TRUNCATE TABLE becas CASCADE;
        TRUNCATE TABLE secciones CASCADE;
        TRUNCATE TABLE profesor_departamento CASCADE;
        TRUNCATE TABLE profesores CASCADE;
        TRUNCATE TABLE inscripciones_carrera CASCADE;
        TRUNCATE TABLE estudiantes CASCADE;
        TRUNCATE TABLE pensum CASCADE;
        TRUNCATE TABLE materias CASCADE;
        TRUNCATE TABLE carreras CASCADE;
        TRUNCATE TABLE departamentos_academicos CASCADE;
        TRUNCATE TABLE facultades CASCADE;
        TRUNCATE TABLE aulas CASCADE;
        TRUNCATE TABLE edificios CASCADE;
        TRUNCATE TABLE municipios CASCADE;
        TRUNCATE TABLE departamentos CASCADE;
        TRUNCATE TABLE paises CASCADE;
    " > /dev/null 2>&1
    print_message "✅ Datos existentes eliminados"
fi

# Cargar datos de prueba
if [ ! -f "database/data.sql" ]; then
    print_error "Archivo data.sql no encontrado en database/"
    exit 1
fi

print_message "Cargando datos de prueba..."
print_info "Este proceso puede tomar algunos minutos..."

if PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "database/data.sql" > /dev/null 2>&1; then
    print_message "✅ Datos de prueba cargados exitosamente"
else
    print_error "❌ Error cargando datos de prueba"
    exit 1
fi

# Verificar datos cargados
print_message "Verificando datos cargados..."

# Obtener estadísticas de cada tabla principal
STATS=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "
SELECT 
    (SELECT COUNT(*) FROM paises) as paises,
    (SELECT COUNT(*) FROM departamentos) as departamentos,
    (SELECT COUNT(*) FROM municipios) as municipios,
    (SELECT COUNT(*) FROM facultades) as facultades,
    (SELECT COUNT(*) FROM carreras) as carreras,
    (SELECT COUNT(*) FROM materias) as materias,
    (SELECT COUNT(*) FROM estudiantes) as estudiantes,
    (SELECT COUNT(*) FROM profesores) as profesores,
    (SELECT COUNT(*) FROM secciones) as secciones,
    (SELECT COUNT(*) FROM inscripciones) as inscripciones;
" | tr -d ' ')

# Convertir resultado en array
IFS='|' read -ra COUNTS <<< "$STATS"

PAISES=${COUNTS[0]}
DEPARTAMENTOS=${COUNTS[1]}
MUNICIPIOS=${COUNTS[2]}
FACULTADES=${COUNTS[3]}
CARRERAS=${COUNTS[4]}
MATERIAS=${COUNTS[5]}
ESTUDIANTES=${COUNTS[6]}
PROFESORES=${COUNTS[7]}
SECCIONES=${COUNTS[8]}
INSCRIPCIONES=${COUNTS[9]}

# Calcular total de registros
TOTAL=$((PAISES + DEPARTAMENTOS + MUNICIPIOS + FACULTADES + CARRERAS + MATERIAS + ESTUDIANTES + PROFESORES + SECCIONES + INSCRIPCIONES))

print_message ""
print_message "=== Estadísticas de Datos Cargados ==="
print_info "Países: $PAISES"
print_info "Departamentos: $DEPARTAMENTOS"
print_info "Municipios: $MUNICIPIOS"
print_info "Facultades: $FACULTADES"
print_info "Carreras: $CARRERAS"
print_info "Materias: $MATERIAS"
print_info "Estudiantes: $ESTUDIANTES"
print_info "Profesores: $PROFESORES"
print_info "Secciones: $SECCIONES"
print_info "Inscripciones: $INSCRIPCIONES"
print_message "TOTAL: $TOTAL registros cargados"

# Verificar que cumple con los requisitos
if [ "$TOTAL" -ge 1000 ]; then
    print_message "✅ Requisito cumplido: +1000 registros ($TOTAL)"
else
    print_warning "⚠️  Se cargaron $TOTAL registros (se requieren +1000)"
fi

if [ "$ESTUDIANTES" -ge 50 ]; then
    print_message "✅ Estudiantes suficientes: $ESTUDIANTES"
else
    print_warning "⚠️  Solo $ESTUDIANTES estudiantes cargados"
fi

# Verificar triggers funcionando
print_message "Verificando triggers..."
PROMEDIO_TEST=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM estudiantes WHERE promedio_general > 0;" | tr -d ' ')

if [ "$PROMEDIO_TEST" -gt 0 ]; then
    print_message "✅ Triggers funcionando correctamente"
else
    print_warning "⚠️  Los triggers podrían no estar funcionando"
fi

# Verificar vistas
print_message "Verificando vistas..."
VIEW_TEST=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM vista_estudiantes_completa;" | tr -d ' ')

if [ "$VIEW_TEST" -eq "$ESTUDIANTES" ]; then
    print_message "✅ Vistas funcionando correctamente"
else
    print_warning "⚠️  Las vistas podrían tener problemas"
fi

print_message ""
print_message "=== Carga de Datos Completada ==="
print_message "✅ Base de datos lista para usar"
print_message "✅ $TOTAL registros cargados exitosamente"
print_message ""
print_info "Siguiente paso: npm start (para iniciar el servidor)"
print_info "O para desarrollo: npm run dev"
print_info "Para Docker: npm run docker:up"
echo ""

# Mostrar algunos datos de ejemplo
print_info "=== Datos de Ejemplo ==="
print_info "Algunos estudiantes cargados:"
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
SELECT carnet, nombres, apellidos, estado 
FROM estudiantes 
LIMIT 5;
" 2>/dev/null || print_warning "No se pudieron mostrar datos de ejemplo"

echo ""