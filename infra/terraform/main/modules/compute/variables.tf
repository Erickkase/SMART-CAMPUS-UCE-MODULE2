variable "project_name" {
  description = "Nombre del proyecto para etiquetar recursos"
  type        = string
}

variable "environment" {
  description = "Ambiente de despliegue"
  type        = string
}

variable "vpc_id" {
  description = "ID de la VPC donde se desplegará la instancia"
  type        = string
}

variable "subnet_id" {
  description = "ID de la subnet pública donde se desplegará la instancia"
  type        = string
}

variable "instance_type" {
  description = "Tipo de instancia EC2"
  type        = string
  default     = "t3.micro"
}

variable "key_pair_name" {
  description = "Nombre del par de claves SSH para acceso a la instancia"
  type        = string
  default     = ""
}

variable "allowed_cidr_blocks" {
  description = "CIDRs permitidos para acceso HTTP/HTTPS/SSH"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "allowed_service_ports" {
  description = "Puertos adicionales que deben estar abiertos para los microservicios"
  type        = list(number)
  default     = [3000, 3001, 3002, 3003]
}

variable "user_data" {
  description = "Script de inicialización para la instancia EC2"
  type        = string
  default     = ""
}

variable "root_volume_size" {
  description = "Tamaño en GB del volumen raíz de la instancia"
  type        = number
  default     = 20
}
