variable "project_name" {
  description = "Nombre del proyecto para etiquetar recursos"
  type        = string
}

variable "environment" {
  description = "Ambiente de despliegue"
  type        = string
}

variable "vpc_id" {
  description = "ID de la VPC donde se desplegara el ASG"
  type        = string
}

variable "subnet_ids" {
  description = "IDs de las subnets públicas donde se desplegara el ASG"
  type        = list(string)
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

variable "root_volume_size" {
  description = "Tamaño en GB del volumen raíz de la instancia"
  type        = number
  default     = 20
}

variable "asg_min_size" {
  description = "Cantidad mínima de instancias en el ASG"
  type        = number
  default     = 1
}

variable "asg_max_size" {
  description = "Cantidad máxima de instancias en el ASG"
  type        = number
  default     = 2
}

variable "asg_desired_capacity" {
  description = "Cantidad deseada de instancias en el ASG"
  type        = number
  default     = 1
}

variable "target_group_arns" {
  description = "Mapa de puertos a ARNs de target groups del NLB"
  type        = map(string)
  default     = {}
}

variable "nlb_security_group_id" {
  description = "ID del security group del NLB (referencia)"
  type        = string
  default     = ""
}

variable "github_repo_url" {
  description = "URL del repositorio de GitHub para clonar en la instancia EC2"
  type        = string
}

variable "github_branch" {
  description = "Rama del repositorio a desplegar"
  type        = string
}

variable "nlb_ip" {
  description = "IP publica fija del NLB para las URLs del frontend"
  type        = string
}
