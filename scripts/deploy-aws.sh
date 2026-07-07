#!/bin/bash
set -euo pipefail

# ------------------------------------------------------------------------------
# Helper script to trigger the GitHub Actions "Deploy to AWS" workflow
# using temporary AWS Academy credentials from ~/.aws/credentials or a
# custom credentials file.
#
# Usage:
#   ./scripts/deploy-aws.sh qa
#   ./scripts/deploy-aws.sh main
#   AWS_CREDS_FILE=/path/to/aws-token.txt ./scripts/deploy-aws.sh qa
# ------------------------------------------------------------------------------

ENVIRONMENT="${1:-}"
AWS_CREDS_FILE="${AWS_CREDS_FILE:-/home/estefan/distriWeb/aws-token.txt}"
AWS_REGION="${AWS_REGION:-us-west-2}"
REPO="${REPO:-Erickkase/SMART-CAMPUS-UCE-MODULE2}"

if [ -z "$ENVIRONMENT" ]; then
  echo "Error: environment argument is required."
  echo "Usage: $0 <qa|main>"
  exit 1
fi

if [ "$ENVIRONMENT" != "qa" ] && [ "$ENVIRONMENT" != "main" ]; then
  echo "Error: environment must be 'qa' or 'main'."
  exit 1
fi

if [ ! -f "$AWS_CREDS_FILE" ]; then
  echo "Error: AWS credentials file not found: $AWS_CREDS_FILE"
  echo "Set AWS_CREDS_FILE to point to your aws-token.txt file."
  exit 1
fi

echo "Reading AWS credentials from $AWS_CREDS_FILE..."
AWS_ACCESS_KEY_ID=$(awk -F '=' '/^aws_access_key_id/{print $2}' "$AWS_CREDS_FILE" | xargs)
AWS_SECRET_ACCESS_KEY=$(awk -F '=' '/^aws_secret_access_key/{print $2}' "$AWS_CREDS_FILE" | xargs)
AWS_SESSION_TOKEN=$(awk -F '=' '/^aws_session_token/{print $2}' "$AWS_CREDS_FILE" | xargs)

if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ] || [ -z "$AWS_SESSION_TOKEN" ]; then
  echo "Error: could not parse AWS credentials from $AWS_CREDS_FILE"
  echo "Expected format:"
  echo "  aws_access_key_id=..."
  echo "  aws_secret_access_key=..."
  echo "  aws_session_token=..."
  exit 1
fi

echo "Triggering GitHub Actions workflow for environment: $ENVIRONMENT (ref: $ENVIRONMENT)"
gh workflow run deploy-aws-qa.yml \
  --repo "$REPO" \
  --ref "$ENVIRONMENT" \
  -f environment="$ENVIRONMENT" \
  -f aws_access_key_id="$AWS_ACCESS_KEY_ID" \
  -f aws_secret_access_key="$AWS_SECRET_ACCESS_KEY" \
  -f aws_session_token="$AWS_SESSION_TOKEN" \
  -f aws_region="$AWS_REGION"

echo "Workflow triggered. Monitor progress at:"
echo "  https://github.com/$REPO/actions/workflows/deploy-aws-qa.yml"
