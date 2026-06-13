variable "aws_region" {
  description = "Región de AWS donde se desplegaran los recursos"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Nombre del proyecto para etiquetar recursos"
  type        = string
  default     = "smart-campus-uce"
}

variable "environment" {
  description = "Ambiente de despliegue (dev, qa, prod)"
  type        = string
  default     = "qa"

  validation {
    condition     = contains(["dev", "qa", "prod"], var.environment)
    error_message = "El ambiente debe ser dev, qa o prod."
  }
}

variable "vpc_cidr" {
  description = "CIDR block para la VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "Lista de CIDRs para subnets públicas"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "instance_type" {
  description = "Tipo de instancia EC2 para los microservicios"
  type        = string
  default     = "t3.micro"
}

variable "key_pair_name" {
  description = "Nombre del par de claves SSH para acceso a la instancia EC2"
  type        = string
  default     = ""
}

variable "allowed_cidr_blocks" {
  description = "CIDRs permitidos para acceso a los servicios"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "allowed_service_ports" {
  description = "Puertos expuestos por los microservicios"
  type        = list(number)
  default     = [3000, 3001, 3002, 3003]
}

variable "root_volume_size" {
  description = "Tamaño en GB del volumen raíz de la instancia EC2"
  type        = number
  default     = 20
}

variable "app_bucket_name" {
  description = "Nombre del bucket S3 para la aplicacion (debe ser unico globalmente)"
  type        = string
  default     = "smart-campus-uce-app-qa"
}

variable "github_repo_url" {
  description = "URL del repositorio de GitHub para clonar en la instancia EC2"
  type        = string
}

variable "github_branch" {
  description = "Rama del repositorio a desplegar"
  type        = string
  default     = "main"
}
