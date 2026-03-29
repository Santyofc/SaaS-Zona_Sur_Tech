#!/bin/bash

# ════════════════════════════════════════════════════════════
# ZS BACKUP ENGINE v1.0 — ZonaSur Tech
# Propósito: Respaldo automatizado de la base de datos PostgreSQL
# ════════════════════════════════════════════════════════════

BACKUP_DIR="/opt/vm-platform/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/db_backup_$TIMESTAMP.sql.gz"
CONTAINER_NAME="vm-platform-db-1"

# Buscar credenciales en el .env de la plataforma
ENV_FILE="/opt/vm-platform/.env"
if [ -f "$ENV_FILE" ]; then
    DB_USER=$(grep "^POSTGRES_USER=" "$ENV_FILE" | cut -d'=' -f2 | tr -d '"'\'' ')
else
    DB_USER="admin"
fi

DB_USER=${DB_USER:-admin}

# Asegurar que el directorio de backups existe
mkdir -p $BACKUP_DIR

echo "🚀 Iniciando respaldo de base de datos..."

# Ejecutar pg_dump dentro del contenedor y comprimir
docker exec $CONTAINER_NAME pg_dumpall -U $DB_USER | gzip > $BACKUP_FILE

if [ $? -eq 0 ]; then
    echo "✅ Respaldo completado con éxito: $BACKUP_FILE"
    
    # Rotación: Eliminar respaldos de más de 7 días
    find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +7 -delete
    echo "🧹 Rotación completada (7 días)."
else
    echo "❌ ERROR: Falló el respaldo de la base de datos."
    exit 1
fi
