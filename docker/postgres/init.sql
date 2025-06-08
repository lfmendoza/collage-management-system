-- ====================================
-- SCRIPT DE INICIALIZACIÓN POSTGRESQL
-- Sistema Universitario
-- ====================================

-- Crear extensiones útiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- Configurar timezone
SET timezone = 'America/Guatemala';

-- Configurar codificación
SET client_encoding = 'UTF8';

-- Mensaje de inicio
DO $$
BEGIN
    RAISE NOTICE 'Inicializando base de datos del Sistema Universitario...';
    RAISE NOTICE 'Timezone configurado: %', current_setting('timezone');
    RAISE NOTICE 'Encoding configurado: %', current_setting('client_encoding');
END $$;