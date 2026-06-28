#!/bin/bash
# ------------------------------------------------------------------------------
# deploy.sh - Automatiza plan, apply y destroy de la infraestructura principal.
# Uso: ./deploy.sh [plan|apply|destroy] [environment]
# ------------------------------------------------------------------------------

set -euo pipefail

ACTION="${1:-plan}"
ENVIRONMENT="${2:-qa}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MAIN_DIR="$SCRIPT_DIR/../main"

echo "============================================"
echo "Terraform action: $ACTION"
echo "Environment: $ENVIRONMENT"
echo "============================================"

cd "$MAIN_DIR"

# Crear o seleccionar workspace por ambiente
echo "Seleccionando workspace: $ENVIRONMENT"
terraform workspace select -or-create "$ENVIRONMENT"

echo "Formateando y validando..."
terraform fmt -recursive
terraform validate

case "$ACTION" in
  plan)
    echo "Creando plan de ejecucion..."
    terraform plan \
      -var-file="environments/$ENVIRONMENT.tfvars" \
      -out="tfplan-$ENVIRONMENT"
    echo "Plan guardado en: tfplan-$ENVIRONMENT"
    ;;
  apply)
    echo "Aplicando cambios..."
    terraform apply \
      -var-file="environments/$ENVIRONMENT.tfvars" \
      -auto-approve
    ;;
  destroy)
    echo "ADVERTENCIA: Esto destruira toda la infraestructura del ambiente $ENVIRONMENT"
    read -p "Escribe 'yes' para confirmar: " confirm
    if [ "$confirm" = "yes" ]; then
      terraform destroy \
        -var-file="environments/$ENVIRONMENT.tfvars" \
        -auto-approve
    else
      echo "Destruccion cancelada."
      exit 0
    fi
    ;;
  *)
    echo "Accion desconocida: $ACTION"
    echo "Uso: $0 [plan|apply|destroy] [environment]"
    exit 1
    ;;
esac

echo ""
echo "Terraform $ACTION completado para ambiente $ENVIRONMENT."
