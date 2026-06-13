#!/bin/bash
# ------------------------------------------------------------------------------
# bootstrap.sh - Crea el bucket S3 y la tabla DynamoDB para el estado remoto.
# Ejecutar UNA SOLA VEZ antes de usar el backend remoto.
# ------------------------------------------------------------------------------

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BOOTSTRAP_DIR="$SCRIPT_DIR/../bootstrap"

echo "============================================"
echo "Bootstrap del backend remoto de Terraform"
echo "============================================"

cd "$BOOTSTRAP_DIR"

echo "Inicializando Terraform bootstrap..."
terraform init

echo "Validando configuracion..."
terraform fmt -recursive
terraform validate

echo "Creando bucket S3 y tabla DynamoDB..."
terraform apply -auto-approve

echo ""
echo "Bootstrap completado. Guarda estos valores para configurar el backend:"
terraform output
