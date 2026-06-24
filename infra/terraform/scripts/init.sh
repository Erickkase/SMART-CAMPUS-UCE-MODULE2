#!/bin/bash
# ------------------------------------------------------------------------------
# init.sh - Inicializa Terraform con el backend remoto S3.
# Debe ejecutarse DESPUES de bootstrap.sh.
# ------------------------------------------------------------------------------

set -euo pipefail

ENVIRONMENT="${1:-qa}"
AWS_REGION="${2:-us-east-1}"
BUCKET_NAME="${3:-smart-campus-uce-module2-tfstate-832682702884}"
DYNAMODB_TABLE="${4:-smart-campus-uce-terraform-lock}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MAIN_DIR="$SCRIPT_DIR/../main"

echo "============================================"
echo "Inicializando backend S3 para ambiente: $ENVIRONMENT"
echo "Bucket: $BUCKET_NAME"
echo "DynamoDB table: $DYNAMODB_TABLE"
echo "============================================"

cd "$MAIN_DIR"

terraform init \
  -backend-config="bucket=$BUCKET_NAME" \
  -backend-config="key=$ENVIRONMENT/terraform.tfstate" \
  -backend-config="region=$AWS_REGION" \
  -backend-config="encrypt=true" \
  -backend-config="dynamodb_table=$DYNAMODB_TABLE"

echo ""
echo "Terraform inicializado con backend S3."
