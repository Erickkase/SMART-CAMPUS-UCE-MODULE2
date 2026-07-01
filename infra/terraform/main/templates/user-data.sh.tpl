#!/bin/bash
set -euo pipefail

# ------------------------------------------------------------------------------
# User data para instancias EC2 del Auto Scaling Group SMART CAMPUS UCE
# ------------------------------------------------------------------------------

exec > >(tee /var/log/user-data.log) 2>&1

echo "[user-data] Iniciando configuracion de la instancia..."

# IP publica fija del NLB para el frontend
NLB_IP="${nlb_ip}"
echo "[user-data] NLB IP (Elastic IP): $NLB_IP"

# Instalar utilidades necesarias
echo "[user-data] Instalando dependencias..."
dnf update -y
dnf install -y docker git amazon-efs-utils nfs-utils

# Instalar Docker Compose plugin
echo "[user-data] Instalando Docker Compose plugin..."
mkdir -p /usr/local/lib/docker/cli-plugins
COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')
curl -SL "https://github.com/docker/compose/releases/download/$COMPOSE_VERSION/docker-compose-linux-x86_64" -o /usr/local/lib/docker/cli-plugins/docker-compose
chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

# Instalar Docker Buildx
echo "[user-data] Instalando Docker Buildx..."
BUILDX_VERSION=$(curl -s https://api.github.com/repos/docker/buildx/releases/latest | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')
curl -SL "https://github.com/docker/buildx/releases/download/$BUILDX_VERSION/buildx-$BUILDX_VERSION.linux-amd64" -o /usr/local/lib/docker/cli-plugins/docker-buildx
chmod +x /usr/local/lib/docker/cli-plugins/docker-buildx
docker buildx version
docker compose version

systemctl enable docker
systemctl start docker
usermod -aG docker ec2-user || true

# Montar EFS para persistencia de datos
echo "[user-data] Montando filesystem EFS..."
EFS_DNS="${efs_dns}"
mkdir -p /data
mount -t efs -o tls "$EFS_DNS:/" /data || mount -t nfs4 -o nfsvers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2 "$EFS_DNS:/" /data
mkdir -p /data/postgres /data/mongo /data/psychological-postgres /data/subject-postgres /data/enrollment-postgres /data/student-postgres /data/notification-postgres
echo "$EFS_DNS:/ /data efs _netdev,tls 0 0" >> /etc/fstab

# Crear directorio de despliegue
DEPLOY_DIR="/opt/${project_name}"
mkdir -p "$DEPLOY_DIR"
cd "$DEPLOY_DIR"

# Clonar o actualizar repositorio
echo "[user-data] Clonando repositorio ${github_repo_url} (rama: ${github_branch})..."
if [ -d "$DEPLOY_DIR/.git" ]; then
  git fetch origin
  git checkout ${github_branch}
  git pull origin ${github_branch}
else
  git clone -b ${github_branch} ${github_repo_url} .
fi

# Crear archivos .env.docker para cada microservicio
echo "[user-data] Creando archivos de configuracion .env.docker..."

cat > apps/scholarship-service/.env.docker <<EOF
NODE_ENV=production
PORT=3000
CORS_ORIGIN=*
AUTH_ENABLED=false
JWT_SECRET=change-me-in-production
JWT_ISSUER=smart-campus-uce
JWT_AUDIENCE=scholarship-service
DB_ENABLED=true
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=scholarship_db
DB_SYNCHRONIZE=true
DB_LOGGING=false
EOF

cat > apps/socioeconomic-form-service/.env.docker <<EOF
NODE_ENV=production
PORT=3001
CORS_ORIGIN=*
MONGO_ENABLED=true
MONGODB_URI=mongodb://mongo:27017/socioeconomic_forms
EOF

cat > apps/psychological-care-service/.env.docker <<EOF
NODE_ENV=production
PORT=3002
CORS_ORIGIN=*
AUTH_ENABLED=false
JWT_SECRET=change-me-in-production
JWT_ISSUER=smart-campus-uce
JWT_AUDIENCE=psychological-care-service
DB_ENABLED=true
DB_HOST=psychological-postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=psychological_care_db
DB_SYNCHRONIZE=true
DB_LOGGING=false
EOF

cat > apps/subject-service/.env.docker <<EOF
NODE_ENV=production
PORT=3004
CORS_ORIGIN=*
AUTH_ENABLED=false
JWT_SECRET=change-me-in-production
JWT_ISSUER=smart-campus-uce
JWT_AUDIENCE=subject-service
DB_ENABLED=true
DB_HOST=subject-postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=subject_db
DB_SYNCHRONIZE=true
DB_LOGGING=false
EOF

cat > apps/enrollment-service/.env.docker <<EOF
NODE_ENV=production
PORT=3005
CORS_ORIGIN=*
AUTH_ENABLED=false
JWT_SECRET=change-me-in-production
JWT_ISSUER=smart-campus-uce
JWT_AUDIENCE=enrollment-service
DB_ENABLED=true
DB_HOST=enrollment-postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=enrollment_db
DB_SYNCHRONIZE=true
DB_LOGGING=false
EOF

cat > apps/student-service/.env.docker <<EOF
NODE_ENV=production
PORT=3006
CORS_ORIGIN=*
AUTH_ENABLED=false
JWT_SECRET=change-me-in-production
JWT_ISSUER=smart-campus-uce
JWT_AUDIENCE=student-service
DB_ENABLED=true
DB_HOST=student-postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=student_db
DB_SYNCHRONIZE=true
DB_LOGGING=false
EOF

cat > apps/notification-service/.env.docker <<EOF
NODE_ENV=production
PORT=3007
CORS_ORIGIN=*
AUTH_ENABLED=false
JWT_SECRET=change-me-in-production
JWT_ISSUER=smart-campus-uce
JWT_AUDIENCE=notification-service
DB_ENABLED=true
DB_HOST=notification-postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=notification_db
DB_SYNCHRONIZE=true
DB_LOGGING=false
EOF

cat > apps/api-gateway/.env.docker <<EOF
PORT=8080
CORS_ORIGIN=*
SCHOLARSHIP_SERVICE_URL=http://scholarship-service:3000
SOCIOECONOMIC_SERVICE_URL=http://socioeconomic-form-service:3001
PSYCHOLOGICAL_SERVICE_URL=http://psychological-care-service:3002
SUBJECT_SERVICE_URL=http://subject-service:3004
ENROLLMENT_SERVICE_URL=http://enrollment-service:3005
STUDENT_SERVICE_URL=http://student-service:3006
NOTIFICATION_SERVICE_URL=http://notification-service:3007
AUTH_ENABLED=false
JWT_SECRET=change-me-in-production
EOF

cat > apps/welfare-frontend/.env.docker <<EOF
NEXT_PUBLIC_SCHOLARSHIP_API_URL=http://$NLB_IP:3000
NEXT_PUBLIC_SOCIOECONOMIC_API_URL=http://$NLB_IP:3001
NEXT_PUBLIC_PSYCHOLOGICAL_API_URL=http://$NLB_IP:3002
NEXT_PUBLIC_API_GATEWAY_URL=http://$NLB_IP:8080
EOF

# Override de docker-compose para produccion con la IP del NLB
cat > docker-compose.prod.yml <<EOF
services:
  welfare-frontend:
    build:
      args:
        NEXT_PUBLIC_SCHOLARSHIP_API_URL: http://$NLB_IP:3000
        NEXT_PUBLIC_SOCIOECONOMIC_API_URL: http://$NLB_IP:3001
        NEXT_PUBLIC_PSYCHOLOGICAL_API_URL: http://$NLB_IP:3002
        NEXT_PUBLIC_API_GATEWAY_URL: http://$NLB_IP:8080
EOF

# Construir e iniciar servicios
echo "[user-data] Construyendo e iniciando microservicios con Docker Compose..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml pull || true
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

echo "[user-data] Configuracion finalizada. Servicios disponibles en http://$NLB_IP"
