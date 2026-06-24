variable "aws_region" {
  description = "Región de AWS donde se desplegarán los recursos"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Nombre del proyecto para etiquetar recursos"
  type        = string
  default     = "smart-campus-uce"
}

variable "state_bucket_name" {
  description = "Nombre único global del bucket S3 para guardar el estado de Terraform"
  type        = string
  default     = "smart-campus-uce-module2-tfstate-832682702884"
}

variable "dynamodb_lock_table" {
  description = "Nombre de la tabla DynamoDB para el bloqueo del estado de Terraform"
  type        = string
  default     = "smart-campus-uce-terraform-lock"
}
