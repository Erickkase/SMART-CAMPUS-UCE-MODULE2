variable "project_name" {
  description = "Nombre del proyecto para etiquetar recursos"
  type        = string
}

variable "environment" {
  description = "Ambiente de despliegue"
  type        = string
}

variable "app_bucket_name" {
  description = "Nombre del bucket S3 para la aplicacion"
  type        = string
}
