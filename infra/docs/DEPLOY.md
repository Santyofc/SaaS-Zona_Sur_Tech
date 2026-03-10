# Guía de Despliegue (DEPLOY)

Esta guía detalla los pasos exactos para preparar una VM limpia (Ubuntu 22.04/24.04) y realizar el primer despliegue.

## Requisitos
- 1 VM limpia de Ubuntu 22.04/24.04 (Ej: EC2 de AWS).
- Acceso SSH (root o sudoer) a la VM.

## Configuración DNS
El dominio zonasurtech.online debe tener un registro apuntando a tu IP Pública actual (`3.137.182.156`):

- **Tipo:** `A Record`
- **Host:** `@`
- **Value:** `3.137.182.156`

*(Opcional)*
- **Tipo:** `A Record`
- **Host:** `www`
- **Value:** `3.137.182.156`

## 1. Inicialización de la VM
Corre el script de inicialización para instalar Nginx, Docker, y Certbot:
```bash
# Sube el archivo install-vps.sh o clona el repo manualmente en tu home y luego ejecuta:
bash /ruta/al/repo/infra/scripts/install-vps.sh
```

## 2. Clonado del Repositorio y Entorno
El script anterior crea tu directorio en `/opt/vm-platform`:
```bash
# Clonar aquí (usando llave de deploy o token si es privado)
git clone https://github.com/Santyofc/vm-platform.git /opt/vm-platform

# Moverse al directorio
cd /opt/vm-platform

# Copiar el ejemplo del env y editarlo
cp infra/env/.env.production.example .env
nano .env # (Asegúrate de llenar las URLs de base de datos, Redis, etc.)
```

## 3. Configuración de Nginx
Copia la configuración de Nginx y actívala:
```bash
sudo cp infra/nginx/vm-platform.conf /etc/nginx/sites-available/vm-platform.conf
sudo ln -s /etc/nginx/sites-available/vm-platform.conf /etc/nginx/sites-enabled/

# Validar que está correcto
sudo nginx -t

# Recargar Nginx
sudo systemctl reload nginx
```

## 4. Configuración de Systemd
Instala el servicio systemd para manejar tu docker compose:
```bash
sudo cp infra/systemd/vm-platform.service /etc/systemd/system/vm-platform.service
sudo systemctl daemon-reload
# Activar para el boot pero aún no lo iniciamos:
sudo systemctl enable vm-platform.service
```

## 5. Correr el Deployment Inicial
```bash
cd /opt/vm-platform
bash infra/scripts/deploy.sh
```

El script de deploy validará salud y preparará el primer snapshot.

```bash
# Iniciar servicio para que el systemd tome "conciencia" del run en detached:
sudo systemctl start vm-platform.service
```

## 6. SSL / Certbot (Opcional pero Recomendado)
Obtén certificados SSL para tus dominios configurados en Nginx:
```bash
sudo certbot --nginx -d zonasurtech.online -d www.zonasurtech.online
```

## 7. Activar Integración Continua (Github Actions)

El archivo `infra/ci/github-actions-deploy.yml` **es una plantilla**. No correrá ahí.
Para activarlo en Github:
```bash
# Desde tu entorno de desarrollo local o interfaz de Github
mkdir -p .github/workflows/
cp infra/ci/github-actions-deploy.yml .github/workflows/deploy.yml
```

Luego configura los secretos `VPS_HOST`, `VPS_USER`, `VPS_PORT` y `VPS_SSH_KEY` en tu repo.
