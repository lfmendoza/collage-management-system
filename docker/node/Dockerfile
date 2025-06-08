# Usar imagen oficial de Node.js LTS
FROM node:22-alpine3.20

# Actualizar paquetes del sistema para reducir vulnerabilidades
RUN apk update && apk upgrade --no-cache

# Información del mantenedor
LABEL maintainer="Universidad Sistema <admin@universidad.edu.gt>"
LABEL description="Sistema de Gestión Universitaria - Node.js API"

# Crear directorio de trabajo
WORKDIR /app

# Instalar herramientas necesarias
RUN apk add --no-cache \
    postgresql-client \
    bash \
    curl

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production && npm cache clean --force

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S universidad -u 1001

# Copiar código fuente
COPY . .

# Cambiar propietario de archivos
RUN chown -R universidad:nodejs /app

# Cambiar a usuario no-root
USER universidad

# Exponer puerto
EXPOSE 3000

# Comando de inicio
CMD ["npm", "start"]

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1