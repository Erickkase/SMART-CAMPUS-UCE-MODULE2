variable "project_name" {
  description = "Nombre del proyecto para etiquetar recursos"
  type        = string
}

variable "environment" {
  description = "Ambiente de despliegue"
  type        = string
}

variable "vpc_id" {
  description = "ID de la VPC"
  type        = string
}

variable "public_subnet_ids" {
  description = "Lista de IDs de subnets públicas"
  type        = list(string)
}

variable "internet_gateway_id" {
  description = "ID del Internet Gateway (para dependencia de EIP)"
  type        = string
}

variable "allowed_cidr_blocks" {
  description = "CIDRs permitidos para acceso a los servicios"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "service_ports" {
  description = "Puertos de los microservicios a exponer via NLB"
  type        = list(number)
}

variable "health_check_port" {
  description = "Puerto usado para health check de los target groups"
  type        = number
  default     = 3000
}

variable "health_check_path" {
  description = "Path de health check (solo informativo, NLB usa TCP)"
  type        = string
  default     = "/health"
}
