#!/bin/bash

# ====================================
# Script de Inicio para Desarrollo
# Sistema Universitario
# ====================================

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_message() {
    echo -e "${GREEN}[DEV]${NC} $1"
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

print_message "=== Iniciando Entorno de Desarrollo ==="

# Verificar que existe .env
if [ ! -f .env ]; then
    print_warning "Archivo .env no encontrado"
    if [ -f .env.example ]; then
        print_message "Copiando .env.example a .env..."
        cp .env.example .env
        print_warning "Por favor, edita el archivo .env con tus credenciales antes de continuar"
        exit 1
    else
        print_error "No se encontró .env.example. Crea un archivo .env manualmente"
        exit 1
    fi
fi

# Cargar variables de entorno
export $(cat .env | grep -v '^#' | xargs)

# Verificar dependencias
print_message "Verificando dependencias..."

if ! command -v node &> /dev/null; then
    print_error "Node.js no está instalado"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    print_error "npm no está instalado"
    exit 1
fi

print_info "Node.js version: $(node --version)"
print_info "npm version: $(npm --version)"

# Instalar dependencias si no existen
if [ ! -d "node_modules" ]; then
    print_message "Instalando dependencias..."
    npm install
fi

# Verificar PostgreSQL
print_message "Verificando PostgreSQL..."
if ! pg_isready -h "${DB_HOST:-localhost}" -p "${DB_PORT:-5432}" -U "${DB_USER:-postgres}" > /dev/null 2>&1; then
    print_warning "PostgreSQL no está disponible en ${DB_HOST:-localhost}:${DB_PORT:-5432}"
    print_info "Opciones:"
    print_info "1. Iniciar PostgreSQL localmente"
    print_info "2. Usar Docker: npm run docker:up"
    print_info "3. Verificar configuración en .env"
    
    read -p "¿Quieres intentar con Docker? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_message "Iniciando servicios con Docker..."
        npm run docker:up
        sleep 10
    else
        print_error "PostgreSQL es requerido para continuar"
        exit 1
    fi
fi

# Verificar base de datos
print_message "Verificando base de datos..."
if ! PGPASSWORD="${DB_PASSWORD}" psql -h "${DB_HOST:-localhost}" -p "${DB_PORT:-5432}" -U "${DB_USER:-postgres}" -d "${DB_NAME:-universidad_sistema}" -c "\q" > /dev/null 2>&1; then
    print_warning "Base de datos no encontrada o no configurada"
    read -p "¿Quieres configurar la base de datos ahora? (Y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Nn]$ ]]; then
        print_message "Configurando base de datos..."
        bash scripts/setup-db.sh
        
        print_message "Cargando datos de prueba..."
        bash scripts/seed-db.sh
    else
        print_warning "La aplicación podría no funcionar sin la base de datos configurada"
    fi
fi

# Verificar estructura de directorios
print_message "Verificando estructura del proyecto..."
REQUIRED_DIRS=("src" "src/models" "src/services" "src/routes" "src/middleware" "database")
for dir in "${REQUIRED_DIRS[@]}"; do
    if [ ! -d "$dir" ]; then
        print_error "Directorio requerido no encontrado: $dir"
        exit 1
    fi
done

# Verificar archivos principales
REQUIRED_FILES=("server.js" "src/app.js" "database/schema.sql" "database/data.sql")
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        print_error "Archivo requerido no encontrado: $file"
        exit 1
    fi
done

print_message "✅ Verificaciones completadas"

# Mostrar información del entorno
print_message ""
print_message "=== Información del Entorno ==="
print_info "Base de datos: ${DB_HOST:-localhost}:${DB_PORT:-5432}/${DB_NAME:-universidad_sistema}"
print_info "Usuario BD: ${DB_USER:-postgres}"
print_info "Puerto aplicación: ${PORT:-3000}"
print_info "Modo: ${NODE_ENV:-development}"

# Mostrar comandos útiles
print_message ""
print_message "=== Comandos Útiles ==="
print_info "npm run dev        - Iniciar servidor con nodemon"
print_info "npm start          - Iniciar servidor en producción"
print_info "npm run setup      - Configurar base de datos"
print_info "npm run seed       - Cargar datos de prueba"
print_info "npm run docker:up  - Iniciar con Docker"
print_info "npm test           - Ejecutar pruebas"

# Preguntar si quiere iniciar el servidor
print_message ""
read -p "¿Quieres iniciar el servidor de desarrollo ahora? (Y/n): " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Nn]$ ]]; then
    print_message "Iniciando servidor de desarrollo..."
    print_info "Servidor estará disponible en: http://localhost:${PORT:-3000}"
    print_info "Para detener el servidor: Ctrl+C"
    print_message ""
    
    # Iniciar servidor con nodemon
    npm run dev
else
    print_message "Entorno listo. Ejecuta 'npm run dev' cuando quieras iniciar el servidor"
fi