#!/bin/bash

# ====================================
# Script de Configuración de Base de Datos
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
    echo -e "${GREEN}[SETUP]${NC} $1"
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

print_message "=== Configuración de Base de Datos ==="
print_info "Host: $DB_HOST"
print_info "Puerto: $DB_PORT"
print_info "Base de datos: $DB_NAME"
print_info "Usuario: $DB_USER"
echo ""

# Verificar que PostgreSQL esté disponible
print_message "Verificando conexión a PostgreSQL..."
if ! pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" > /dev/null 2>&1; then
    print_error "No se puede conectar a PostgreSQL en $DB_HOST:$DB_PORT"
    print_info "Asegúrese de que PostgreSQL esté ejecutándose y sea accesible"
    print_info "Para Docker: docker-compose up -d postgres"
    exit 1
fi

print_message "✅ PostgreSQL está disponible"

# Función para ejecutar SQL
execute_sql() {
    local sql_file=$1
    local description=$2
    
    if [ ! -f "$sql_file" ]; then
        print_error "Archivo no encontrado: $sql_file"
        return 1
    fi
    
    print_message "$description"
    if PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$sql_file" > /dev/null 2>&1; then
        print_message "✅ $description completado"
    else
        print_error "❌ Error ejecutando: $sql_file"
        return 1
    fi
}

# Crear base de datos si no existe
print_message "Verificando/creando base de datos..."
if PGPASSWORD="$DB_PASSWORD" createdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME" 2>/dev/null; then
    print_message "✅ Base de datos '$DB_NAME' creada"
else
    print_info "Base de datos '$DB_NAME' ya existe o error en creación"
fi

# Ejecutar scripts SQL
print_message "Ejecutando scripts de base de datos..."

# Schema
if [ -f "database/schema.sql" ]; then
    execute_sql "database/schema.sql" "Creando esquema de base de datos"
else
    print_error "Archivo schema.sql no encontrado en database/"
    exit 1
fi

# Verificar que el schema se creó correctamente
print_message "Verificando estructura de base de datos..."
TABLE_COUNT=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | tr -d ' ')

if [ "$TABLE_COUNT" -gt 15 ]; then
    print_message "✅ Esquema creado correctamente ($TABLE_COUNT tablas)"
else
    print_error "❌ Error: Se esperaban más de 15 tablas, se encontraron $TABLE_COUNT"
    exit 1
fi

# Verificar funciones y triggers
FUNCTION_COUNT=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public';" | tr -d ' ')
TRIGGER_COUNT=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM information_schema.triggers WHERE trigger_schema = 'public';" | tr -d ' ')

print_info "Funciones creadas: $FUNCTION_COUNT"
print_info "Triggers creados: $TRIGGER_COUNT"

# Verificar tipos personalizados
TYPE_COUNT=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM pg_type WHERE typname IN ('estado_estudiante', 'modalidad_curso', 'tipo_evaluacion');" | tr -d ' ')

if [ "$TYPE_COUNT" -eq 3 ]; then
    print_message "✅ Tipos personalizados creados correctamente"
else
    print_warning "⚠️  Se esperaban 3 tipos personalizados, se encontraron $TYPE_COUNT"
fi

# Verificar vistas
VIEW_COUNT=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM information_schema.views WHERE table_schema = 'public';" | tr -d ' ')

if [ "$VIEW_COUNT" -ge 3 ]; then
    print_message "✅ Vistas creadas correctamente ($VIEW_COUNT vistas)"
else
    print_warning "⚠️  Se esperaban al menos 3 vistas, se encontraron $VIEW_COUNT"
fi

print_message ""
print_message "=== Configuración Completada ==="
print_message "✅ Base de datos configurada exitosamente"
print_message "✅ $TABLE_COUNT tablas creadas"
print_message "✅ $FUNCTION_COUNT funciones creadas"
print_message "✅ $TRIGGER_COUNT triggers creados"
print_message "✅ $VIEW_COUNT vistas creadas"
print_message ""
print_info "Siguiente paso: npm run seed (para cargar datos de prueba)"
print_info "O ejecutar: bash scripts/seed-db.sh"
echo ""